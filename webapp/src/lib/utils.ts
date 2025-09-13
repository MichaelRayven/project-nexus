import { clsx, type ClassValue } from "clsx";
import { parse } from "date-fns";
import { twMerge } from "tailwind-merge";
import { IssueNode } from "./interface";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullName({
  name,
  surname,
  paternal,
}: {
  name: string;
  surname: string;
  paternal: string;
}) {
  return `${surname} ${name[0]}. ${paternal[0]}.`;
}

export function formatCategory(category: string) {
  switch (category) {
    case "homework":
      return "Домашняя работа";
    case "labwork":
      return "Лабораторная работа";
    case "coursework":
      return "Курсовая";
    case "other":
      return "Другое";
    default:
      return category;
  }
}

export function formatDuration(duration: string) {
  switch (duration) {
    case "short":
      return "Короткая";
    case "medium":
      return "Средняя";
    case "long":
      return "Длинная";
    default:
      return duration;
  }
}

export function getIssueStatus(issue: IssueNode): {
  message: string;
  status: "COMPLETED" | "IN_REVIEW" | "EXPIRED" | "IN_PROGRESS" | "PENDING";
} {
  if (issue?.state === "CLOSED") {
    return { message: "Выполнена", status: "COMPLETED" };
  }

  if (issue?.closedByPullRequestsReferences?.nodes?.length) {
    return { message: "На проверке", status: "IN_REVIEW" };
  }

  const deadlineLabel = issue?.labels?.nodes?.find((label) =>
    label?.name?.toLowerCase().startsWith("дедлайн:")
  );
  if (deadlineLabel) {
    const deadlineStr = deadlineLabel?.name?.split(":")[1].trim();
    const deadlineDate = parse(deadlineStr, "MM-dd-yyyy", new Date());
    if (new Date() > deadlineDate) {
      return { message: "Просрочена", status: "EXPIRED" };
    }
  }

  if (issue?.assignees?.nodes?.length) {
    return { message: "В работе", status: "IN_PROGRESS" };
  }

  return { message: "В очереди", status: "PENDING" };
}
