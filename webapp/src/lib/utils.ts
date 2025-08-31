import { clsx, type ClassValue } from "clsx";
import { parse } from "date-fns";
import { twMerge } from "tailwind-merge";

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

export function getIssueStatus(issue: GitHubIssue): { status: string; color: string } {
  if (issue.state === "closed") {
    return { status: "Выполнена", color: "green" };
  }
  const deadlineLabel = issue.labels.find((label) =>
    label.name.toLowerCase().startsWith("дедлайн:")
  );
  if (deadlineLabel) {
    const deadlineStr = deadlineLabel.name.split(":")[1].trim();
    const deadlineDate = parse(deadlineStr, "MM-dd-yyyy", new Date());
    if (new Date() > deadlineDate) {
      return { status: "Просрочена", color: "red" };
    }
  }

  if (issue.assignees.length > 0) {
    return { status: "В работе", color: "yellow" };
  }

  return { status: "Ожидает выполнения", color: "gray" };
}
