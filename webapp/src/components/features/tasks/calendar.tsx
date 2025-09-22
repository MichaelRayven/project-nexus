"use client";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Container } from "@/components/ui/layout/container";
import { cn, getIssueStatus, TIMEZONE } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import { DateRange } from "react-day-picker";

function TaskCalendarDay({ date }: { date: Date }) {
  const trpc = useTRPC();

  const { data, isPending } = useQuery(
    trpc.issueListDay.queryOptions({ deadline: date.getTime() })
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-900 border-green-700 hover:bg-green-200 hover:border-green-900 hover:text-green-900";
      case "EXPIRED":
        return "bg-red-100 text-red-900 border-red-700 hover:bg-red-200 hover:border-red-900 hover:text-red-900";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-900 border-yellow-700 hover:bg-yellow-200 hover:border-yellow-900 hover:text-yellow-900";
      case "IN_REVIEW":
        return "bg-blue-100 text-blue-900 border-blue-700 hover:bg-blue-200 hover:border-blue-900 hover:text-blue-900";
      default:
        return "bg-card text-foreground border-border hover:bg-primary/5 hover:text-primary hover:border-primary";
    }
  };

  if (isPending)
    return (
      <ul className="flex flex-col items-start gap-4 py-4">
        <li
          className={cn(
            "w-[10ch] sm:w-[20ch] p-2 border-l-4 border-primary rounded-[0.25em] overflow-ellipsis whitespace-nowrap overflow-hidden text-left",
            "transition-all duration-300 ease-in-out",
            getStatusColor("")
          )}
        >
          <div>
            <span>Загрузка...</span>
          </div>
        </li>
      </ul>
    );

  return (
    <ul className="flex flex-col items-start gap-2 py-4">
      {data?.map((item) => {
        const { status } = getIssueStatus(item);

        return (
          <li
            key={item!.id}
            className={cn(
              "w-[10ch] sm:w-[20ch] p-2 border-l-4 border-primary rounded-[0.25em] overflow-ellipsis whitespace-nowrap overflow-hidden text-left",
              "transition-all duration-300 ease-in-out",
              getStatusColor(status)
            )}
          >
            <Link
              href={`/task/${item!.number}`}
              className="py-2"
              title={item!.title}
            >
              <span>{item!.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function TaskCalendar({ className }: { className?: string }) {
  return (
    <Calendar
      mode="single"
      numberOfMonths={1}
      className={cn(
        "w-full rounded-xl bg-card border shadow-sm hidden sm:block",
        className
      )}
      timeZone={TIMEZONE}
      locale={ru}
      components={{
        DayButton: ({ children, modifiers, day, className, ...props }) => {
          return (
            <CalendarDayButton
              day={day}
              modifiers={modifiers}
              className={cn("justify-start py-4", className)}
              {...props}
            >
              {children}
              <TaskCalendarDay date={day.date} />
            </CalendarDayButton>
          );
        },
      }}
    />
  );
}
