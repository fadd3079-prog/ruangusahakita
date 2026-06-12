import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const maxWidthClasses = {
  content: "max-w-[1440px]",
  narrow: "max-w-[960px]",
  wide: "max-w-[1600px]",
  full: "max-w-none",
} as const;

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: keyof typeof maxWidthClasses;
};

export function PageContainer({
  children,
  className,
  maxWidth = "full",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--page-gutter-mobile)] sm:px-[var(--page-gutter-tablet)] lg:px-[var(--page-gutter-desktop)]",
        maxWidthClasses[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}
