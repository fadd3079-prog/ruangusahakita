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

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import {
  DashboardHero,
  DashboardList,
  DashboardMetricGrid,
  DashboardPanel,
  DashboardQuickActions,
  type DashboardListItem,
  type DashboardMetric,
} from "@/features/dashboard/components/dashboard-overview";
import { getCreatorDashboardOverview } from "@/features/dashboard/data/dashboard-queries";
import { ProfileCompletionCard } from "@/features/onboarding/components/profile-completion-card";
import { isCreatorProfileComplete } from "@/features/onboarding/lib/profile-completion";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { getCurrentAccountSummary } from "@/lib/auth/account";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Dashboard Kreator — Ruang Usaha Kita",
  description:
    "Ringkasan order kreator, deadline, revisi, rating, pendapatan, portofolio, dan paket layanan.",
};

function formatOptionalDate(value: string | null) {
  return value ? formatDate(value) : "Belum diatur";
}

function getAvailabilityLabel(value: string | null | undefined) {
  if (value === "available") {
    return "Tersedia";
  }

  if (value === "limited") {
    return "Terbatas";
  }

  if (value === "busy") {
    return "Sibuk";
  }

  if (value === "unavailable") {
    return "Tidak tersedia";
  }

  return "Belum diatur";
}

export default async function CreatorDashboardPage() {
  const [dashboard, account] = await Promise.all([
    getCreatorDashboardOverview(),
    getCurrentAccountSummary(),
  ]);
  const currentCreator = dashboard.profile;
  const profileComplete =
    Boolean(account?.onboardingCompleted) &&
    isCreatorProfileComplete(currentCreator);
  const displayName = currentCreator?.display_name ?? "Profil kreator belum lengkap";
  const niche = currentCreator?.niche ?? "Belum diisi";
  const completedOrders = dashboard.metrics.completedOrders;

  const metrics: readonly DashboardMetric[] = [
    {
      label: "Order aktif",
      value: String(dashboard.metrics.activeOrders),
      description: "Order yang masih perlu dipantau atau ditindaklanjuti.",
      icon: ListChecks,
    },
    {
      label: "Revisi diminta",
      value: String(dashboard.metrics.revisionRequests),
      description: "Permintaan revisi yang menunggu respons kreator.",
      icon: MessageSquareWarning,
    },
    {
      label: "Order selesai",
      value: String(completedOrders),
      description: "Jumlah order selesai yang terbaca untuk kreator ini.",
      icon: FolderCheck,
    },
    {
      label: "Rating rata-rata",
      value: dashboard.metrics.averageRating.toFixed(1),
      description: "Rating profil kreator berdasarkan data yang tersedia.",
      icon: Star,
    },
    {
      label: "Estimasi pendapatan",
      value: formatCurrency(dashboard.metrics.estimatedEarnings),
      description: "Estimasi dari order paid setelah platform fee.",
      icon: WalletCards,
    },
  ];

  const orderItems: readonly DashboardListItem[] = dashboard.recentOrders.map(
    (order) => ({
      title: order.orderNumber,
      description: `${order.counterpartName} · ${order.serviceTitle}`,
      meta: `Deadline ${formatOptionalDate(order.deadline)} · ${formatCurrency(
        order.totalAmount,
      )}`,
      href: `/creator/orders/${order.id}`,
      badge: <OrderStatusBadge status={order.orderStatus} />,
    }),
  );

  const deadlineItems: readonly DashboardListItem[] = [...dashboard.recentOrders]
    .sort((first, second) => {
      if (!first.deadline) {
        return 1;
      }

      if (!second.deadline) {
        return -1;
      }

      return new Date(first.deadline).getTime() - new Date(second.deadline).getTime();
    })
    .slice(0, 4)
    .map((order) => ({
      title: `${order.orderNumber} · ${order.counterpartName}`,
      description: order.serviceTitle,
      meta: `Deadline ${formatOptionalDate(order.deadline)}`,
      href: `/creator/orders/${order.id}`,
      badge: <OrderStatusBadge status={order.orderStatus} />,
    }));

  const revisionItems: readonly DashboardListItem[] =
    dashboard.revisionOrders.map((order) => ({
      title: `Revisi · ${order.orderNumber}`,
      description: `${order.counterpartName} meminta penyesuaian hasil konten.`,
      meta: `Deadline ${formatOptionalDate(order.deadline)}`,
      href: `/creator/orders/${order.id}`,
      badge: <OrderStatusBadge status={order.orderStatus} />,
    }));

  const serviceItems: readonly DashboardListItem[] = dashboard.services.map(
    (service) => ({
      title: service.title,
      description: service.short_description ?? "Paket jasa digital kreator.",
      meta: `${formatCurrency(Number(service.base_price))} · ${service.estimated_days} hari`,
      href: `/layanan/${service.id}`,
      badge: service.is_featured ? (
        <Badge variant="secondary" className="rounded-lg">
          Unggulan
        </Badge>
      ) : null,
    }),
  );

  const portfolioItems: readonly DashboardListItem[] = dashboard.portfolios.map(
    (portfolio) => ({
      title: portfolio.title,
      description: portfolio.description ?? "Preview portofolio kreator.",
      meta: portfolio.client_type ?? "Portofolio",
      href: "/creator/portfolio",
      badge: portfolio.is_featured ? (
        <Badge variant="secondary" className="rounded-lg">
          Featured
        </Badge>
      ) : null,
    }),
  );

  const activityItems: readonly DashboardListItem[] =
    dashboard.notifications.map((notification) => ({
      title: notification.title,
      description: notification.message ?? "Aktivitas terbaru untuk kreator.",
      meta: formatDate(notification.createdAt),
      href: notification.actionUrl ?? "/creator/dashboard",
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
          title={`Halo, ${displayName}`}
          description="Pantau order, deadline, revisi, dan performa layanan."
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
            { label: "Niche", value: niche },
            { label: "Order selesai", value: String(completedOrders) },
            {
              label: "Ketersediaan",
              value: getAvailabilityLabel(currentCreator?.availability_status),
            },
          ]}
        />

        {!profileComplete ? (
          <ProfileCompletionCard
            title="Profil kreator belum lengkap"
            description="Lengkapi niche, bio, lokasi, dan ketersediaan."
            href="/creator/onboarding"
          />
        ) : null}

        <DashboardMetricGrid metrics={metrics} />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <DashboardPanel
            title="Order terbaru"
            description="Order yang perlu dipantau."
            action={{ href: "/creator/orders", label: "Buka order" }}
          >
            <DashboardList
              items={orderItems}
              emptyText="Belum ada order yang terbaca untuk kreator ini."
            />
          </DashboardPanel>

          <DashboardPanel
            title="Deadline terdekat"
            description="Urutan pekerjaan terdekat."
          >
            <DashboardList
              items={deadlineItems}
              emptyText="Tidak ada deadline aktif yang tersedia."
            />
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <DashboardPanel
            title="Permintaan revisi"
            description="Revisi yang menunggu respons."
            action={{ href: "/creator/orders", label: "Tangani revisi" }}
          >
            <DashboardList
              items={revisionItems}
              emptyText="Belum ada revisi yang perlu ditangani."
            />
          </DashboardPanel>

          <DashboardPanel title="Aktivitas terbaru">
            <DashboardList
              items={activityItems}
              emptyText="Belum ada aktivitas terbaru untuk kreator ini."
            />
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-6">
            <DashboardPanel
              title="Paket layanan"
              description="Paket jasa aktif."
              action={{ href: "/creator/services", label: "Kelola layanan" }}
            >
              <DashboardList
                items={serviceItems}
                emptyText="Belum ada paket layanan aktif yang terbaca untuk kreator ini."
              />
            </DashboardPanel>

            <DashboardPanel
              title="Portofolio"
              description="Preview hasil kerja."
              action={{ href: "/creator/portfolio", label: "Kelola portofolio" }}
            >
              <DashboardList
                items={portfolioItems}
                emptyText="Belum ada portofolio yang terbaca untuk kreator ini."
              />
            </DashboardPanel>
          </div>

          <DashboardPanel
            title="Aksi cepat"
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
                    Dahulukan order dengan deadline terdekat dan brief campaign
                    yang sudah jelas.
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
