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
  cleared: "Keranjang berhasil dikosongkan.",
  created: "Data berhasil dibuat.",
  deleted: "Data berhasil dihapus.",
  paid: "Pembayaran berhasil diproses.",
  registered: "Akun berhasil dibuat. Silakan masuk.",
  removed: "Data berhasil dihapus.",
  saved: "Perubahan berhasil disimpan.",
  started: "Pengerjaan berhasil dimulai.",
  submitted: "Hasil konten berhasil dikirim.",
  tier_created: "Paket harga berhasil ditambahkan.",
  tier_toggled: "Status paket harga berhasil diperbarui.",
  tier_updated: "Paket harga berhasil diperbarui.",
  toggled: "Status berhasil diperbarui.",
  updated: "Perubahan berhasil disimpan.",
  completed: "Pesanan berhasil diselesaikan.",
  complaint_created: "Komplain berhasil dikirim.",
  message_sent: "Pesan berhasil dikirim.",
  reviewed: "Review berhasil dikirim.",
  review_updated: "Moderasi review berhasil diperbarui.",
  revision_requested: "Permintaan revisi berhasil dikirim.",
};

const infoMessages: Record<string, string> = {
  already_paid: "Pembayaran sudah diproses sebelumnya.",
};

const warningMessages: Record<string, string> = {
  cart_empty: "Keranjang layanan masih kosong.",
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
  delivery_update: "Hasil konten belum bisa diproses.",
  file_extension: "Format file belum didukung.",
  file_size: "Ukuran file terlalu besar.",
  file_type: "Tipe file belum didukung.",
  complaint_required: "Subjek dan detail komplain wajib diisi.",
  invalid_rating: "Rating harus berada di angka 1 sampai 5.",
  message_required: "Pesan tidak boleh kosong.",
  order_create: "Pesanan belum bisa dibuat.",
  order_not_accessible: "Order tidak dapat diakses oleh akun ini.",
  order_not_approvable: "Hasil belum bisa diterima pada status ini.",
  order_not_revisable: "Revisi belum bisa diminta pada status ini.",
  order_not_reviewable: "Review hanya bisa diberikan setelah pesanan selesai.",
  order_not_submittable: "Hasil belum bisa dikirim pada status ini.",
  payment_not_payable: "Pembayaran sudah diproses atau tidak dapat dilanjutkan.",
  payment_update: "Pembayaran belum bisa diproses.",
  review_exists: "Review untuk pesanan ini sudah pernah dikirim.",
  revision_limit_reached: "Batas revisi paket sudah terpakai.",
  revision_note_required: "Catatan revisi wajib diisi.",
  submission_empty: "Tambahkan file, link, atau catatan hasil.",
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

    for (const key of Object.keys(infoMessages)) {
      if (searchParams.get(key)) {
        toast.info(infoMessages[key]);
        return;
      }
    }

    for (const key of Object.keys(warningMessages)) {
      if (searchParams.get(key)) {
        toast.warning(warningMessages[key]);
        return;
      }
    }

    const error = searchParams.get("error");

    if (error) {
      if (warningMessages[error]) {
        toast.warning(warningMessages[error]);
        return;
      }

      toast.error(errorMessages[error] ?? "Proses belum berhasil. Coba beberapa saat lagi.");
    }
  }, [pathname, query, searchParams]);

  return null;
}
