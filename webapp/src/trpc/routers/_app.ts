import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";
import { subject, teacher } from "@/db/schema";

export const appRouter = createTRPCRouter({
  subjectAdd: baseProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;

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

    return teachers
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

      // Create a new teacher in the database
      const newTeacher = await db.insert(teacher).values({
        name: input.name,
        surname: input.surname,
        paternal: input.paternal,
        email: input.email,
      });
      return newTeacher;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
