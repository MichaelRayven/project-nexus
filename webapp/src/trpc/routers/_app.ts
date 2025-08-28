import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  subjectList: baseProcedure.query(async () => {
    // Retrieve subjects from a datasource, this is an imaginary database
    const subjects = await db.query.subject.findMany();

    return subjects;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
