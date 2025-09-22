import { db } from "@/db";
import { githubGraphQL } from "@/graphql/client";
import { CreateLinkedBranch } from "@/graphql/mutations";
import { GetAllRepositoryIssues, GetIssueByNumber } from "@/graphql/queries";
import { GetAllRepositoryIssuesQuery } from "@/graphql/types";
import { CreateLinkedBranchMutation } from "@/lib/github-types";
import { IssueNode } from "@/lib/interface";
import {
  formatCategory,
  formatDuration,
  getFullName,
  TIMEZONE,
} from "@/lib/utils";
import { addDays, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";
import {
  authedProcedure,
  collaboratorProcedure,
  createTRPCRouter,
} from "../init";

// Cache all repository issues for 5 minutes
const getAllRepositoryIssues = unstable_cache(
  async (): Promise<IssueNode[]> => {
    try {
      const result = await githubGraphQL.request<GetAllRepositoryIssuesQuery>(
        GetAllRepositoryIssues,
        {
          owner: process.env.GITHUB_REPOSITORY_OWNER!,
          name: process.env.GITHUB_REPOSITORY_NAME!,
          first: 100,
          orderBy: { field: "CREATED_AT", direction: "DESC" },
        }
      );

      return (result.repository?.issues.nodes || []).filter(
        (issue): issue is NonNullable<typeof issue> => issue !== null
      );
    } catch (error) {
      console.error("GraphQL error:", error);
      return [];
    }
  },
  ["all-repository-issues"],
  {
    revalidate: 300, // 5 minutes
    tags: ["issues"],
  }
);

export const issueRouter = createTRPCRouter({
  issueByNumber: authedProcedure
    .input(
      z.object({
        issueNumber: z.number(),
      })
    )
    .query(async (opts): Promise<IssueNode | null> => {
      const { issueNumber } = opts.input;

      try {
        const result = await githubGraphQL.request<{
          repository: { issue: IssueNode | null };
        }>(GetIssueByNumber, {
          owner: process.env.GITHUB_REPOSITORY_OWNER,
          name: process.env.GITHUB_REPOSITORY_NAME,
          number: issueNumber,
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
        deadline: z.number(),
      })
    )
    .query(async (opts): Promise<IssueNode[]> => {
      const { input } = opts;

      const deadlineDate = new Date(input.deadline);
      const deadlineLabel = `Дедлайн:${formatInTimeZone(
        deadlineDate,
        TIMEZONE,
        "MM-dd-yyyy"
      )}`;

      // Get all issues from cache
      const allIssues = await getAllRepositoryIssues();

      // Filter issues by deadline label
      return allIssues.filter((issue) =>
        issue?.labels?.nodes?.some((label) => label?.name === deadlineLabel)
      );
    }),
  issueListWeek: authedProcedure.query(async (): Promise<IssueNode[][]> => {
    // Use a fixed reference date to ensure consistency between server and client
    const baseDate = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const updatedDate = addDays(baseDate, i);
      return formatInTimeZone(updatedDate, TIMEZONE, "MM-dd-yyyy", {
        locale: ru,
      });
    });

    // Get all issues from cache
    const allIssues = await getAllRepositoryIssues();

    // Group issues by date
    const results = dates.map((date) => {
      const deadlineLabel = `Дедлайн:${date}`;
      return allIssues.filter((issue) =>
        issue?.labels?.nodes?.some((label) => label?.name === deadlineLabel)
      );
    });

    return results;
  }),
  issueListRange: authedProcedure
    .input(
      z.object({
        startDate: z.number(),
        endDate: z.number(),
      })
    )
    .query(async (opts): Promise<{ [key: string]: IssueNode[] }> => {
      const { startDate, endDate } = opts.input;

      const start = new Date(startDate);
      const end = new Date(endDate);
      const dates: string[] = [];

      // Generate all dates in the range
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(formatInTimeZone(d, TIMEZONE, "MM-dd-yyyy"));
      }

      // Get all issues from cache
      const allIssues = await getAllRepositoryIssues();

      // Group issues by date
      const results: { [key: string]: IssueNode[] } = {};
      dates.forEach((date) => {
        const deadlineLabel = `Дедлайн:${date}`;
        results[date] = allIssues.filter((issue) =>
          issue?.labels?.nodes?.some((label) => label?.name === deadlineLabel)
        );
      });

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
        deadline: z.number(),
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

      const deadlineDate = new Date(input.deadline);

      if (new Date() > addDays(deadlineDate, 1)) {
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

      // Invalidate the issues cache when a new issue is created
      revalidateTag("issues");

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
