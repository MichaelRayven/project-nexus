import { addDays, parse } from "date-fns";
import { format } from "date-fns/format";
import { ru } from "date-fns/locale";
import { IssueDialog } from "./issue-dialog";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { trpc } from "@/trpc/server";
import { TaskDisplay } from "./task-display";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function TaskTracker() {
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
      date: format(updatedDate, "PPP", { locale: ru }),
      tasks: data?.[i] || [],
    };
  });

  return (
    <div className="flex gap-4 overflow-x-auto py-4 justify-center flex-wrap md:px-32">
      {days.map((day, idx) => (
        <Card key={idx} className="min-w-[450px] flex-shrink-0">
          <CardHeader>
            <CardTitle>{day.date}</CardTitle>
            <CardDescription>
              {day.tasks.length ? `${day.tasks.length} задач` : "Задач нет"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {day.tasks.map((issue) => (
                  <TaskDisplay key={issue.id} issue={issue} />
                ))}
              </div>
            }
          </CardContent>
          <CardFooter>
            <IssueDialog
              trigger={
                <Button variant="outline" className="w-full">
                  Добавить задачу
                </Button>
              }
              initialDeadline={parse(day.date, "PPP", new Date(), {
                locale: ru,
              })}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
