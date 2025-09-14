"use client";

import { IssueNode } from "@/lib/interface";
import { cn } from "@/lib/utils";
import { BookOpenIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { CardTitle } from "./ui/card";
import { useIssue } from "@/hooks/use-issue";

export function TaskView({ issue }: { issue: NonNullable<IssueNode> }) {
  const { teacherLabel, subjectLabel, categoryLabel, durationLabel, status } =
    useIssue({
      issueId: issue.number,
    });

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
                status?.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : status?.status === "EXPIRED"
                  ? "bg-red-100 text-red-800"
                  : status?.status === "IN_PROGRESS"
                  ? "bg-yellow-100 text-yellow-800"
                  : status?.status === "IN_REVIEW"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              {status?.message}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg">
          <Link
            href={`/task/${issue.number}`}
            className="hover:text-primary transition-colors line-clamp-3"
          >
            {issue.title}
          </Link>
        </CardTitle>
      </div>

      <div>
        {/* Labels */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            key={categoryLabel?.id}
            className="text-xs"
            style={{ backgroundColor: `#${categoryLabel?.color}` }}
          >
            {categoryLabel?.name?.split(":")[1] || categoryLabel?.name}
          </Badge>
          <Badge
            key={durationLabel?.id}
            className="text-xs"
            style={{ backgroundColor: `#${durationLabel?.color}` }}
          >
            {durationLabel?.name?.split(":")[1] || durationLabel?.name}
          </Badge>
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
            {issue.assignees?.nodes?.length ? (
              <div className="flex -space-x-2">
                {issue.assignees?.nodes?.map((assignee) => (
                  <Link
                    key={assignee?.id}
                    href={assignee?.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={assignee?.login}
                    className="flex items-center gap-1"
                  >
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage
                        src={assignee?.avatarUrl || ""}
                        alt={assignee?.login}
                      />
                      <AvatarFallback className="text-xs">
                        {assignee?.login.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">отсутствуют</span>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </div>
  );
}
