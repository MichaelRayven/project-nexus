import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { trpc } from "@/trpc/server";
import { addDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import { headers } from "next/dist/server/request/headers";
import { TaskView } from "./task-view";

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-fd-container mx-auto">
          {days.map((day, index) => (
            <div key={index} className="relative group">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow max-h-96 h-full overflow-y-auto">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-primary">
                      {day.date}
                    </div>
                  </div>
                  <CardTitle className="text-lg capitalize">
                    {day.weekday}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {day.tasks.map((task) => (
                    <TaskView key={task.id} issue={task} />
                  ))}
                </CardContent>
              </Card>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
