import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pusat Bantuan — Ruang Usaha Kita",
  description: "Temukan jawaban atas pertanyaan seputar cara kerja marketplace, pembayaran, dan penyelesaian sengketa.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
