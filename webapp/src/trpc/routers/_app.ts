import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";
import { subject } from "@/db/schema";

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
    const subjects = await db.query.subject.findMany();

    return subjects;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
