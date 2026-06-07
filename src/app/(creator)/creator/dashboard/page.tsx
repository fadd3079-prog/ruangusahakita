import type { Metadata } from "next";
import {
  BriefcaseBusiness,
  CalendarClock,
  ClipboardList,
  FolderCheck,
  Images,
  ListChecks,
  MessageSquareWarning,
  Star,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/layout/page-container";
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
import {
  dummyCampaignBriefs,
  dummyCreators,
  dummyNotifications,
  dummyOrders,
  dummyPortfolios,
  dummyReviews,
  dummyServiceCategories,
  dummyServicePackages,
  dummyUmkmProfiles,
} from "@/lib/dummy";
import type { DummyOrderStatus } from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Dashboard Kreator — Ruang Usaha Kita",
  description:
    "Ringkasan order kreator, deadline, revisi, rating, pendapatan dummy, portofolio, dan paket layanan.",
};

const creatorActiveStatuses: readonly DummyOrderStatus[] = [
  "paid",
  "waiting_creator_confirmation",
  "brief_accepted",
  "in_progress",
  "submitted",
  "revision_requested",
  "revised",
] as const;

export default function CreatorDashboardPage() {
  const currentCreator =
    dummyCreators.find((creator) => creator.id === "creator_003") ??
    dummyCreators[0];
  const creatorOrders = dummyOrders.filter(
    (order) => order.creatorId === currentCreator.id,
  );
  const activeOrders = creatorOrders.filter((order) =>
    creatorActiveStatuses.includes(order.orderStatus),
  );
  const revisionOrders = creatorOrders.filter(
    (order) => order.orderStatus === "revision_requested",
  );
  const completedOrders = creatorOrders.filter(
    (order) => order.orderStatus === "completed",
  );
  const estimatedEarnings = creatorOrders
    .filter((order) => order.paymentStatus === "paid")
    .reduce(
      (total, order) =>
        total + order.subtotalAmount + order.addonAmount - order.platformFee,
      0,
    );
  const creatorServices = dummyServicePackages.filter(
    (service) => service.creatorId === currentCreator.id,
  );
  const creatorPortfolios = dummyPortfolios.filter(
    (portfolio) => portfolio.creatorId === currentCreator.id,
  );
  const creatorReviewCount = dummyReviews.filter(
    (review) => review.creatorId === currentCreator.id,
  ).length;

  const metrics: readonly DashboardMetric[] = [
    {
      label: "Order aktif",
      value: String(activeOrders.length),
      description: "Order dummy yang masih perlu ditangani kreator.",
      icon: ListChecks,
    },
    {
      label: "Revisi diminta",
      value: String(revisionOrders.length),
      description: "Permintaan revisi yang menunggu respons kreator.",
      icon: MessageSquareWarning,
    },
    {
      label: "Order selesai",
      value: String(completedOrders.length || currentCreator.completedOrdersCount),
      description: "Jumlah order selesai pada data kreator dummy.",
      icon: FolderCheck,
    },
    {
      label: "Rating rata-rata",
      value: currentCreator.averageRating.toFixed(1),
      description: `${creatorReviewCount} review dummy yang sudah tersedia.`,
      icon: Star,
    },
    {
      label: "Estimasi pendapatan",
      value: formatCurrency(estimatedEarnings),
      description: "Simulasi pendapatan dari order paid setelah platform fee.",
      icon: WalletCards,
    },
  ];

  const orderItems: readonly DashboardListItem[] = activeOrders.map((order) => {
    const umkm = dummyUmkmProfiles.find((item) => item.id === order.umkmId);
    const service = dummyServicePackages.find(
      (item) => item.id === order.servicePackageId,
    );

    return {
      title: order.orderNumber,
      description: `${umkm?.businessName ?? "UMKM"} · ${
        service?.title ?? "Paket jasa digital"
      }`,
      meta: `Deadline ${formatDate(order.deadline)} · ${formatCurrency(order.totalAmount)}`,
      href: `/creator/orders/${order.id}`,
      badge: <OrderStatusBadge status={order.orderStatus} />,
    };
  });

  const deadlineItems: readonly DashboardListItem[] = [...activeOrders]
    .sort(
      (first, second) =>
        new Date(first.deadline).getTime() - new Date(second.deadline).getTime(),
    )
    .slice(0, 4)
    .map((order) => {
      const brief = dummyCampaignBriefs.find(
        (item) => item.id === order.campaignBriefId,
      );

      return {
        title: `${order.orderNumber} · ${brief?.businessName ?? "UMKM"}`,
        description: brief?.promotedFocus ?? "Brief campaign aktif",
        meta: `Deadline ${formatDate(order.deadline)}`,
        href: `/creator/orders/${order.id}`,
        badge: <OrderStatusBadge status={order.orderStatus} />,
      };
    });

  const revisionItems: readonly DashboardListItem[] = revisionOrders.map((order) => {
    const brief = dummyCampaignBriefs.find(
      (item) => item.id === order.campaignBriefId,
    );

    return {
      title: `Revisi · ${order.orderNumber}`,
      description:
        brief?.additionalNotes ??
        "UMKM meminta penyesuaian pada hasil konten yang dikirim.",
      meta: brief ? `${brief.businessName} · ${formatDate(order.deadline)}` : undefined,
      href: `/creator/orders/${order.id}`,
      badge: <OrderStatusBadge status={order.orderStatus} />,
    };
  });

  const serviceItems: readonly DashboardListItem[] = creatorServices.map(
    (service) => {
      const category = dummyServiceCategories.find(
        (item) => item.id === service.categoryId,
      );

      return {
        title: service.title,
        description: service.shortDescription,
        meta: `${category?.name ?? "Layanan digital"} · ${formatCurrency(
          service.basePrice,
        )}`,
        href: `/layanan/${service.id}`,
        badge: service.isFeatured ? (
          <Badge variant="secondary" className="rounded-lg">
            Unggulan
          </Badge>
        ) : null,
      };
    },
  );

  const portfolioItems: readonly DashboardListItem[] = creatorPortfolios.map(
    (portfolio) => ({
      title: portfolio.title,
      description: portfolio.description,
      meta: portfolio.clientName,
      href: "/creator/portfolio",
      badge: portfolio.isFeatured ? (
        <Badge variant="secondary" className="rounded-lg">
          Featured
        </Badge>
      ) : null,
    }),
  );

  const activityItems: readonly DashboardListItem[] = dummyNotifications
    .filter((notification) => notification.userId === currentCreator.userId)
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
          eyebrow="Dashboard Kreator"
          title={`Halo, ${currentCreator.displayName}`}
        description="Pantau order masuk, deadline terdekat, permintaan revisi, dan kualitas layanan digital dari satu dashboard ringkas."
        actions={[
          { href: "/creator/orders", label: "Lihat Order" },
          {
            href: "/creator/services",
            label: "Kelola Paket Layanan",
            variant: "outline",
          },
          {
            href: "/creator/portfolio",
            label: "Portofolio",
            variant: "secondary",
          },
        ]}
        highlights={[
          { label: "Niche", value: currentCreator.niche },
          { label: "Order selesai", value: String(currentCreator.completedOrdersCount) },
          {
            label: "Ketersediaan",
            value:
              currentCreator.availabilityStatus === "available"
                ? "Tersedia"
                : "Terbatas",
          },
        ]}
      />

      <DashboardMetricGrid metrics={metrics} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <DashboardPanel
          title="Order aktif"
          description="Daftar order yang perlu dipantau atau ditindaklanjuti."
          action={{ href: "/creator/orders", label: "Buka order" }}
        >
          <DashboardList
            items={orderItems}
            emptyText="Belum ada order aktif untuk kreator ini."
          />
        </DashboardPanel>

        <DashboardPanel
          title="Deadline terdekat"
          description="Prioritaskan pekerjaan berdasarkan tanggal deadline."
        >
          <DashboardList
            items={deadlineItems}
            emptyText="Tidak ada deadline aktif dalam dummy data."
          />
        </DashboardPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardPanel
          title="Permintaan revisi"
          description="CTA di halaman detail order masih berupa placeholder UI."
          action={{ href: "/creator/orders", label: "Tangani revisi" }}
        >
          <DashboardList
            items={revisionItems}
            emptyText="Belum ada revisi yang perlu ditangani."
          />
        </DashboardPanel>

        <DashboardPanel
          title="Aktivitas terbaru"
          description="Notifikasi dummy untuk ruang kerja kreator."
        >
          <DashboardList items={activityItems} />
        </DashboardPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          <DashboardPanel
            title="Paket layanan"
            description="Shortcut untuk melihat paket jasa yang tampil di katalog."
            action={{ href: "/creator/services", label: "Kelola layanan" }}
          >
            <DashboardList
              items={serviceItems}
              emptyText="Belum ada paket layanan untuk kreator ini."
            />
          </DashboardPanel>

          <DashboardPanel
            title="Portofolio"
            description="Contoh hasil kerja yang membantu UMKM menilai gaya kreator."
            action={{ href: "/creator/portfolio", label: "Kelola portofolio" }}
          >
            <DashboardList
              items={portfolioItems}
              emptyText="Belum ada portofolio untuk kreator ini."
            />
          </DashboardPanel>
        </div>

        <DashboardPanel
          title="Aksi cepat"
          description="Jalur utama kreator pada tahap dashboard dummy."
        >
          <DashboardQuickActions
            actions={[
              {
                href: "/creator/orders",
                label: "Order masuk",
                description: "Lihat brief campaign dan status pesanan.",
                icon: ClipboardList,
              },
              {
                href: "/creator/services",
                label: "Paket layanan",
                description: "Rapikan paket jasa dan estimasi pengerjaan.",
                icon: BriefcaseBusiness,
              },
              {
                href: "/creator/portfolio",
                label: "Portofolio",
                description: "Tampilkan contoh hasil konten terbaik.",
                icon: Images,
              },
            ]}
          />
          <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/10 p-4">
            <div className="flex items-start gap-3">
              <CalendarClock className="mt-0.5 size-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Fokus minggu ini
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Selesaikan order revisi lebih dulu agar hasil konten bisa
                  segera direview UMKM.
                </p>
              </div>
            </div>
          </div>
        </DashboardPanel>
      </section>
    </div>
  </PageContainer>
);
}
