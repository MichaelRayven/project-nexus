import { db } from "@/db";
import { formatCategory, formatDuration, getFullName } from "@/lib/utils";
import { addDays, format, parse } from "date-fns";
import { z } from "zod";
import {
  authedProcedure,
  collaboratorProcedure,
  createTRPCRouter,
} from "../init";

export const issueRouter = createTRPCRouter({
  issueListDay: authedProcedure
    .input(
      z.object({
        date: z.string(), // ISO string
      })
    )
    .query(async (opts) => {
      const { date } = opts.input;

      const deadlineDate = parse(
        date,
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
  issueListWeek: authedProcedure.query(async () => {
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
});
