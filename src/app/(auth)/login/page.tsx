import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Masuk — Ruang Usaha Kita",
  description: "Masuk ke akun Ruang Usaha Kita Anda untuk mulai mengelola campaign.",
};

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getNotice(params: Record<string, string | string[] | undefined>) {
  if (getSingleParam(params.registered) === "1") {
    return "Akun berhasil dibuat. Silakan masuk untuk melanjutkan.";
  }

  if (getSingleParam(params.logged_out) === "1") {
    return "Anda sudah keluar dari akun.";
  }

  return undefined;
}

function getRouteError(params: Record<string, string | string[] | undefined>) {
  const error = getSingleParam(params.error);

  if (error === "inactive") {
    return "Akun belum aktif atau sedang dibatasi. Hubungi admin.";
  }

  if (error === "profile") {
    return "Profil akun belum tersedia. Hubungi admin.";
  }

  if (error === "callback") {
    return "Link masuk tidak valid atau sudah kedaluwarsa.";
  }

  return undefined;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return <LoginForm notice={getNotice(params)} routeError={getRouteError(params)} />;
}
