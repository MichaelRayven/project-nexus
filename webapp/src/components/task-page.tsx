"use client";

import { useIssue } from "@/hooks/use-issue";
import { useIssueActions } from "@/hooks/use-issue-actions";
import { cn, TIMEZONE } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BranchCreationDialog } from "./branch-creation-dialog";

import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  SendIcon,
  UserIcon,
  UserMinusIcon,
  UsersIcon,
} from "lucide-react";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface TaskPageProps {
  issueId: number;
}

export function TaskPage({ issueId }: TaskPageProps) {
  const router = useRouter();

  const trpc = useTRPC();
  const { data: issue, isLoading } = useQuery(
    trpc.getById.queryOptions({ issueId })
  );

  const {
    linkedBranches,
    pullRequests,
    assignees,
    isAssignee,
    status,
    labels,
    teacherLabel,
    subjectLabel,
    deadlineLabel,
    durationLabel,
    categoryLabel,
  } = useIssue({ issue });

  const {
    handleAssignSelf,
    handleUnassignSelf,
    handleSendForReview,
    handleEditIssue,
    isAssigning,
    isUnassigning,
  } = useIssueActions({
    issueId: issue?.id || "",
    issueNumber: issue?.number || 0,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Задача не найдена
          </h1>
          <p className="text-gray-600 mb-6">
            Задача с номером #{issueId} не существует или была удалена.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4 justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Назад
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(issue.url, "_blank")}
            className="flex items-center gap-2"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-col items-start sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{issue.title}</h1>
              <Badge
                variant="default"
                className={cn(
                  "text-sm",
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
                {status?.message || "Неизвестно"}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              Задача #{issue.number}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Task Body */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Описание задачи</h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <Markdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {issue.body || "*Описание отсутствует*"}
                </Markdown>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Действия</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {!isAssignee ? (
                <Button
                  onClick={handleAssignSelf}
                  disabled={isAssigning}
                  className="w-full"
                  size="sm"
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  {isAssigning ? "Назначаем..." : "Выполнить"}
                </Button>
              ) : (
                <Button
                  onClick={handleUnassignSelf}
                  disabled={isUnassigning}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <UserMinusIcon className="h-4 w-4 mr-2" />
                  {isUnassigning ? "Снимаем..." : "Отказаться"}
                </Button>
              )}

              {linkedBranches.length === 0 && pullRequests.length === 0 && (
                <BranchCreationDialog issue={issue} />
              )}

              {status?.status === "IN_PROGRESS" && (
                <Button
                  onClick={() => handleSendForReview(issue.url)}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <SendIcon className="h-4 w-4 mr-2" />
                  На проверку
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Task Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Информация о задаче</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {deadlineLabel && (
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Дедлайн
                    </div>
                    <div>{deadlineLabel.name.split(":")[1]}</div>
                  </div>
                </div>
              )}

              {durationLabel && (
                <div className="flex items-center gap-3 text-sm">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Длительность
                    </div>
                    <div>{durationLabel.name.split(":")[1]}</div>
                  </div>
                </div>
              )}

              {subjectLabel && (
                <div className="flex items-center gap-3 text-sm">
                  <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Предмет
                    </div>
                    <div>{subjectLabel.name.split(":")[1]}</div>
                  </div>
                </div>
              )}

              {teacherLabel && (
                <div className="flex items-center gap-3 text-sm">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Преподаватель
                    </div>
                    <div>{teacherLabel.name.split(":")[1]}</div>
                  </div>
                </div>
              )}

              {categoryLabel && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Категория
                    </div>
                    <div>{categoryLabel.name.split(":")[1]}</div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center gap-3 text-sm">
                <div>
                  <div className="font-medium text-muted-foreground">
                    Создано
                  </div>
                  <div>
                    {formatInTimeZone(
                      new Date(issue.createdAt),
                      TIMEZONE,
                      "P",
                      { locale: ru }
                    )}
                  </div>
                </div>
              </div>

              {issue.updatedAt !== issue.createdAt && (
                <div className="flex items-center gap-3 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Обновлено
                    </div>
                    <div>
                      {formatInTimeZone(
                        new Date(issue.updatedAt),
                        TIMEZONE,
                        "P",
                        { locale: ru }
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignees */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Исполнители</h3>
            </CardHeader>
            <CardContent>
              {assignees.length > 0 ? (
                <div className="space-y-3">
                  {assignees.map((assignee) => (
                    <div key={assignee?.id} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={assignee?.avatarUrl || ""}
                          alt={assignee?.login}
                        />
                        <AvatarFallback>
                          {assignee?.login.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{assignee?.login}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Исполнители не назначены
                </p>
              )}
            </CardContent>
          </Card>

          {/* Linked Branches */}
          {linkedBranches.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Связанные ветки</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {linkedBranches.map((linkedBranch) => (
                    <div
                      key={linkedBranch?.id}
                      className="flex items-center gap-2"
                    >
                      <GitBranchIcon className="shrink-0 h-4 w-4 text-muted-foreground" />
                      <a
                        href={`https://github.com/${linkedBranch?.ref?.repository?.nameWithOwner}/tree/${linkedBranch?.ref?.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {linkedBranch?.ref?.name}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pull Requests */}
          {pullRequests.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Pull Requests</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pullRequests.map((pr) => (
                    <div key={pr?.id} className="flex items-center gap-2">
                      <GitPullRequestIcon className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={pr?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary transition-colors"
                      >
                        #{pr?.number}: {pr?.title}
                      </a>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          pr?.state === "MERGED"
                            ? "bg-green-100 text-green-800"
                            : pr?.state === "CLOSED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {pr?.state === "MERGED"
                          ? "Объединен"
                          : pr?.state === "CLOSED"
                          ? "Закрыт"
                          : "Открыт"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Labels */}
          {labels.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Метки</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {labels.map((label) => (
                    <Badge
                      key={label?.id}
                      className="text-xs"
                      style={{ backgroundColor: `#${label?.color}` }}
                    >
                      {label?.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
