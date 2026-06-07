import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const maxWidthClasses = {
  content: "max-w-[1520px]", // 1320px content + 200px padding
  narrow: "max-w-[968px]", // 768px content + 200px padding
  wide: "max-w-[1640px]", // 1440px content + 200px padding
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
        "mx-auto w-full px-5 sm:px-8 lg:px-[100px]",
        maxWidthClasses[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}
