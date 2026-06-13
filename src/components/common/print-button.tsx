"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

type PrintButtonProps = {
  label?: string;
};

export function PrintButton({ label = "Cetak" }: PrintButtonProps) {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      className="print:hidden"
    >
      <Printer className="size-4" aria-hidden="true" />
      {label}
    </Button>
  );
}
