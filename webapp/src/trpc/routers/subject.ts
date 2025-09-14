import { db } from "@/db";
import { createTRPCRouter, collaboratorProcedure } from "../init";
import { z } from "zod";
import { subject } from "@/db/schema";

export const subjectRouter = createTRPCRouter({
  subjectAdd: collaboratorProcedure
    .input(z.object({ name: z.string(), fullName: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;

      const existingSubject = await db.query.subject.findFirst({
        where: (subj, { eq }) => eq(subj.fullName, input.fullName),
      });

      if (existingSubject) {
        throw new Error("Предмет с таким именем уже существует");
      }

      // Create a new subject in the database
      const newSubject = await db.insert(subject).values({
        name: input.name,
        fullName: input.fullName,
      });

      return newSubject;
    }),
  subjectList: collaboratorProcedure.query(async () => {
    // Retrieve subjects from a datasource, this is an imaginary database
    const subjects = await db.query.subject.findMany({
      where: (subj, { eq }) => eq(subj.deleted, false),
    });

    return subjects;
  }),
});
