import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TruncateTextProps = HTMLAttributes<HTMLParagraphElement> & {
  lines?: 1 | 2 | 3;
  text: string | number | null | undefined;
};

export function TruncateText({
  className,
  lines = 1,
  text,
  title,
  ...props
}: TruncateTextProps) {
  const value = String(text ?? "-");

  return (
    <p
      title={title ?? value}
      className={cn(
        "min-w-0",
        lines === 1 && "truncate",
        lines === 2 && "line-clamp-2",
        lines === 3 && "line-clamp-3",
        className,
      )}
      {...props}
    >
      {value}
    </p>
  );
}
