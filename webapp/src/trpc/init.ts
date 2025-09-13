import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { User } from "better-auth";
import { headers } from "next/headers";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { user: null };
});

type Context = {
  /**
   * User is nullable
   */
  user: User | null;
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;

export const authedProcedure = baseProcedure.use(async (opts) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({ ctx: { user: session.user } });
});

export const collaboratorProcedure = authedProcedure.use(async (opts) => {
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
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
  const collaborators = await response.json();
  if (
    !collaborators.some(
      (collaborator: any) => collaborator.login === opts.ctx.user.username
    )
  ) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return opts.next({ ctx: { user: opts.ctx.user } });
});
