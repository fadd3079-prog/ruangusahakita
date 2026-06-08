import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { CreatorOnboardingForm } from "@/features/onboarding/components/creator-onboarding-form";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { getCurrentCreatorOnboardingData } from "@/features/onboarding/data/onboarding-queries";

export const metadata: Metadata = {
  title: "Lengkapi Profil Kreator — Ruang Usaha Kita",
  description:
    "Lengkapi profil kreator agar UMKM memahami niche, bio, ketersediaan, dan portofolio awal Anda.",
};

export default async function CreatorOnboardingPage() {
  const data = await getCurrentCreatorOnboardingData();

  return (
    <PageContainer>
      <OnboardingShell
        title="Bangun profil kreator yang siap dinilai UMKM."
        description="Lengkapi identitas kreator, niche, bio, lokasi, dan ketersediaan agar profil Anda siap masuk tahap layanan digital berikutnya."
        highlights={[
          "Profil kreator yang belum lengkap tidak dianggap siap tampil sebagai katalog publik.",
          "Paket layanan dan portofolio bisa dilengkapi pada tahap berikutnya.",
          "Anda tetap bisa melewati onboarding dan mengisi profil dari dashboard nanti.",
        ]}
      >
        <CreatorOnboardingForm data={data} />
      </OnboardingShell>
    </PageContainer>
  );
}
