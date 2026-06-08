import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { UmkmOnboardingForm } from "@/features/onboarding/components/umkm-onboarding-form";
import { getCurrentUmkmOnboardingData } from "@/features/onboarding/data/onboarding-queries";

export const metadata: Metadata = {
  title: "Lengkapi Profil UMKM — Ruang Usaha Kita",
  description:
    "Lengkapi profil UMKM agar kreator memahami kebutuhan promosi digital dan brief campaign Anda.",
};

export default async function UmkmOnboardingPage() {
  const data = await getCurrentUmkmOnboardingData();

  return (
    <PageContainer>
      <OnboardingShell
        title="Siapkan profil usaha sebelum mulai campaign."
        description="Isi data dasar usaha agar proses memilih kreator, menyusun brief campaign, dan memantau pesanan menjadi lebih terarah."
        highlights={[
          "Profil bisa dilewati dulu jika Anda ingin langsung membuka dashboard.",
          "Dashboard tetap menampilkan pengingat jika profil belum lengkap.",
          "Data ini hanya digunakan untuk konteks layanan digital dan brief campaign.",
        ]}
      >
        <UmkmOnboardingForm data={data} />
      </OnboardingShell>
    </PageContainer>
  );
}
