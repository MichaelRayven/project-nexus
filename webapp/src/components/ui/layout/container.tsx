import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Container({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-fd-container mx-auto px-4 md:px-8", className)}>
      {children}
    </div>
  );
}
