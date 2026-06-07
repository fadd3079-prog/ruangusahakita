import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Masuk — Ruang Usaha Kita",
  description: "Masuk ke akun Ruang Usaha Kita Anda untuk mulai mengelola campaign.",
};

export default function LoginPage() {
  return <LoginForm />;
}
