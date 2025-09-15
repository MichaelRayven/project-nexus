"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/trpc/client";
import { addDays } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { TIMEZONE } from "@/lib/utils";
import { TaskView } from "./task-view";
import { IssueDialog } from "./issue-dialog";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

export function TaskTracker() {
  const { data } = trpc.issueListWeek.useQuery();

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = toZonedTime(new Date(), TIMEZONE);
    const updatedDate = addDays(date, i);

    return {
      date: updatedDate,
      formattedDate: formatInTimeZone(updatedDate, TIMEZONE, "P", {
        locale: ru,
      }),
      weekday: formatInTimeZone(updatedDate, TIMEZONE, "EEEE", { locale: ru }),
      tasks: data?.[i] || [],
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-fd-container mx-auto">
      {days.map((day, index) => (
        <div key={index} className="relative group overflow-hidden rounded-xl">
          <Card className="hover:shadow-lg transition-shadow max-h-96 h-full overflow-y-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 justify-between">
                <div className="text-sm font-medium text-primary">
                  {day.formattedDate}
                </div>
                <IssueDialog
                  initialDeadline={day.date}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <PlusIcon />
                    </Button>
                  }
                />
              </div>
              <CardTitle className="text-lg capitalize">
                {day.weekday}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {day.tasks
                .filter((task) => task !== null)
                .map((task) => (
                  <TaskView key={task.id} issue={task} />
                ))}
            </CardContent>
          </Card>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </div>
      ))}
    </div>
  );
}
