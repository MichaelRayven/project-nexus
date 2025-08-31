"use client";

import { trpc } from "@/trpc/client";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { format } from "date-fns/format";
import { ru } from "date-fns/locale";
import { addDays } from "date-fns";



export function TaskTracker() {
  // Generate dates for the 7-day sliding window (today + next 6 days)
  const { data } = trpc.issuesWeek.useQuery();  

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    const updatedDate = addDays(date, i);

    return {
      date: format(updatedDate, "PPP", { locale: ru }),
      tasks: data?.[i] || [],
    }
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
              day.tasks.length ? (
                <ul className="space-y-2">
                  {day.tasks.map((issue) => (
                    <li key={issue.id} className="flex gap-2">
                      <Link href={issue.html_url} target="_blank" className="underline underline-offset-3">
                        {issue.title}
                      </Link>
                        <div className="flex w-full flex-wrap gap-2">
                          {issue.labels.filter(label => !label.name.includes("deadline")).map(label => (
                            <Badge key={label.id} className="text-xs">
                              {label.name.split(":")[1]}
                            </Badge>
                          ))}
                        </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted-foreground text-sm">
                  No tasks for this day.
                </div>
              )
            }
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Add Task
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}