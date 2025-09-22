"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TIMEZONE } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { PlusIcon } from "lucide-react";
import { IssueDialog } from "./issue-dialog";
import { TaskView } from "./task-view";
import { Button } from "./ui/button";
import { GridContainer } from "./ui/layout/grid-container";

export function TaskTracker() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.issueListWeek.queryOptions());

  const baseDate = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    // Use the same date generation logic as the server to ensure consistency
    const updatedDate = addDays(baseDate, i);

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
    <GridContainer>
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
            <CardContent className="space-y-4">
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
    </GridContainer>
  );
}
