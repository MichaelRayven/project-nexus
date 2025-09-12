import { auth } from "@/lib/auth";
import { trpc } from "@/trpc/server";
import { addDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import { headers } from "next/dist/server/request/headers";
import { TaskTracker } from "./task-tracker";

export async function TasksSection() {
  // Generate dates for the 7-day sliding window (today + next 6 days)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Skip rendering if user is not authenticated
  if (!session) return null;

  const data = await trpc.issuesWeek();

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    const updatedDate = addDays(date, i);

    return {
      date: format(updatedDate, "P", { locale: ru }),
      weekday: format(updatedDate, "EEEE", { locale: ru }),
      tasks: data?.[i] || [],
    };
  });

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
