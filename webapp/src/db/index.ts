import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  account,
  session,
  subject,
  teacher,
  user,
  verification,
} from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    subject: subject,
    user: user,
    session: session,
    teacher: teacher,
    account: account,
    verification: verification,
  },
});
