import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Daftar Akun — Ruang Usaha Kita",
  description: "Daftar sebagai UMKM atau Kreator untuk mulai berkolaborasi.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
