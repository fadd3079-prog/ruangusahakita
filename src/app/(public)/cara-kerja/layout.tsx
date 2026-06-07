import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cara Kerja — Ruang Usaha Kita",
  description: "Pelajari bagaimana platform Ruang Usaha Kita memfasilitasi transaksi aman antara UMKM dan Kreator Digital.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
