import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type ProfileCompletionCardProps = {
  description: string;
  href: string;
  title: string;
};

export function ProfileCompletionCard({
  description,
  href,
  title,
}: ProfileCompletionCardProps) {
  return (
    <section className="rounded-3xl border border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.98),rgba(240,253,250,0.9))] p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
            <AlertCircle className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{title}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <Link href={href}>
            Lengkapi profil
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
