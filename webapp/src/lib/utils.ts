import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFullName({name, surname, paternal}: { name: string; surname: string; paternal: string }) {
  return `${surname} ${name[0]}. ${paternal[0]}.`;
}
