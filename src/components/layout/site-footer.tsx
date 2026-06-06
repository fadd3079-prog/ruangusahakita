import Link from "next/link";

import { AppLogo } from "@/components/common/app-logo";
import { PageContainer } from "@/components/layout/page-container";
import { publicNavigation } from "@/lib/constants/navigation";

const footerLinks = [
  {
    title: "Platform",
    links: publicNavigation,
  },
  {
    title: "Akun",
    links: [
      {
        title: "Masuk",
        href: "/login",
      },
      {
        title: "Daftar",
        href: "/register",
      },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <PageContainer className="py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <AppLogo />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Marketplace jasa digital yang membantu UMKM terhubung dengan
              kreator untuk kebutuhan promosi digital.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-foreground">
                {group.title}
              </h2>
              <nav aria-label={group.title} className="mt-3 grid gap-2">
                {group.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          (c) 2026 Ruang Usaha Kita. Fondasi marketplace layanan digital.
        </div>
      </PageContainer>
    </footer>
  );
}
