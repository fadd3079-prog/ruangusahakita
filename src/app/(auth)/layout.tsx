import type { ReactNode } from "react";

import { AppLogo } from "@/components/common/app-logo";
import { PageContainer } from "@/components/layout/page-container";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      <PageContainer
        maxWidth="narrow"
        className="flex min-h-screen items-center justify-center py-10"
      >
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <AppLogo />
          </div>
          <div className="surface-card rounded-2xl p-6 sm:p-8 [&>main>section]:mx-0 [&>main>section]:max-w-none [&>main]:min-h-0 [&>main]:px-0 [&>main]:py-0">
            {children}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
