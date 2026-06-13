"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type AdminSettingsSaveButtonProps = {
  label: string;
  successMessage: string;
};

export function AdminSettingsSaveButton({
  label,
  successMessage,
}: AdminSettingsSaveButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isLocked, setIsLocked] = useState(false);

  function handleClick() {
    if (isPending || isLocked) {
      return;
    }

    setIsLocked(true);
    startTransition(() => {
      window.setTimeout(() => {
        toast.success(successMessage);
        setIsLocked(false);
      }, 450);
    });
  }

  const pending = isPending || isLocked;

  return (
    <Button type="button" onClick={handleClick} disabled={pending} aria-busy={pending}>
      {pending ? (
        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Save className="mr-2 size-4" aria-hidden="true" />
      )}
      {pending ? "Menyimpan..." : label}
    </Button>
  );
}
