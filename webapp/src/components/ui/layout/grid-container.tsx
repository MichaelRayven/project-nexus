import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

const gridVariants = cva("grid gap-8", {
  variants: {
    size: {
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
      2: "grid-cols-1 sm:grid-cols-2",
    },
  },
  defaultVariants: {
    size: 4,
  },
});

export function GridContainer({
  children,
  className,
  size,
}: { children?: ReactNode; className?: string } & VariantProps<
  typeof gridVariants
>) {
  return (
    <div className={cn(gridVariants({ size, className }))}>{children}</div>
  );
}
