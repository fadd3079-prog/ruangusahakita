"use client";

import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, "type"> & {
  confirmMessage?: string;
  icon?: ReactNode;
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  confirmMessage,
  disabled,
  icon,
  onClick,
  pendingLabel = "Memproses...",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  }

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      onClick={handleClick}
      {...props}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
      {pending ? pendingLabel : children}
    </Button>
  );
}
