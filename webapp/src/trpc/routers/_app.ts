import { db } from "@/db";
import { subject, teacher } from "@/db/schema";
import { auth } from "@/lib/auth";
import { formatCategory, formatDuration, getFullName } from "@/lib/utils";
import { addDays, format, parse } from "date-fns";
import { headers } from "next/headers";
import { z } from "zod";
import { baseProcedure, createTRPCRouter, mergeRouters } from "../init";
import { teacherRouter } from "./teacher";
import { subjectRouter } from "./subject";
import { storageRouter } from "./storage";

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
  issueAdd: baseProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        duration: z.enum(["short", "medium", "long"]),
        category: z.enum(["homework", "labwork", "coursework", "other"]),
        subject: z.string(),
        teacher: z.string(),
        deadline: z.string(),
        resources: z.array(z.object({ name: z.string(), url: z.url() })),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      const subjectExists = await db.query.subject.findFirst({
        where: (subj, { and, eq }) =>
          and(eq(subj.id, input.subject), eq(subj.deleted, false)),
      });

      if (!subjectExists) {
        throw new Error("Указанный предмет не существует");
      }

      const teacherExists = await db.query.teacher.findFirst({
        where: (teach, { and, eq }) =>
          and(eq(teach.id, input.teacher), eq(teach.deleted, false)),
      });
      if (!teacherExists) {
        throw new Error("Указанный преподаватель не существует");
      }

      const deadlineDate = parse(input.deadline, "MM-dd-yyyy", new Date());

      // Check only the day
      if (deadlineDate < new Date()) {
        throw new Error("Срок сдачи не может быть в прошлом");
      }

      // Create a new issue in the database
      let body = `${input.description}`;

      if (input.resources.length) {
        body += `\n\nРесурсы:\n${input.resources
          .map((res) => `- [${res.name}](${res.url})`)
          .join("\n")}`;
      }

      body += `\n\n---\n*Перед тем как начать выполнять задание, не забудьте назначить себя исполнителем.*`;

      const response = await fetch(
        `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.GITHUB_REPOSITORY_NAME}/issues`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: input.title,
            body: body,
            labels: [
              `Дедлайн:${format(deadlineDate, "MM-dd-yyyy")}`,
              `Преподаватель:${getFullName(teacherExists)}`,
              `Предмет:${subjectExists.name}`,
              `Длительность:${formatDuration(input.duration)}`,
              `Категория:${formatCategory(input.category)}`,
            ],
          }),
        }
      );

      if (!response.ok) {
        console.error("GitHub API response:", await response.text());
        throw new Error("Не удалось создать задачу");
      }

      return "Задача успешно создана";
    }),
  issueList: baseProcedure
    .input(
      z.object({
        deadline: z.string(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;

      const deadlineDate = parse(
        input.deadline,
        "yyyy-MM-dd'T'HH:mm:ss.SSSX",
        new Date()
      );

      const response = await fetch(
        `https://api.github.com/search/issues?q=label:дедлайн:${format(
          deadlineDate,
          "MM-dd-yyyy"
        )}+state:open+is:issue+repo:${process.env.GITHUB_REPOSITORY_OWNER}/${
          process.env.GITHUB_REPOSITORY_NAME
        }`,
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
        throw new Error("Не удалось получить задачи");
      }

      const issues = await response.json();
      return issues.items;
    }),
  issuesWeek: baseProcedure.query(async () => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      const updatedDate = addDays(date, i);
      return format(updatedDate, "MM-dd-yyyy");
    });

    const results = await Promise.all(
      dates.map(async (date) => {
        const res = await fetch(
          `https://api.github.com/search/issues?q=label:дедлайн:${date}+is:issue+repo:${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.GITHUB_REPOSITORY_NAME}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              Accept: "application/vnd.github+json",
            },
          }
        );
        const data = await res.json();
        return data.items as GitHubIssue[];
      })
    );

    return results;
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
      return (await response.json()) as GitHubIssue;
    }),
});

export const appRouter = mergeRouters(
  baseRouter,
  teacherRouter,
  subjectRouter,
  storageRouter
);

// export type definition of API
export type AppRouter = typeof appRouter;
