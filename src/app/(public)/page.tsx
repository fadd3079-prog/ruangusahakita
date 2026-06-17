import type { Metadata } from "next";

import { AiSmartMatchingSection } from "@/features/public/components/ai-smart-matching-section";
import { CreatorCtaSection } from "@/features/public/components/creator-cta-section";
import { FaqPreviewSection } from "@/features/public/components/faq-preview-section";
import { FeaturedCreatorsSection } from "@/features/public/components/featured-creators-section";
import { HeroSection } from "@/features/public/components/hero-section";
import { HomeStatsSection } from "@/features/public/components/home-stats-section";
import { HowItWorksSection } from "@/features/public/components/how-it-works-section";
import { ServiceCategorySection } from "@/features/public/components/service-category-section";
import { UmkmBenefitsSection } from "@/features/public/components/umkm-benefits-section";

export const metadata: Metadata = {
  title: "Ruang Usaha Kita — Marketplace Jasa Digital untuk UMKM",
  description:
    "Temukan kreator dan paket jasa digital untuk membantu promosi UMKM melalui brief campaign, pembayaran, status pesanan, revisi, dan review yang lebih terarah.",
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HomeStatsSection />
      <ServiceCategorySection />
      <AiSmartMatchingSection />
      <FeaturedCreatorsSection />
      <HowItWorksSection />
      <UmkmBenefitsSection />
      <CreatorCtaSection />
      <FaqPreviewSection />
    </main>
  );
}
