import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { updateCreatorServiceAction } from "@/features/creator/services/actions/creator-service-actions";
import { CreatorServiceForm } from "@/features/creator/services/components/creator-service-form";
import {
  getCreatorServiceCategories,
  getCreatorServiceForEdit,
} from "@/features/creator/services/data/creator-service-queries";

type EditServicePageProps = {
  params: Promise<{
    serviceId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditServicePageProps): Promise<Metadata> {
  const { serviceId } = await params;
  const data = await getCreatorServiceForEdit(serviceId);

  return {
    title: data
      ? `Edit ${data.service.title} — Ruang Usaha Kita`
      : "Edit Layanan — Ruang Usaha Kita",
    description: "Edit paket jasa digital kreator di Ruang Usaha Kita.",
  };
}

export default async function EditServicePage({
  params,
  searchParams,
}: EditServicePageProps) {
  const [{ serviceId }, { error }, categories] = await Promise.all([
    params,
    searchParams,
    getCreatorServiceCategories(),
  ]);
  const service = await getCreatorServiceForEdit(serviceId);

  if (!service) {
    notFound();
  }

  return (
    <PageContainer>
      <CreatorServiceForm
        action={updateCreatorServiceAction}
        categories={categories}
        description="Perbarui detail paket jasa digital tanpa mengubah data transaksi atau order."
        error={error}
        service={service}
        submitLabel="Simpan Perubahan"
        title="Edit Paket Layanan"
      />
    </PageContainer>
  );
}
