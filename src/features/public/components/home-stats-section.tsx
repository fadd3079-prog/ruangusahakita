import { PageContainer } from "@/components/layout/page-container";
import {
  dummyCreators,
  dummyMonthlyReports,
  dummyServiceCategories,
} from "@/lib/dummy";

const simulatedOrders = dummyMonthlyReports.reduce(
  (total, report) => total + report.orders,
  0,
);

const averageCreatorRating =
  dummyCreators.reduce((total, creator) => total + creator.averageRating, 0) /
  dummyCreators.length;

const stats = [
  {
    value: `${dummyCreators.length}`,
    label: "kreator dalam data awal",
  },
  {
    value: `${simulatedOrders}+`,
    label: "simulasi pesanan di laporan dummy",
  },
  {
    value: `${dummyServiceCategories.length}`,
    label: "kategori layanan digital",
  },
  {
    value: averageCreatorRating.toFixed(1),
    label: "rata-rata rating kreator dummy",
  },
] as const;

export function HomeStatsSection() {
  return (
    <section className="border-b border-border/70 bg-muted/30 py-8">
      <PageContainer>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-lg border border-border/70 bg-card px-5 py-5 shadow-xs"
            >
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
