import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";
import { subject, teacher } from "@/db/schema";
import { addDays, format, parse } from "date-fns";

export const appRouter = createTRPCRouter({
  subjectAdd: baseProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;

      const existingSubject = await db.query.subject.findFirst({
        where: (subj, { eq }) => eq(subj.name, input.name),
      });

      if (existingSubject) {
        throw new Error("Предмет с таким именем уже существует");
      }

      // Create a new subject in the database
      const newSubject = await db.insert(subject).values({
        name: input.name,
      });

      return newSubject;
    }),
  subjectList: baseProcedure.query(async () => {
    // Retrieve subjects from a datasource, this is an imaginary database
    const subjects = await db.query.subject.findMany({
      where: (subj, { eq }) => eq(subj.deleted, false),
    });

    return subjects;
  }),
  teacherList: baseProcedure.query(async () => {
    // Retrieve teachers from a datasource, this is an imaginary database
    const teachers = await db.query.teacher.findMany({
      where: (teach, { eq }) => eq(teach.deleted, false),
    });

    return teachers;
  }),
  teacherAdd: baseProcedure
    .input(
      z.object({
        name: z.string(),
        surname: z.string(),
        paternal: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      const existingTeacher = await db.query.teacher.findFirst({
        where: (teach, { and, eq }) =>
          and(
            eq(teach.name, input.name),
            eq(teach.surname, input.surname),
            eq(teach.paternal, input.paternal)
          ),
      });

      if (existingTeacher) {
        throw new Error("Учитель с таким полным именем уже существует");
      }

      const existingEmail = await db.query.teacher.findFirst({
        where: (teach, { eq }) => eq(teach.email, input.email),
      });

      if (existingEmail) {
        throw new Error("Учитель с такой электронной почтой уже существует");
      }

      // Create a new teacher in the database
      const newTeacher = await db.insert(teacher).values({
        name: input.name,
        surname: input.surname,
        paternal: input.paternal,
        email: input.email,
      });
      return newTeacher;
    }),
  issueAdd: baseProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
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
        throw new Error("Указанный учитель не существует");
      }

      const deadlineDate = parse(
        input.deadline,
        "yyyy-MM-dd'T'HH:mm:ss.SSSX",
        new Date()
      );

      // Check only the day
      // if (deadlineDate < new Date()) {
      //   throw new Error("Срок сдачи не может быть в прошлом");
      // }

      // Create a new issue in the database
      let body = `${input.description}`

      if (input.resources.length) {
        body += `\n\nResources:\n${input.resources
          .map((res) => `- [${res.name}](${res.url})`)
          .join("\n")}`;
      }

      body += `\n\n---\n*Перед тем как начать выполнять задание, не забудьте назначить себя исполнителем.*`

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
              `deadline:${format(deadlineDate, "MM-dd-yyyy")}`,
              `teacher:${teacherExists.name} ${teacherExists.surname} ${teacherExists.paternal}`,
              `subject:${subjectExists.name}`,
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
        `https://api.github.com/search/issues?q=label:deadline:${format(deadlineDate, "MM-dd-yyyy")}+state:open+is:issue+repo:${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.GITHUB_REPOSITORY_NAME}`,
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
            `https://api.github.com/search/issues?q=label:deadline:${date}+state:open+is:issue+repo:${process.env.GITHUB_REPOSITORY_OWNER}/${process.env.GITHUB_REPOSITORY_NAME}`,
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
          
      }));

      return results;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
