import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const maxWidthClasses = {
  default: "max-w-[1440px]",
  narrow: "max-w-3xl",
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
  maxWidth = "default",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-[100px]",
        maxWidthClasses[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}
