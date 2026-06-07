import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Kreator — Ruang Usaha Kita",
  description: "Temukan kreator terbaik untuk membantu campaign promosi bisnis digital Anda.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
