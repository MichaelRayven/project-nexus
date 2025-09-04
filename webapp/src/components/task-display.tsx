"use client";

import { cn, getIssueStatus } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function TaskDisplay({ issue }: { issue: GitHubIssue }) {
  const mutation = trpc.issueAsignSelf.useMutation();
  const utils = trpc.useUtils();

  const onAssignSelf = async () => {
    mutation.mutate(
      { issueId: issue.number },
      {
        onSuccess: () => {
          utils.issuesWeek.invalidate();
        },
      }
    );
  };

  const labels = [...issue.labels];
  const deadlineIdx = labels.findIndex((label) =>
    label.name.includes("Дедлайн:")
  );
  const deadlineLabel =
    deadlineIdx !== -1 ? labels.splice(deadlineIdx, 1)[0] : undefined;
  const teacherIdx = labels.findIndex((label) =>
    label.name.includes("Преподаватель:")
  );
  const teacherLabel =
    teacherIdx !== -1 ? labels.splice(teacherIdx, 1)[0] : undefined;
  const subjectIdx = labels.findIndex((label) =>
    label.name.includes("Предмет:")
  );
  const subjectLabel =
    subjectIdx !== -1 ? labels.splice(subjectIdx, 1)[0] : undefined;

  const status = getIssueStatus(issue);

  return (
    <div key={issue.id} className="flex flex-col gap-2 p-4 border rounded-lg">
      {/* Labels */}
      <div className="flex flex-wrap gap-2">
        {labels
          .filter((label) => !label.name.toLowerCase().includes("дедлайн"))
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

      <div className="flex items-center justify-between gap-2">
        <Link
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-3"
        >
          {issue.title}
        </Link>
        <Badge
          variant="default"
          className={cn(
            "text-xs",
            status.color === "green"
              ? "bg-green-100 text-green-800"
              : status.color === "red"
              ? "bg-red-100 text-red-800"
              : status.color === "yellow"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          )}
        >
          {status.status}
        </Badge>
      </div>

      {/* Assignees */}
      <div className="flex flex-col items-start gap-2">
        <span className="text-sm font-medium">
          Предмет: {subjectLabel?.name.split(":")[1]}
        </span>
        <span className="text-sm font-medium">
          Преподаватель: {teacherLabel?.name.split(":")[1]}
        </span>
        <div className="flex gap-4 items-center">
          <span className="text-sm font-medium">Исполнители:</span>
          {issue.assignees.length > 0 ? (
            <div className="flex -space-x-2">
              {issue.assignees.map((assignee) => (
                <Link
                  key={assignee.id}
                  href={assignee.html_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={assignee.login}
                  className="flex items-center gap-2 text-sm"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={assignee.avatar_url || ""}
                      alt={assignee.login}
                    />
                    <AvatarFallback>
                      {assignee.login.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{assignee.login}</span>
                </Link>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500">отсутствуют</span>
          )}
        </div>
        <Button variant="secondary" onClick={onAssignSelf}>
          Назначить себя исполнителем
        </Button>
      </div>
    </div>
  );
}
