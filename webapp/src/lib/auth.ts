import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  telemetry: { enabled: false },
  user: {
    additionalFields: {
      username: { type: "string", required: true },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          username: profile.login,
        };
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
