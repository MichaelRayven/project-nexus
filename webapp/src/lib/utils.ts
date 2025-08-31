import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFullName({name, surname, paternal}: { name: string; surname: string; paternal: string }) {
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
