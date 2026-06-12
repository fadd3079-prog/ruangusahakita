import Link from "next/link";

import { LayoutDashboard, LogOut, Menu, ShoppingCart, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { SubmitButton } from "@/components/common/submit-button";
import { PageContainer } from "@/components/layout/page-container";
import {
  getCurrentAccountSummary,
  type CurrentAccountSummary,
} from "@/lib/auth/account";
import { logoutAction } from "@/lib/auth/actions";
import { authNavigation, publicNavigation } from "@/lib/constants/navigation";

const roleLabels = {
  umkm: "UMKM",
  creator: "Kreator",
  admin: "Admin",
} as const;

type SiteHeaderProps = {
  account?: CurrentAccountSummary | null;
};

export async function SiteHeader({ account: accountProp }: SiteHeaderProps = {}) {
  const account =
    accountProp === undefined ? await getCurrentAccountSummary() : accountProp;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
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
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/75 hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!account || account.role === "umkm" ? (
            <Button asChild variant="outline" size="icon" className="rounded-full" title="Keranjang">
              <Link href="/umkm/cart" aria-label="Buka keranjang">
                <ShoppingCart aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 gap-3 rounded-full px-2 pr-4"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {account.initials}
                  </span>
                  <span className="max-w-36 truncate text-sm font-semibold">
                    {account.displayName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>
                  <span className="block truncate text-sm font-semibold">
                    {account.displayName}
                  </span>
                  <span className="mt-1 block truncate text-xs font-normal text-muted-foreground">
                    {account.email}
                  </span>
                </DropdownMenuLabel>
                <div className="px-2 pb-2">
                  <Badge variant="secondary">{roleLabels[account.role]}</Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={account.dashboardHref}>
                    <LayoutDashboard className="size-4" aria-hidden="true" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={logoutAction}>
                  <DropdownMenuItem asChild>
                    <SubmitButton
                      pendingLabel="Keluar..."
                      variant="ghost"
                      size="sm"
                      className="h-auto w-full justify-start rounded-md px-1.5 py-1 text-sm font-normal"
                      icon={<LogOut className="size-4" aria-hidden="true" />}
                    >
                      Keluar / ganti akun
                    </SubmitButton>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          )}
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
                {[
                  ...publicNavigation,
                  ...(!account || account.role === "umkm"
                    ? [
                        {
                          title: "Keranjang",
                          href: "/umkm/cart",
                          icon: "cart" as const,
                        },
                      ]
                    : []),
                  ...(account
                    ? [
                        {
                          title: "Dashboard",
                          href: account.dashboardHref,
                          icon: "dashboard" as const,
                        },
                      ]
                    : authNavigation),
                ].map((item) => (
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
                {account ? (
                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-3 rounded-xl border bg-card p-3 text-left">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {account.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {account.displayName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {account.email}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {roleLabels[account.role]}
                      </Badge>
                    </div>
                    <form action={logoutAction}>
                      <SubmitButton
                        pendingLabel="Keluar..."
                        variant="outline"
                        className="w-full"
                        icon={<UserRound className="size-4" aria-hidden="true" />}
                      >
                        Keluar / ganti akun
                      </SubmitButton>
                    </form>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  );
}
