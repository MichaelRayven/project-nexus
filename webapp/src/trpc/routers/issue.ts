import { db } from "@/db";
import { githubGraphQL } from "@/graphql/client";
import { GetIssuesByLabel, GetIssueByNumber } from "@/graphql/queries";
import { CreateLinkedBranch } from "@/graphql/mutations";
import { GetIssuesByLabelQuery } from "@/graphql/types";
import {
  formatCategory,
  formatDuration,
  getFullName,
  TIMEZONE,
} from "@/lib/utils";
import { addDays, parse } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import { z } from "zod";
import {
  authedProcedure,
  collaboratorProcedure,
  createTRPCRouter,
} from "../init";
import { IssueNode } from "@/lib/interface";
import { CreateLinkedBranchMutation } from "@/lib/github-types";

export const issueRouter = createTRPCRouter({
  getById: authedProcedure
    .input(
      z.object({
        issueId: z.number(),
      })
    )
    .query(async (opts): Promise<IssueNode | null> => {
      const { issueId } = opts.input;

      try {
        const result = await githubGraphQL.request<{
          repository: { issue: IssueNode | null };
        }>(GetIssueByNumber, {
          owner: process.env.GITHUB_REPOSITORY_OWNER,
          name: process.env.GITHUB_REPOSITORY_NAME,
          number: issueId,
        });

        return result.repository?.issue || null;
      } catch (error) {
        console.error("GraphQL error:", error);
        throw new Error("Не удалось получить задачу");
      }
    }),
  issueListDay: authedProcedure
    .input(
      z.object({
        date: z.string(), // ISO string
      })
    )
    .query(async (opts): Promise<IssueNode[]> => {
      const { date } = opts.input;

      const parsed = parse(
        date,
        "yyyy-MM-dd'T'HH:mm:ss.SSSX",
        toZonedTime(new Date(), TIMEZONE)
      );
      const deadlineDate = fromZonedTime(parsed, TIMEZONE);
      const deadlineLabel = `дедлайн:${formatInTimeZone(
        deadlineDate,
        TIMEZONE,
        "MM-dd-yyyy"
      )}`;

      try {
        const result = await githubGraphQL.request<GetIssuesByLabelQuery>(
          GetIssuesByLabel,
          {
            owner: process.env.GITHUB_REPOSITORY_OWNER,
            name: process.env.GITHUB_REPOSITORY_NAME,
            labels: [deadlineLabel],
            first: 100,
            orderBy: { field: "CREATED_AT", direction: "DESC" },
          }
        );

        const issues = result.repository?.issues.nodes || [];
        return issues;
      } catch (error) {
        console.error("GraphQL error:", error);
        throw new Error("Не удалось получить задачи");
      }
    }),
  issueListWeek: authedProcedure.query(async (): Promise<IssueNode[][]> => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = toZonedTime(new Date(), TIMEZONE);
      const updatedDate = addDays(date, i);
      return formatInTimeZone(updatedDate, TIMEZONE, "MM-dd-yyyy");
    });

    const results = await Promise.all(
      dates.map(async (date) => {
        const deadlineLabel = `дедлайн:${date}`;

        try {
          const result = await githubGraphQL.request<GetIssuesByLabelQuery>(
            GetIssuesByLabel,
            {
              owner: process.env.GITHUB_REPOSITORY_OWNER,
              name: process.env.GITHUB_REPOSITORY_NAME,
              labels: [deadlineLabel],
              first: 100,
              orderBy: { field: "CREATED_AT", direction: "DESC" },
            }
          );

          const issues = result.repository?.issues.nodes || [];
          return issues;
        } catch (error) {
          console.error("GraphQL error for date", date, ":", error);
          return []; // Return empty array for failed requests
        }
      })
    );

    return results;
  }),
  issueAdd: collaboratorProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        duration: z.enum(["short", "medium", "long"]),
        category: z.enum(["homework", "labwork", "coursework", "other"]),
        subject: z.string(),
        teacher: z.string(),
        deadline: z.string(),
        resources: z.array(
          z.object({
            name: z.string(),
            url: z.url(),
            type: z.enum(["link", "image"]),
          })
        ),
      })
    )
    .mutation(async (opts): Promise<string> => {
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

      const parsed = parse(
        input.deadline,
        "MM-dd-yyyy",
        toZonedTime(new Date(), TIMEZONE)
      );
      const deadlineDate = fromZonedTime(parsed, TIMEZONE);

      // Check only the day
      const now = toZonedTime(new Date(), TIMEZONE);
      const targetDate = toZonedTime(deadlineDate, TIMEZONE);
      if (now > targetDate) {
        throw new Error("Срок сдачи не может быть в прошлом");
      }

      // Create a new issue in the database
      let body = `${input.description}`;

      if (input.resources.length) {
        body += `\n\nРесурсы:\n${input.resources
          .map((res) =>
            res.type === "link"
              ? `- [${res.name}](${res.url})`
              : `- ![${res.name}](${res.url})`
          )
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
            "X-GitHub-Api-Version": "2022-11-28",
          },
          body: JSON.stringify({
            title: input.title,
            body: body,
            labels: [
              `Дедлайн:${formatInTimeZone(
                deadlineDate,
                TIMEZONE,
                "MM-dd-yyyy"
              )}`,
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
  createLinkedBranch: collaboratorProcedure
    .input(
      z.object({
        issueId: z.string(),
        name: z.string(),
      })
    )
    .mutation(
      async (opts): Promise<{ success: boolean; linkedBranchId?: string }> => {
        const { issueId, name } = opts.input;

        try {
          // Get the default branch HEAD commit SHA and repository ID
          const repoResult = await githubGraphQL.request<{
            repository: {
              id: string;
              defaultBranchRef: { target: { oid: string } };
            };
          }>(
            `query GetDefaultBranch($owner: String!, $name: String!) {
              repository(owner: $owner, name: $name) {
                id
                defaultBranchRef {
                  target {
                    ... on Commit {
                      oid
                    }
                  }
                }
              }
            }`,
            {
              owner: process.env.GITHUB_REPOSITORY_OWNER,
              name: process.env.GITHUB_REPOSITORY_NAME,
            }
          );

          if (
            !repoResult.repository?.defaultBranchRef?.target?.oid ||
            !repoResult.repository?.id
          ) {
            throw new Error("Не удалось получить информацию о репозитории");
          }

          const result =
            await githubGraphQL.request<CreateLinkedBranchMutation>(
              CreateLinkedBranch,
              {
                input: {
                  issueId: issueId,
                  name: `refs/heads/${name}`,
                  oid: repoResult.repository.defaultBranchRef.target.oid,
                  repositoryId: repoResult.repository.id,
                },
              }
            );

          console.log("CreateLinkedBranch result:", result);

          if (result.createLinkedBranch?.linkedBranch?.id) {
            return {
              success: true,
              linkedBranchId: result.createLinkedBranch.linkedBranch.id,
            };
          } else {
            throw new Error("Не удалось создать связанную ветку");
          }
        } catch (error) {
          console.error("GraphQL error:", error);
          throw new Error("Не удалось создать связанную ветку для задачи");
        }
      }
    ),
});
