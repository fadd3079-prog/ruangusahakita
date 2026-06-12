"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const successMessages: Record<string, string> = {
  accepted: "Order berhasil diterima.",
  added: "Layanan berhasil ditambahkan ke keranjang.",
  addon_created: "Add-on berhasil ditambahkan.",
  addon_deleted: "Add-on berhasil dihapus.",
  addon_updated: "Add-on berhasil diperbarui.",
  already_paid: "Pembayaran sudah diproses sebelumnya.",
  cleared: "Keranjang berhasil dikosongkan.",
  created: "Data berhasil dibuat.",
  deleted: "Data berhasil dihapus.",
  paid: "Pembayaran berhasil diproses.",
  registered: "Akun berhasil dibuat. Silakan masuk.",
  removed: "Data berhasil dihapus.",
  saved: "Perubahan berhasil disimpan.",
  started: "Pengerjaan berhasil dimulai.",
  tier_created: "Paket harga berhasil ditambahkan.",
  tier_toggled: "Status paket harga berhasil diperbarui.",
  tier_updated: "Paket harga berhasil diperbarui.",
  toggled: "Status berhasil diperbarui.",
  updated: "Perubahan berhasil disimpan.",
};

const successByPath: readonly [string, Partial<Record<string, string>>][] = [
  [
    "/creator/services",
    {
      created: "Layanan berhasil disimpan.",
      deleted: "Layanan berhasil dihapus dari katalog.",
      toggled: "Status layanan berhasil diperbarui.",
      updated: "Layanan berhasil diperbarui.",
    },
  ],
  [
    "/creator/portfolio",
    {
      created: "Portofolio berhasil ditambahkan.",
      deleted: "Portofolio berhasil dihapus dari daftar aktif.",
      updated: "Portofolio berhasil diperbarui.",
    },
  ],
  [
    "/creator/settings",
    {
      saved: "Profil kreator berhasil disimpan.",
    },
  ],
  [
    "/creator/profile",
    {
      saved: "Profil kreator berhasil disimpan.",
    },
  ],
  [
    "/umkm/cart",
    {
      added: "Layanan berhasil ditambahkan ke keranjang.",
      cleared: "Keranjang berhasil dikosongkan.",
      removed: "Layanan berhasil dihapus dari keranjang.",
      updated: "Keranjang berhasil diperbarui.",
    },
  ],
  [
    "/umkm/checkout",
    {
      saved: "Brief campaign berhasil disimpan.",
    },
  ],
  [
    "/umkm/settings",
    {
      updated: "Profil UMKM berhasil disimpan.",
    },
  ],
  [
    "/umkm/orders",
    {
      created: "Pesanan berhasil dibuat.",
      paid: "Pembayaran berhasil diproses.",
    },
  ],
];

const errorMessages: Record<string, string> = {
  addon_save: "Add-on belum bisa disimpan.",
  addon_update: "Add-on belum bisa diperbarui.",
  brief_required: "Brief campaign perlu dilengkapi.",
  cart_empty: "Keranjang layanan masih kosong.",
  order_create: "Pesanan belum bisa dibuat.",
  payment_not_payable: "Pembayaran sudah diproses atau tidak dapat dilanjutkan.",
  payment_update: "Pembayaran belum bisa diproses.",
  save: "Gagal menyimpan. Coba beberapa saat lagi.",
  unauthorized: "Akses akun tidak sesuai.",
};

function getSuccessMessage(pathname: string, key: string) {
  const pathMatch = successByPath.find(([path]) => pathname.startsWith(path));
  return pathMatch?.[1][key] ?? successMessages[key] ?? null;
}

export function ActionFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    if (!query) {
      return;
    }

    const toastKey = `${pathname}?${query}`;

    if (sessionStorage.getItem(toastKey)) {
      return;
    }

    sessionStorage.setItem(toastKey, "1");

    for (const key of Object.keys(successMessages)) {
      if (searchParams.get(key)) {
        toast.success(getSuccessMessage(pathname, key) ?? successMessages[key]);
        return;
      }
    }

    const error = searchParams.get("error");

    if (error) {
      toast.error(errorMessages[error] ?? "Proses belum berhasil. Coba beberapa saat lagi.");
    }
  }, [pathname, query, searchParams]);

  return null;
}
