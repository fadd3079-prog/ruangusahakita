import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  CreditCard,
  FolderCheck,
  LayoutDashboard,
  ListChecks,
  Search,
  ShoppingBag,
} from "lucide-react";

import { CreatorCard } from "@/components/cards/creator-card";
import { ServiceCard } from "@/components/cards/service-card";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DashboardHero,
  DashboardList,
  DashboardMetricGrid,
  DashboardPanel,
  DashboardQuickActions,
  type DashboardListItem,
  type DashboardMetric,
} from "@/features/dashboard/components/dashboard-overview";
import {
  getUmkmDashboardOverview,
  type DashboardPaymentStatus,
} from "@/features/dashboard/data/dashboard-queries";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import {
  dummyCreators,
  dummyServiceCategories,
  dummyServicePackages,
} from "@/lib/dummy";
import type { DummyPaymentStatus } from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Dashboard UMKM — Ruang Usaha Kita",
  description:
    "Ringkasan pesanan, brief campaign, pembayaran, hasil konten, dan rekomendasi kreator untuk UMKM.",
};

function formatOptionalDate(value: string | null) {
  return value ? formatDate(value) : "Belum diatur";
}

function getPaymentBadgeStatus(status: DashboardPaymentStatus): DummyPaymentStatus {
  return status === "partially_refunded" ? "refunded" : status;
}

export default async function UmkmDashboardPage() {
  const dashboard = await getUmkmDashboardOverview();
  const currentUmkm = dashboard.profile;
  const businessName = currentUmkm?.business_name ?? "Profil UMKM belum lengkap";
  const businessCategory = currentUmkm?.business_category ?? "Belum diisi";
  const city = currentUmkm?.city ?? "Belum diisi";
  const activeBrief = dashboard.recentBriefs[0] ?? null;

  const categoryById = new Map(
    dummyServiceCategories.map((category) => [category.id, category]),
  );
  const recommendedCreators = dummyCreators
    .filter((creator) => creator.isFeatured)
    .slice(0, 2)
    .map((creator) => {
      const service =
        dummyServicePackages.find((item) => item.creatorId === creator.id) ?? null;
      const category = service ? categoryById.get(service.categoryId) : null;

      return {
        creator,
        primaryService:
          service && category
            ? {
                id: service.id,
                title: service.title,
                categoryName: category.name,
                estimatedDays: service.estimatedDays,
              }
            : null,
      };
    });
  const recommendedServices = dummyServicePackages
    .filter((service) => service.isFeatured)
    .slice(0, 2);

  const metrics: readonly DashboardMetric[] = [
    {
      label: "Pesanan aktif",
      value: String(dashboard.metrics.activeOrders),
      description: "Paket jasa digital yang sedang berjalan atau menunggu proses.",
      icon: ListChecks,
    },
    {
      label: "Pesanan selesai",
      value: String(dashboard.metrics.completedOrders),
      description: "Campaign yang sudah selesai dan dapat menjadi referensi.",
      icon: FolderCheck,
    },
    {
      label: "Pembayaran pending",
      value: String(dashboard.metrics.pendingPayments),
      description: "Pembayaran yang masih perlu dipantau secara terpisah.",
      icon: CreditCard,
    },
    {
      label: "Total nilai pesanan",
      value: formatCurrency(dashboard.metrics.totalSpend),
      description: "Akumulasi nilai pesanan yang terbaca dari database.",
      icon: LayoutDashboard,
    },
  ];

  const orderItems: readonly DashboardListItem[] = dashboard.recentOrders.map(
    (order) => ({
      title: order.orderNumber,
      description: `${order.serviceTitle} oleh ${order.counterpartName}`,
      meta: `Deadline ${formatOptionalDate(order.deadline)} · ${formatCurrency(
        order.totalAmount,
      )}`,
      href: `/umkm/orders/${order.id}`,
      badge: <OrderStatusBadge status={order.orderStatus} />,
    }),
  );

  const paymentItems: readonly DashboardListItem[] =
    dashboard.pendingPaymentOrders.map((order) => ({
      title: order.orderNumber,
      description: `Pembayaran untuk ${order.serviceTitle}`,
      meta: formatCurrency(order.totalAmount),
      href: `/umkm/orders/${order.id}`,
      badge: (
        <PaymentStatusBadge status={getPaymentBadgeStatus(order.paymentStatus)} />
      ),
    }));

  const resultItems: readonly DashboardListItem[] = dashboard.latestResults.map(
    (order) => ({
      title: `Hasil konten · ${order.orderNumber}`,
      description: `${order.serviceTitle} dari ${order.counterpartName}`,
      meta:
        order.orderStatus === "completed"
          ? "Selesai dan siap diarsipkan"
          : "Perlu ditinjau oleh UMKM",
      href: `/umkm/orders/${order.id}`,
      badge: <OrderStatusBadge status={order.orderStatus} />,
    }),
  );

  const activityItems: readonly DashboardListItem[] =
    dashboard.notifications.map((notification) => ({
      title: notification.title,
      description: notification.message ?? "Aktivitas terbaru untuk akun UMKM.",
      meta: formatDate(notification.createdAt),
      href: notification.actionUrl ?? "/umkm/dashboard",
      badge: notification.isRead ? (
        <Badge variant="outline" className="rounded-lg">
          Terbaca
        </Badge>
      ) : (
        <Badge variant="secondary" className="rounded-lg">
          Baru
        </Badge>
      ),
    }));

  return (
    <PageContainer>
      <div className="space-y-6">
        <DashboardHero
          eyebrow="Dashboard UMKM"
          title={`Selamat datang, ${businessName}`}
          description="Pantau status pesanan, brief campaign, pembayaran, hasil konten, dan rekomendasi kreator dari satu ruang kerja yang rapi."
          actions={[
            { href: "/katalog", label: "Cari Kreator" },
            { href: "/umkm/cart", label: "Lihat Keranjang", variant: "outline" },
            { href: "/umkm/orders", label: "Pesanan Saya", variant: "secondary" },
          ]}
          highlights={[
            { label: "Kategori usaha", value: businessCategory },
            { label: "Kota", value: city },
            {
              label: "Status profil",
              value: currentUmkm ? "Terhubung" : "Belum lengkap",
            },
          ]}
        />

        <DashboardMetricGrid metrics={metrics} />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <DashboardPanel
            title="Pesanan terbaru"
            description="Pantau status pesanan dan pembayaran secara terpisah."
            action={{ href: "/umkm/orders", label: "Lihat semua" }}
          >
            <DashboardList
              items={orderItems}
              emptyText="Belum ada pesanan yang terbaca untuk akun UMKM ini."
            />
          </DashboardPanel>

          <DashboardPanel
            title="Brief campaign terbaru"
            description="Brief yang jelas membantu kreator memahami arah konten sejak awal."
            action={{ href: "/umkm/briefs", label: "Kelola brief" }}
          >
            {activeBrief ? (
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {activeBrief.promotedFocus}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {activeBrief.campaignGoal}
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-lg">
                    {activeBrief.status}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-muted-foreground">Platform konten</p>
                    <p className="mt-1 font-medium text-foreground">
                      {activeBrief.contentPlatforms.length > 0
                        ? activeBrief.contentPlatforms.join(", ")
                        : "Belum diisi"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-muted-foreground">Deadline</p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatOptionalDate(activeBrief.deadline)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
                Belum ada brief campaign yang terbaca untuk akun UMKM ini.
              </div>
            )}
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <DashboardPanel
            title="Hasil konten terbaru"
            description="Area ringkas untuk meninjau hasil konten yang sudah dikirim kreator."
            action={{ href: "/umkm/results", label: "Buka file hasil" }}
          >
            <DashboardList
              items={resultItems}
              emptyText="Belum ada hasil konten yang perlu ditinjau."
            />
          </DashboardPanel>

          <DashboardPanel
            title="Pembayaran pending"
            description="Status pembayaran tetap terpisah dari status pesanan."
            action={{ href: "/umkm/orders", label: "Cek pesanan" }}
          >
            <DashboardList
              items={paymentItems}
              emptyText="Tidak ada pembayaran pending yang terbaca saat ini."
            />
          </DashboardPanel>
        </section>

        <DashboardPanel
          title="Rekomendasi kreator dan layanan digital"
          description="Pilihan awal dari katalog untuk membantu UMKM memulai pencarian."
          action={{ href: "/katalog", label: "Jelajahi katalog" }}
        >
          <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <div className="grid gap-5 sm:grid-cols-2">
              {recommendedCreators.map((item) => (
                <CreatorCard
                  key={item.creator.id}
                  creator={item.creator}
                  primaryService={item.primaryService}
                />
              ))}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {recommendedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  category={categoryById.get(service.categoryId)}
                  ctaLabel="Lihat paket"
                />
              ))}
            </div>
          </div>
        </DashboardPanel>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <DashboardPanel title="Aktivitas terbaru">
            <DashboardList
              items={activityItems}
              emptyText="Belum ada aktivitas terbaru untuk akun UMKM ini."
            />
          </DashboardPanel>

          <DashboardPanel title="Aksi cepat" description="Jalur utama untuk tahap MVP.">
            <DashboardQuickActions
              actions={[
                {
                  href: "/katalog",
                  label: "Cari kreator",
                  description: "Temukan kreator sesuai kebutuhan campaign.",
                  icon: Search,
                },
                {
                  href: "/umkm/cart",
                  label: "Lihat keranjang",
                  description: "Cek paket jasa digital yang sudah dipilih.",
                  icon: ShoppingBag,
                },
                {
                  href: "/umkm/orders",
                  label: "Pantau pesanan",
                  description: "Lihat status pesanan dan hasil konten.",
                  icon: ClipboardList,
                },
              ]}
            />
            <Button asChild variant="outline" className="mt-5 w-full">
              <Link href="/cara-kerja">Lihat cara kerja platform</Link>
            </Button>
          </DashboardPanel>
        </section>
      </div>
    </PageContainer>
  );
}
