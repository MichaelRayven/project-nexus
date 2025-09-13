import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { baseProcedure, createTRPCRouter, mergeRouters } from "../init";
import { issueRouter } from "./issue";
import { storageRouter } from "./storage";
import { subjectRouter } from "./subject";
import { teacherRouter } from "./teacher";

const baseRouter = createTRPCRouter({
  collaboratorsList: baseProcedure.query(async () => {
    // Fetch collaborators from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.GITHUB_REPOSITORY_NAME}/collaborators`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      console.error("GitHub API response:", await response.text());
      throw new Error("Не удалось получить список участников");
    }

    const collaborators = await response.json();
    return collaborators;
  }),
  issueAssignSelf: baseProcedure
    .input(
      z.object({
        issueId: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      // Get session
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      // Get account id
      if (!session || !session.user || !session.user.id) {
        throw new Error("Необходимо войти в систему");
      }

      const account = await db.query.account.findFirst({
        where: (acc, { and, eq }) => and(eq(acc.userId, session.user.id)),
      });

      // Fetch GitHub username using the account ID
      const userResponse = await fetch(
        `https://api.github.com/user/${account!.accountId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      if (!userResponse.ok) {
        console.error("GitHub API response:", await userResponse.text());
        throw new Error("Не удалось получить данные пользователя");
      }
      const userData = await userResponse.json();
      const userLogin = userData.login;

      const response = await fetch(
        `https://api.github.com/repos/MichaelRayven/project-nexus/issues/${input.issueId}/assignees`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          body: JSON.stringify({ assignees: userLogin }),
        }
      );
      if (!response.ok) {
        console.error("GitHub API response:", await response.text());
        throw new Error("Не удалось назначить себя исполнителем");
      }
      return await response.json();
    }),
});

export const appRouter = mergeRouters(
  baseRouter,
  teacherRouter,
  subjectRouter,
  storageRouter,
  issueRouter
);

// export type definition of API
export type AppRouter = typeof appRouter;
