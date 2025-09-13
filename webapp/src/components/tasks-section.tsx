import { auth } from "@/lib/auth";
import { headers } from "next/dist/server/request/headers";
import { TaskTracker } from "./task-tracker";

export async function TasksSection() {
  // Generate dates for the 7-day sliding window (today + next 6 days)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Skip rendering if user is not authenticated
  if (!session) return null;

  return (
    <section id="features" className="py-24 bg-muted/30">
      {/* Added container with proper spacing for workflow cards */}
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Задачи на неделю
          </h2>
          <p className="text-lg text-muted-foreground mt-4 text-pretty max-w-2xl mx-auto">
            Здесь вы можете посмотреть задачи на ближайшие 7 дней.
          </p>
        </div>

        <TaskTracker />
      </div>
    </section>
  );
}
