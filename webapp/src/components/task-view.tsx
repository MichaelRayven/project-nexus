"use client";

import { cn, getIssueStatus } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CardTitle } from "./ui/card";
import { authClient } from "@/lib/auth-client";
import { UsersIcon, BookOpenIcon } from "lucide-react";

export function TaskView({ issue }: { issue: GitHubIssue }) {
  const mutation = trpc.issueAssignSelf.useMutation();
  const utils = trpc.useUtils();
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const onAssignSelf = async () => {
    mutation.mutate(
      { issueId: issue.number },
      {
        onSuccess: () => {
          utils.issueListWeek.invalidate();
        },
      }
    );
  };

  const labels = [...issue.labels];
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

  const isAssignee = issue.assignees.some(
    (assignee) => assignee.login === session?.user.username
  );

  return (
    <div key={issue.id}>
      <div className="pb-4">
        <div className="flex items-center space-x-3 justify-between">
          <div className="text-sm font-medium text-primary">
            Задача #{issue.number}
          </div>

          {/* Status Badge */}
          <div className="flex justify-end">
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
        </div>
        <CardTitle className="text-lg">
          <Link
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors line-clamp-3"
          >
            {issue.title}
          </Link>
        </CardTitle>
      </div>

      <div>
        {/* Labels */}
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Details */}
        <div className="space-y-3">
          {subjectLabel && (
            <div className="flex items-center gap-2 text-sm">
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Предмет:</span>
              <span>{subjectLabel.name.split(":")[1]}</span>
            </div>
          )}

          {teacherLabel && (
            <div className="flex items-center gap-2 text-sm">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Преподаватель:</span>
              <span>{teacherLabel.name.split(":")[1]}</span>
            </div>
          )}

          {/* Assignees */}
          <div className="flex items-center gap-2 text-sm">
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Исполнители:</span>
            {issue.assignees.length > 0 ? (
              <div className="flex -space-x-2">
                {issue.assignees.map((assignee) => (
                  <Link
                    key={assignee.id}
                    href={assignee.html_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={assignee.login}
                    className="flex items-center gap-1"
                  >
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage
                        src={assignee.avatar_url || ""}
                        alt={assignee.login}
                      />
                      <AvatarFallback className="text-xs">
                        {assignee.login.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">отсутствуют</span>
            )}
          </div>

          {/* Assign Self Button */}
          {!isAssignee && (
            <div className="pt-2">
              <Button
                onClick={onAssignSelf}
                size="sm"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Назначаем..." : "Выполнить"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </div>
  );
}
