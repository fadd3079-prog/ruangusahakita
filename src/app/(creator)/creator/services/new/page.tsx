import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { createCreatorServiceAction } from "@/features/creator/services/actions/creator-service-actions";
import { CreatorServiceForm } from "@/features/creator/services/components/creator-service-form";
import { getCreatorServiceCategories } from "@/features/creator/services/data/creator-service-queries";

export const metadata: Metadata = {
  title: "Tambah Layanan Baru — Ruang Usaha Kita",
  description: "Buat paket jasa digital baru untuk ditawarkan kepada UMKM.",
};

type NewServicePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewServicePage({ searchParams }: NewServicePageProps) {
  const [{ error }, categories] = await Promise.all([
    searchParams,
    getCreatorServiceCategories(),
  ]);

  return (
    <PageContainer>
      <CreatorServiceForm
        action={createCreatorServiceAction}
        categories={categories}
        description="Buat paket jasa digital baru yang jelas dari sisi output, harga, estimasi, dan revisi."
        error={error}
        submitLabel="Simpan Paket"
        title="Tambah Paket Layanan"
      />
    </PageContainer>
  );
}
