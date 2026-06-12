import { PageContainer } from "@/components/layout/page-container";
import { getPublicCatalogData } from "@/features/catalog/data/catalog-queries";

export async function HomeStatsSection() {
  const { creators, services, categories } = await getPublicCatalogData();
  const averageCreatorRating =
    creators.length > 0
      ? creators.reduce((total, creator) => total + creator.averageRating, 0) /
        creators.length
      : 0;

  const stats = [
    {
      value: `${creators.length}`,
      label: "Kreator aktif",
    },
    {
      value: `${services.length}`,
      label: "Paket jasa tersedia",
    },
    {
      value: `${categories.length}`,
      label: "Kategori layanan digital",
    },
    {
      value: creators.length > 0 ? `${averageCreatorRating.toFixed(1)}/5.0` : "-",
      label: "Rata-rata rating kreator",
    },
  ] as const;

  return (
    <section className="border-b border-border/70 bg-[linear-gradient(180deg,var(--background),var(--surface-soft))] py-8">
      <PageContainer>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-border/70 bg-card px-5 py-5 shadow-[var(--shadow-soft)]"
            >
              <p className="text-3xl font-semibold tracking-tight text-brand-navy">
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
