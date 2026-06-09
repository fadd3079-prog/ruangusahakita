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
    addon_created?: string;
    addon_deleted?: string;
    addon_updated?: string;
    error?: string;
    tier_created?: string;
    tier_toggled?: string;
    tier_updated?: string;
  }>;
};

function getSuccess(params: Awaited<EditServicePageProps["searchParams"]>) {
  if (params.addon_created) {
    return "addon_created";
  }

  if (params.addon_updated) {
    return "addon_updated";
  }

  if (params.addon_deleted) {
    return "addon_deleted";
  }

  if (params.tier_created) {
    return "tier_created";
  }

  if (params.tier_updated) {
    return "tier_updated";
  }

  if (params.tier_toggled) {
    return "tier_toggled";
  }

  return undefined;
}

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
  const [{ serviceId }, currentSearchParams, categories] = await Promise.all([
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
        error={currentSearchParams.error}
        service={service}
        submitLabel="Simpan Perubahan"
        success={getSuccess(currentSearchParams)}
        title="Edit Paket Layanan"
      />
    </PageContainer>
  );
}
