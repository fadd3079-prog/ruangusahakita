import type { ReactNode } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { skipOnboardingAction } from "@/features/onboarding/actions/profile-onboarding-actions";

type OnboardingShellProps = {
  children: ReactNode;
  description: string;
  highlights: readonly string[];
  title: string;
};

export function OnboardingShell({
  children,
  description,
  highlights,
  title,
}: OnboardingShellProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <section className="overflow-hidden rounded-3xl border border-primary/15 bg-[linear-gradient(135deg,rgba(12,41,73,0.98),rgba(17,73,85,0.94))] p-6 text-primary-foreground shadow-[0_24px_70px_rgba(12,41,73,0.18)] sm:p-8">
        <Button
          asChild
          variant="outline"
          className="border-white/20 bg-white/8 text-primary-foreground hover:bg-white/12 hover:text-primary-foreground"
        >
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            Kembali ke beranda
          </Link>
        </Button>
        <div className="mt-12">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
            Onboarding Akun
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-primary-foreground/78 sm:text-base">
            {description}
          </p>
        </div>
        <div className="mt-8 grid gap-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/8 p-4"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary-foreground" aria-hidden="true" />
              <p className="text-sm leading-6 text-primary-foreground/82">{item}</p>
            </div>
          ))}
        </div>
        <form action={skipOnboardingAction} className="mt-8">
          <Button
            type="submit"
            variant="ghost"
            className="text-primary-foreground/78 hover:bg-white/10 hover:text-primary-foreground"
          >
            Lewati dulu dan buka dashboard
          </Button>
        </form>
      </section>
      <section className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-[var(--shadow-soft)] sm:p-7">
        {children}
      </section>
    </div>
  );
}
