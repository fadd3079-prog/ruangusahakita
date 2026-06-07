import Link from "next/link";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppLogo } from "@/components/common/app-logo";
import { PageContainer } from "@/components/layout/page-container";
import { authNavigation, publicNavigation } from "@/lib/constants/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <PageContainer className="flex h-16 items-center justify-between py-0">
        <AppLogo priority />

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-1 md:flex"
        >
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Daftar</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Buka navigasi"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(22rem,calc(100vw-2rem))] p-0"
            >
              <SheetHeader className="border-b p-5">
                <AppLogo href={null} />
                <SheetTitle className="sr-only">Navigasi utama</SheetTitle>
                <SheetDescription className="sr-only">
                  Menu utama Ruang Usaha Kita
                </SheetDescription>
              </SheetHeader>

              <nav
                aria-label="Navigasi mobile"
                className="flex flex-col gap-1 px-3 py-2"
              >
                {[...publicNavigation, ...authNavigation].map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <SheetFooter className="border-t p-5">
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/register">Daftar</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login">Masuk</Link>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  );
}
