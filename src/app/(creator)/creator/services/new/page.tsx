import type { Metadata } from "next";
import { randomUUID } from "node:crypto";

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
    detail?: string;
    error?: string;
  }>;
};

export default async function NewServicePage({ searchParams }: NewServicePageProps) {
  const [{ detail, error }, categories] = await Promise.all([
    searchParams,
    getCreatorServiceCategories(),
  ]);
  const createIntentId = randomUUID();

  return (
    <PageContainer>
      <CreatorServiceForm
        action={createCreatorServiceAction}
        categories={categories}
        createIntentId={createIntentId}
        description="Buat satu listing layanan dengan paket Basic wajib serta Medium dan Premium opsional."
        error={error}
        errorDetail={detail}
        submitLabel="Simpan Layanan"
        title="Tambah Layanan"
      />
    </PageContainer>
  );
}
