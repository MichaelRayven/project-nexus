import { db } from "@/db";
import { createTRPCRouter, collaboratorProcedure } from "../init";
import { z } from "zod";
import { teacher } from "@/db/schema";

export const teacherRouter = createTRPCRouter({
  teacherList: collaboratorProcedure.query(async () => {
    // Retrieve teachers from a datasource, this is an imaginary database
    const teachers = await db.query.teacher.findMany({
      where: (teach, { eq }) => eq(teach.deleted, false),
    });

    return teachers;
  }),
  teacherAdd: collaboratorProcedure
    .input(
      z.object({
        name: z.string(),
        surname: z.string(),
        paternal: z.string(),
        email: z.email(),
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
});
