export type NavigationIcon =
  | "adminReports"
  | "analytics"
  | "brief"
  | "cart"
  | "checkout"
  | "creator"
  | "dashboard"
  | "earnings"
  | "help"
  | "home"
  | "inbox"
  | "login"
  | "orders"
  | "payments"
  | "portfolio"
  | "profile"
  | "register"
  | "results"
  | "route"
  | "search"
  | "services"
  | "settings"
  | "umkm"
  | "users"
  | "warning";

export type NavigationItem = {
  title: string;
  href: string;
  icon: NavigationIcon;
};

export type DashboardNavigationVariant = "umkm" | "creator" | "admin";

export const publicNavigation = [
  {
    title: "Beranda",
    href: "/",
    icon: "home",
  },
  {
    title: "Katalog Kreator",
    href: "/katalog",
    icon: "search",
  },
  {
    title: "Cara Kerja",
    href: "/cara-kerja",
    icon: "route",
  },
  {
    title: "Bantuan",
    href: "/bantuan",
    icon: "help",
  },
] satisfies NavigationItem[];

export const authNavigation = [
  {
    title: "Masuk",
    href: "/login",
    icon: "login",
  },
  {
    title: "Daftar",
    href: "/register",
    icon: "register",
  },
] satisfies NavigationItem[];

export const dashboardNavigation = {
  umkm: [
    {
      title: "Dashboard",
      href: "/umkm/dashboard",
      icon: "dashboard",
    },
    {
      title: "Keranjang",
      href: "/umkm/cart",
      icon: "cart",
    },
    {
      title: "Checkout",
      href: "/umkm/checkout",
      icon: "checkout",
    },
    {
      title: "Pesanan Saya",
      href: "/umkm/orders",
      icon: "orders",
    },
    {
      title: "Brief Campaign",
      href: "/umkm/briefs",
      icon: "brief",
    },
    {
      title: "File Hasil",
      href: "/umkm/results",
      icon: "results",
    },
    {
      title: "Pengaturan",
      href: "/umkm/settings",
      icon: "settings",
    },
  ],
  creator: [
    {
      title: "Dashboard",
      href: "/creator/dashboard",
      icon: "dashboard",
    },
    {
      title: "Profil",
      href: "/creator/profile",
      icon: "profile",
    },
    {
      title: "Paket Layanan",
      href: "/creator/services",
      icon: "services",
    },
    {
      title: "Order Masuk",
      href: "/creator/orders",
      icon: "inbox",
    },
    {
      title: "Portofolio",
      href: "/creator/portfolio",
      icon: "portfolio",
    },
    {
      title: "Pendapatan",
      href: "/creator/earnings",
      icon: "earnings",
    },
    {
      title: "Pengaturan",
      href: "/creator/settings",
      icon: "settings",
    },
  ],
  admin: [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: "dashboard",
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: "analytics",
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: "users",
    },
    {
      title: "UMKM",
      href: "/admin/umkm",
      icon: "umkm",
    },
    {
      title: "Kreator",
      href: "/admin/creators",
      icon: "creator",
    },
    {
      title: "Layanan",
      href: "/admin/services",
      icon: "services",
    },
    {
      title: "Pesanan",
      href: "/admin/orders",
      icon: "orders",
    },
    {
      title: "Pembayaran",
      href: "/admin/payments",
      icon: "payments",
    },
    {
      title: "Komplain",
      href: "/admin/complaints",
      icon: "warning",
    },
    {
      title: "Laporan",
      href: "/admin/reports",
      icon: "adminReports",
    },
    {
      title: "Pengaturan",
      href: "/admin/settings",
      icon: "settings",
    },
  ],
} satisfies Record<DashboardNavigationVariant, NavigationItem[]>;

export const dashboardRoleLabels = {
  umkm: "UMKM",
  creator: "Kreator",
  admin: "Admin",
} satisfies Record<DashboardNavigationVariant, string>;
