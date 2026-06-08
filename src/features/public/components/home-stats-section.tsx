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
