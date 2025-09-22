"use client";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { cn, getIssueStatus, TIMEZONE } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { isSameMonth } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";

function TaskCalendarDay({ issues }: { issues?: any[] }) {
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

  if (!issues)
    return (
      <ul className="flex flex-col items-start gap-4 my-4 flex-1 overflow-y-auto min-h-[100px]">
        <li
          className={cn(
            "w-[10ch] lg:w-[15ch] shrink-0 p-2 border-l-4 border-primary rounded-[0.25em] overflow-ellipsis whitespace-nowrap overflow-hidden text-left",
            "transition-all duration-300 ease-in-out",
            "bg-card text-foreground border-border hover:bg-primary/5 hover:text-primary hover:border-primary"
          )}
        >
          <div>
            <span>Загрузка...</span>
          </div>
        </li>
      </ul>
    );

  return (
    <ul className="flex flex-col items-start gap-2 my-4 flex-1 overflow-y-auto min-h-[100px]">
      {issues?.map((item) => {
        const { status } = getIssueStatus(item);

        return (
          <li
            key={item!.id}
            className={cn(
              "w-[10ch] lg:w-[15ch] shrink-0 p-2 border-l-4 border-primary rounded-[0.25em] overflow-ellipsis whitespace-nowrap overflow-hidden text-left",
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
  const trpc = useTRPC();

  const [month, setMonth] = useState<Date>(new Date());

  // Get current month's date range
  const now = month;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data: monthIssues } = useQuery(
    trpc.issueListRange.queryOptions({
      startDate: startOfMonth.getTime(),
      endDate: endOfMonth.getTime(),
    })
  );

  return (
    <Calendar
      mode="single"
      numberOfMonths={1}
      month={month}
      className={cn(
        "w-full rounded-xl bg-card border shadow-sm hidden sm:block",
        className
      )}
      onMonthChange={(date) => {
        setMonth(date);
      }}
      showOutsideDays={false}
      timeZone={TIMEZONE}
      locale={ru}
      components={{
        DayButton: ({ children, modifiers, day, className, ...props }) => {
          const dateKey = formatInTimeZone(day.date, TIMEZONE, "MM-dd-yyyy");
          const dayIssues = monthIssues?.[dateKey];

          return (
            <CalendarDayButton
              day={day}
              modifiers={modifiers}
              className={cn("justify-start py-4", className)}
              {...props}
            >
              {children}
              <TaskCalendarDay issues={dayIssues} />
            </CalendarDayButton>
          );
        },
      }}
    />
  );
}
