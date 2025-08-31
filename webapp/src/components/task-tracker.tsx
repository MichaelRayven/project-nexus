"use client";

import { trpc } from "@/trpc/client";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { format } from "date-fns/format";
import { ru } from "date-fns/locale";
import { addDays, parse } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IssueDialog } from "./issue-dialog";

function IssueDisplay({ issue }: { issue: GitHubIssue }) {
  return (
    <div key={issue.id} className="flex flex-col gap-2 p-4 border rounded-lg">
      {/* Labels */}
      <div className="flex flex-wrap gap-2">
        {issue.labels
          .filter((label) => !label.name.includes("deadline"))
          .map((label) => (
            <Badge
              key={label.id}
              className="text-xs"
              style={{ backgroundColor: `#${label.color}` }}
            >
              {label.name.split(":")[1] || label.name}
            </Badge>
          ))}
      </div>

      {/* Title as Link with Status */}
      <div className="flex items-center gap-2">
        <Link
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-3 hover:text-blue-600"
        >
          {issue.title}
        </Link>
        <Badge
          variant={issue.state === "open" ? "default" : "secondary"}
          className="text-xs"
        >
          {issue.state}
        </Badge>
      </div>

      {/* Assignees */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Assignees:</span>
        {issue.assignees.length > 0 ? (
          <div className="flex -space-x-2">
            {issue.assignees.map((assignee) => (
              <Link
                key={assignee.id}
                href={assignee.html_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                title={assignee.login}
              >
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage
                    src={assignee.avatar_url || ""}
                    alt={assignee.login}
                  />
                  <AvatarFallback>
                    {assignee.login.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-500">None</span>
        )}
      </div>
    </div>
  );
}

export function TaskTracker() {
  // Generate dates for the 7-day sliding window (today + next 6 days)
  const { data } = trpc.issuesWeek.useQuery();

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
                  <IssueDisplay key={issue.id} issue={issue} />
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
              initialDeadline={parse(day.date, "PPP", new Date(), { locale: ru })}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
