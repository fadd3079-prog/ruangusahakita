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
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import {
  dummyCampaignBriefs,
  dummyCarts,
  dummyCreators,
  dummyNotifications,
  dummyOrders,
  dummyPayments,
  dummyServiceCategories,
  dummyServicePackages,
  dummyUmkmDashboardReports,
  dummyUmkmProfiles,
} from "@/lib/dummy";
import type { DummyOrderStatus } from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Dashboard UMKM — Ruang Usaha Kita",
  description:
    "Ringkasan pesanan, brief campaign, pembayaran, hasil konten, dan rekomendasi kreator untuk UMKM.",
};

const activeOrderStatuses: readonly DummyOrderStatus[] = [
  "awaiting_payment",
  "paid",
  "waiting_creator_confirmation",
  "brief_accepted",
  "in_progress",
  "submitted",
  "revision_requested",
  "revised",
] as const;

const resultOrderStatuses: readonly DummyOrderStatus[] = [
  "submitted",
  "revision_requested",
  "completed",
] as const;

export default function UmkmDashboardPage() {
  const currentUmkm = dummyUmkmProfiles[0];
  const dashboardReport =
    dummyUmkmDashboardReports.find((report) => report.umkmId === currentUmkm.id) ??
    null;
  const activeCart =
    dummyCarts.find((cart) => cart.umkmId === currentUmkm.id && cart.status === "active") ??
    null;
  const umkmOrders = dummyOrders.filter((order) => order.umkmId === currentUmkm.id);
  const activeOrders = umkmOrders.filter((order) =>
    activeOrderStatuses.includes(order.orderStatus),
  );
  const completedOrders = umkmOrders.filter(
    (order) => order.orderStatus === "completed",
  );
  const pendingPayments = umkmOrders.filter(
    (order) => order.paymentStatus === "pending",
  );
  const latestResults = dummyOrders
    .filter((order) => resultOrderStatuses.includes(order.orderStatus))
    .slice(0, 3);
  const activeBrief =
    dummyCampaignBriefs.find((brief) => brief.umkmId === currentUmkm.id) ??
    dummyCampaignBriefs[0];

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
      value: String(dashboardReport?.activeOrders ?? activeOrders.length),
      description: "Paket jasa digital yang sedang menunggu proses kreator.",
      icon: ListChecks,
    },
    {
      label: "Pesanan selesai",
      value: String(dashboardReport?.completedOrders ?? completedOrders.length),
      description: "Campaign yang sudah selesai dan siap menjadi referensi.",
      icon: FolderCheck,
    },
    {
      label: "Pembayaran pending",
      value: String(pendingPayments.length),
      description: "Pembayaran dummy yang masih perlu ditinjau sebelum produksi.",
      icon: CreditCard,
    },
    {
      label: "Total simulasi belanja",
      value: formatCurrency(dashboardReport?.totalSpend ?? 0),
      description: "Nilai dummy untuk pesanan UMKM pada tahap fondasi.",
      icon: LayoutDashboard,
    },
  ];

  const orderItems: readonly DashboardListItem[] = activeOrders.map((order) => {
    const creator = dummyCreators.find((item) => item.id === order.creatorId);
    const service = dummyServicePackages.find(
      (item) => item.id === order.servicePackageId,
    );

    return {
      title: order.orderNumber,
      description: `${service?.title ?? "Paket jasa digital"} oleh ${
        creator?.displayName ?? "kreator"
      }`,
      meta: `Deadline ${formatDate(order.deadline)} · ${formatCurrency(order.totalAmount)}`,
      href: `/umkm/orders/${order.id}`,
      badge: <OrderStatusBadge status={order.orderStatus} />,
    };
  });

  const paymentItems: readonly DashboardListItem[] = pendingPayments.map((order) => {
    const payment = dummyPayments.find((item) => item.id === order.paymentId);

    return {
      title: payment?.paymentNumber ?? order.orderNumber,
      description: `Pembayaran untuk ${order.orderNumber}`,
      meta: formatCurrency(order.totalAmount),
      href: payment ? `/umkm/payments/${payment.id}` : `/umkm/orders/${order.id}`,
      badge: <PaymentStatusBadge status={order.paymentStatus} />,
    };
  });

  const resultItems: readonly DashboardListItem[] = latestResults.map((order) => {
    const creator = dummyCreators.find((item) => item.id === order.creatorId);
    const service = dummyServicePackages.find(
      (item) => item.id === order.servicePackageId,
    );

    return {
      title: `Hasil konten · ${order.orderNumber}`,
      description: `${service?.title ?? "Paket jasa digital"} dari ${
        creator?.displayName ?? "kreator"
      }`,
      meta:
        order.orderStatus === "completed"
          ? "Selesai dan siap diarsipkan"
          : "Perlu ditinjau oleh UMKM",
      href: `/umkm/orders/${order.id}`,
      badge: <OrderStatusBadge status={order.orderStatus} />,
    };
  });

  const activityItems: readonly DashboardListItem[] = dummyNotifications
    .filter((notification) => notification.userId === currentUmkm.userId)
    .slice(0, 4)
    .map((notification) => ({
      title: notification.title,
      description: notification.message,
      meta: formatDate(notification.createdAt),
      href: notification.actionUrl,
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
          title={`Selamat datang, ${currentUmkm.businessName}`}
          description="Pantau status pesanan, brief campaign, pembayaran dummy, dan rekomendasi kreator dari satu ruang kerja yang rapi."
          actions={[
            { href: "/katalog", label: "Cari Kreator" },
            { href: "/umkm/cart", label: "Lihat Keranjang", variant: "outline" },
            { href: "/umkm/orders", label: "Pesanan Saya", variant: "secondary" },
          ]}
          highlights={[
            { label: "Kategori usaha", value: currentUmkm.businessCategory },
            { label: "Kota", value: currentUmkm.city },
            {
              label: "Keranjang aktif",
              value: activeCart ? formatCurrency(activeCart.totalAmount) : "Belum ada",
            },
          ]}
        />

        <DashboardMetricGrid metrics={metrics} />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <DashboardPanel
            title="Pesanan aktif"
            description="Pantau status pesanan dan pembayaran secara terpisah."
            action={{ href: "/umkm/orders", label: "Lihat semua" }}
          >
            <DashboardList
              items={orderItems}
              emptyText="Belum ada pesanan aktif untuk UMKM ini."
            />
          </DashboardPanel>

          <DashboardPanel
            title="Brief campaign aktif"
            description="Brief yang jelas membantu kreator memahami arah konten sejak awal."
            action={{ href: "/umkm/briefs", label: "Kelola brief" }}
          >
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
                  {activeBrief.status === "linked_to_order" ? "Tertaut" : "Draft"}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-muted-foreground">Platform konten</p>
                  <p className="mt-1 font-medium text-foreground">
                    {activeBrief.contentPlatforms.join(", ")}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-muted-foreground">Deadline</p>
                  <p className="mt-1 font-medium text-foreground">
                    {formatDate(activeBrief.deadline)}
                  </p>
                </div>
              </div>
            </div>
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <DashboardPanel
            title="Hasil konten terbaru"
            description="Area ringkas untuk meninjau hasil konten dummy yang sudah dikirim kreator."
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
              emptyText="Tidak ada pembayaran pending untuk simulasi UMKM ini."
            />
          </DashboardPanel>
        </section>

        <DashboardPanel
          title="Rekomendasi kreator dan layanan digital"
          description="Pilihan awal dari dummy data untuk membantu UMKM memulai pencarian."
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
            <DashboardList items={activityItems} />
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
