import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function dir(relativePath) {
    fs.mkdirSync(path.join(root, relativePath), { recursive: true });
}

function file(relativePath, content = "") {
    const fullPath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content, "utf8");
    }
}

function page(relativePath, title) {
    file(
        relativePath,
        `export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm text-muted-foreground">Ruang Usaha Kita</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">${title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Halaman ini masih berupa scaffold awal untuk marketplace jasa digital UMKM dan content creator.
        </p>
      </section>
    </main>
  );
}
`,
    );
}

function apiRoute(relativePath, routeName) {
    file(
        relativePath,
        `export async function GET() {
  return Response.json({
    ok: true,
    route: "${routeName}",
  });
}
`,
    );
}

const dirs = [
    "docs/architecture",
    "docs/product",
    "docs/uiux",

    "supabase/migrations",
    "supabase/policies",
    "supabase/seed",

    "tests/unit",
    "tests/integration",
    "tests/e2e",

    "src/app/(public)",
    "src/app/(public)/katalog",
    "src/app/(public)/kreator/[creatorId]",
    "src/app/(public)/layanan/[serviceId]",
    "src/app/(public)/cara-kerja",
    "src/app/(public)/bantuan",

    "src/app/(auth)/login",
    "src/app/(auth)/register",
    "src/app/(auth)/forgot-password",
    "src/app/(auth)/callback",

    "src/app/(umkm)/umkm/dashboard",
    "src/app/(umkm)/umkm/cart",
    "src/app/(umkm)/umkm/checkout",
    "src/app/(umkm)/umkm/orders/[orderId]",
    "src/app/(umkm)/umkm/payments/[paymentId]",
    "src/app/(umkm)/umkm/briefs",
    "src/app/(umkm)/umkm/results",
    "src/app/(umkm)/umkm/settings",

    "src/app/(creator)/creator/dashboard",
    "src/app/(creator)/creator/profile",
    "src/app/(creator)/creator/services/new",
    "src/app/(creator)/creator/orders/[orderId]",
    "src/app/(creator)/creator/portfolio",
    "src/app/(creator)/creator/earnings",
    "src/app/(creator)/creator/settings",

    "src/app/(admin)/admin/dashboard",
    "src/app/(admin)/admin/users",
    "src/app/(admin)/admin/umkm",
    "src/app/(admin)/admin/creators",
    "src/app/(admin)/admin/services",
    "src/app/(admin)/admin/orders/[orderId]",
    "src/app/(admin)/admin/payments",
    "src/app/(admin)/admin/complaints",
    "src/app/(admin)/admin/reports",
    "src/app/(admin)/admin/settings",

    "src/app/api/health",
    "src/app/api/checkout",
    "src/app/api/payments/create",
    "src/app/api/payments/webhook",
    "src/app/api/orders/[orderId]/status",
    "src/app/api/orders/[orderId]/revision",
    "src/app/api/upload",

    "src/components/layout",
    "src/components/common",
    "src/components/cards",
    "src/components/forms",
    "src/components/tables",
    "src/components/dashboard",

    "src/features/auth",
    "src/features/catalog",
    "src/features/creators",
    "src/features/services",
    "src/features/cart",
    "src/features/checkout",
    "src/features/orders",
    "src/features/payments",
    "src/features/briefs",
    "src/features/submissions",
    "src/features/revisions",
    "src/features/reviews",
    "src/features/notifications",
    "src/features/reports",
    "src/features/admin",

    "src/hooks",
    "src/stores",
    "src/types",

    "src/lib/supabase",
    "src/lib/auth",
    "src/lib/payment",
    "src/lib/constants",
    "src/lib/formatters",
    "src/lib/helpers",
    "src/lib/security",
    "src/lib/storage",
    "src/lib/analytics",
    "src/lib/email",
];

for (const item of dirs) {
    dir(item);
}

page("src/app/(public)/page.tsx", "Beranda");
page("src/app/(public)/katalog/page.tsx", "Katalog Kreator");
page("src/app/(public)/kreator/[creatorId]/page.tsx", "Detail Kreator");
page("src/app/(public)/layanan/[serviceId]/page.tsx", "Detail Paket Jasa");
page("src/app/(public)/cara-kerja/page.tsx", "Cara Kerja");
page("src/app/(public)/bantuan/page.tsx", "Bantuan");

page("src/app/(auth)/login/page.tsx", "Login");
page("src/app/(auth)/register/page.tsx", "Daftar Akun");
page("src/app/(auth)/forgot-password/page.tsx", "Lupa Password");

page("src/app/(umkm)/umkm/dashboard/page.tsx", "Dashboard UMKM");
page("src/app/(umkm)/umkm/cart/page.tsx", "Keranjang Layanan");
page("src/app/(umkm)/umkm/checkout/page.tsx", "Checkout Brief Campaign");
page("src/app/(umkm)/umkm/orders/page.tsx", "Pesanan Saya");
page("src/app/(umkm)/umkm/orders/[orderId]/page.tsx", "Detail Pesanan");
page("src/app/(umkm)/umkm/payments/[paymentId]/page.tsx", "Detail Pembayaran");
page("src/app/(umkm)/umkm/briefs/page.tsx", "Brief Campaign");
page("src/app/(umkm)/umkm/results/page.tsx", "File Hasil Konten");
page("src/app/(umkm)/umkm/settings/page.tsx", "Pengaturan UMKM");

page("src/app/(creator)/creator/dashboard/page.tsx", "Dashboard Kreator");
page("src/app/(creator)/creator/profile/page.tsx", "Profil Kreator");
page("src/app/(creator)/creator/services/page.tsx", "Paket Layanan");
page("src/app/(creator)/creator/services/new/page.tsx", "Tambah Paket Layanan");
page("src/app/(creator)/creator/orders/page.tsx", "Order Masuk");
page("src/app/(creator)/creator/orders/[orderId]/page.tsx", "Detail Order");
page("src/app/(creator)/creator/portfolio/page.tsx", "Portofolio");
page("src/app/(creator)/creator/earnings/page.tsx", "Pendapatan");
page("src/app/(creator)/creator/settings/page.tsx", "Pengaturan Kreator");

page("src/app/(admin)/admin/dashboard/page.tsx", "Dashboard Admin");
page("src/app/(admin)/admin/users/page.tsx", "Manajemen User");
page("src/app/(admin)/admin/umkm/page.tsx", "Manajemen UMKM");
page("src/app/(admin)/admin/creators/page.tsx", "Manajemen Kreator");
page("src/app/(admin)/admin/services/page.tsx", "Manajemen Layanan");
page("src/app/(admin)/admin/orders/page.tsx", "Manajemen Pesanan");
page("src/app/(admin)/admin/orders/[orderId]/page.tsx", "Detail Pesanan Admin");
page("src/app/(admin)/admin/payments/page.tsx", "Manajemen Pembayaran");
page("src/app/(admin)/admin/complaints/page.tsx", "Komplain dan Mediasi");
page("src/app/(admin)/admin/reports/page.tsx", "Laporan Penjualan");
page("src/app/(admin)/admin/settings/page.tsx", "Pengaturan Platform");

apiRoute("src/app/api/health/route.ts", "health");
apiRoute("src/app/api/checkout/route.ts", "checkout");
apiRoute("src/app/api/payments/create/route.ts", "payments/create");
apiRoute("src/app/api/payments/webhook/route.ts", "payments/webhook");
apiRoute(
    "src/app/api/orders/[orderId]/status/route.ts",
    "orders/[orderId]/status",
);
apiRoute(
    "src/app/api/orders/[orderId]/revision/route.ts",
    "orders/[orderId]/revision",
);
apiRoute("src/app/api/upload/route.ts", "upload");

file(
    "src/app/(auth)/callback/route.ts",
    `export async function GET(request: Request) {
  const url = new URL(request.url);
  return Response.redirect(new URL("/umkm/dashboard", url.origin));
}
`,
);

file(
    "src/lib/constants/routes.ts",
    `export const routes = {
  home: "/",
  catalog: "/katalog",
  login: "/login",
  register: "/register",
  umkmDashboard: "/umkm/dashboard",
  creatorDashboard: "/creator/dashboard",
  adminDashboard: "/admin/dashboard",
} as const;
`,
);

file(
    "src/lib/constants/roles.ts",
    `export const USER_ROLES = {
  ADMIN: "admin",
  UMKM: "umkm",
  CREATOR: "creator",
} as const;
`,
);

file(
    "src/lib/constants/order-status.ts",
    `export const ORDER_STATUS = {
  DRAFT: "draft",
  AWAITING_PAYMENT: "awaiting_payment",
  PAID: "paid",
  WAITING_CREATOR_CONFIRMATION: "waiting_creator_confirmation",
  BRIEF_ACCEPTED: "brief_accepted",
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
  REVISION_REQUESTED: "revision_requested",
  REVISED: "revised",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;
`,
);

file(
    "src/lib/constants/payment-status.ts",
    `export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  EXPIRED: "expired",
  REFUNDED: "refunded",
} as const;
`,
);

file(
    "src/lib/formatters/currency.ts",
    `export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
`,
);

file(
    "src/lib/formatters/date.ts",
    `export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(date));
}
`,
);

file(
    "src/lib/payment/fees.ts",
    `export function calculatePlatformFee(amount: number) {
  return Math.round(amount * 0.1);
}

export function calculateAdminFee() {
  return 5000;
}

export function calculateTotalPayment(amount: number) {
  return amount + calculatePlatformFee(amount) + calculateAdminFee();
}
`,
);

file(
    "src/types/app.ts",
    `export type UserRole = "admin" | "umkm" | "creator";

export type OrderStatus =
  | "draft"
  | "awaiting_payment"
  | "paid"
  | "waiting_creator_confirmation"
  | "brief_accepted"
  | "in_progress"
  | "submitted"
  | "revision_requested"
  | "revised"
  | "completed"
  | "cancelled"
  | "refunded";
`,
);

file(
    "src/types/service.ts",
    `export type ServicePackage = {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  price: number;
  estimatedDays: number;
};
`,
);

file(
    "src/types/order.ts",
    `import type { OrderStatus } from "./app";

export type Order = {
  id: string;
  umkmId: string;
  creatorId: string;
  status: OrderStatus;
  totalAmount: number;
};
`,
);

file(
    "src/stores/cart-store.ts",
    `import { create } from "zustand";

type CartState = {
  itemCount: number;
  setItemCount: (value: number) => void;
};

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  setItemCount: (value) => set({ itemCount: value }),
}));
`,
);

file("docs/architecture/overview.md", "# Architecture Overview\n");
file("docs/architecture/route-map.md", "# Route Map\n");
file("docs/product/mvp-scope.md", "# MVP Scope\n");
file("docs/uiux/design-system.md", "# Design System\n");

console.log("Scaffold Ruang Usaha Kita berhasil dibuat.");
