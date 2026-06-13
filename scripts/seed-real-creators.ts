import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient, type User } from "@supabase/supabase-js";
import type { Database, Json } from "../src/lib/supabase/types";

type CategorySlug =
  | "desain-grafis"
  | "video-editing"
  | "content-creator"
  | "digital-marketing"
  | "copywriting"
  | "web-development";

type TierKey = "basic" | "medium" | "premium";

type CategorySeed = {
  name: string;
  slug: CategorySlug;
  description: string;
  iconName: string;
  sortOrder: number;
};

type ServiceTemplate = {
  title: string;
  shortDescription: string;
  description: string;
  tags: string[];
  deliverables: string[];
  requirements: string[];
  addOns: {
    name: string;
    description: string;
    price: number;
  }[];
};

type CreatorSeed = {
  index: number;
  displayName: string;
  categorySlug: CategorySlug;
  city: string;
  province: string;
  niche: string;
  bio: string;
  skills: string[];
  focus: string;
  serviceCount: 1 | 2;
  responseTimeHours: number;
};

type TierSeed = {
  tierKey: TierKey;
  name: "Basic" | "Medium" | "Premium";
  price: number;
  estimatedDays: number;
  revisionCount: number;
  description: string;
  deliverables: string[];
  sortOrder: number;
};

type SupabaseAdmin = ReturnType<typeof createClient<Database>>;
type ServicePackageRow = Database["public"]["Tables"]["service_packages"]["Row"];
type CreatorProfileRow = Database["public"]["Tables"]["creator_profiles"]["Row"];

const creatorStart = Number(process.env.SEED_CREATOR_START ?? 24);
const creatorEnd = Number(process.env.SEED_CREATOR_END ?? 50);

const categorySeeds: CategorySeed[] = [
  {
    name: "Desain Grafis",
    slug: "desain-grafis",
    description: "Visual promosi, feed, dan materi campaign untuk UMKM.",
    iconName: "Palette",
    sortOrder: 10,
  },
  {
    name: "Video Editing",
    slug: "video-editing",
    description: "Editing video pendek untuk Reels, TikTok, dan campaign digital.",
    iconName: "Video",
    sortOrder: 20,
  },
  {
    name: "Content Creator",
    slug: "content-creator",
    description: "Pembuatan konsep dan konten kreatif untuk promosi UMKM.",
    iconName: "Camera",
    sortOrder: 30,
  },
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "Strategi campaign, optimasi promosi, dan analisis konten.",
    iconName: "Megaphone",
    sortOrder: 40,
  },
  {
    name: "Copywriting",
    slug: "copywriting",
    description: "Caption, script, dan copy promosi yang ringkas dan jelas.",
    iconName: "PenLine",
    sortOrder: 50,
  },
  {
    name: "Web Development",
    slug: "web-development",
    description: "Landing page dan website sederhana untuk profil usaha.",
    iconName: "Code2",
    sortOrder: 60,
  },
];

const creatorSeeds: CreatorSeed[] = [
  {
    index: 24,
    displayName: "Sarah Viloid",
    categorySlug: "desain-grafis",
    city: "Purbalingga",
    province: "Jawa Tengah",
    niche: "Desain Grafis",
    bio: "Membantu UMKM membuat visual promosi yang rapi, hangat, dan mudah dipakai di media sosial.",
    skills: ["Feed Instagram", "Brand Visual", "Canva", "Layout Promosi"],
    focus: "usaha kuliner lokal",
    serviceCount: 2,
    responseTimeHours: 2,
  },
  {
    index: 25,
    displayName: "Muhammad Aflah",
    categorySlug: "video-editing",
    city: "Purwokerto",
    province: "Jawa Tengah",
    niche: "Video Editing",
    bio: "Editor video pendek yang biasa menangani Reels promosi, highlight usaha, dan konten edukasi singkat.",
    skills: ["Reels", "TikTok", "Color Grading", "Subtitle"],
    focus: "kedai kopi dan minuman",
    serviceCount: 1,
    responseTimeHours: 3,
  },
  {
    index: 26,
    displayName: "Indra Surya",
    categorySlug: "content-creator",
    city: "Banyumas",
    province: "Jawa Tengah",
    niche: "Content Creator",
    bio: "Membuat konten review dan konten harian dengan gaya natural untuk UMKM yang ingin tampil lebih dekat.",
    skills: ["Review Konten", "Reels", "Konsep Konten", "Voice Over"],
    focus: "usaha keluarga",
    serviceCount: 1,
    responseTimeHours: 4,
  },
  {
    index: 27,
    displayName: "Kedara Creative",
    categorySlug: "digital-marketing",
    city: "Banjarnegara",
    province: "Jawa Tengah",
    niche: "Digital Marketing",
    bio: "Tim kecil yang fokus membantu UMKM menyusun arah promosi bulanan dan membaca performa konten.",
    skills: ["Campaign Plan", "Instagram Ads", "Konten Kalender", "Audit Konten"],
    focus: "brand rumahan",
    serviceCount: 2,
    responseTimeHours: 5,
  },
  {
    index: 28,
    displayName: "Falkrie Studio",
    categorySlug: "copywriting",
    city: "Wonosobo",
    province: "Jawa Tengah",
    niche: "Copywriting",
    bio: "Menulis caption, script pendek, dan copy promosi yang terasa manusiawi untuk konten UMKM.",
    skills: ["Caption", "Script Reels", "Copy Promo", "Tone of Voice"],
    focus: "promosi harian",
    serviceCount: 1,
    responseTimeHours: 2,
  },
  {
    index: 29,
    displayName: "Rendra Copy",
    categorySlug: "web-development",
    city: "Cilacap",
    province: "Jawa Tengah",
    niche: "Web Development",
    bio: "Membangun landing page sederhana untuk UMKM yang ingin punya profil digital yang jelas dan mudah dibagikan.",
    skills: ["Landing Page", "Next.js", "UI Copy", "SEO Dasar"],
    focus: "profil layanan UMKM",
    serviceCount: 1,
    responseTimeHours: 6,
  },
  {
    index: 30,
    displayName: "Nara Visual",
    categorySlug: "desain-grafis",
    city: "Kebumen",
    province: "Jawa Tengah",
    niche: "Desain Grafis",
    bio: "Mengerjakan desain promosi yang bersih dan konsisten untuk feed, poster digital, dan highlight campaign.",
    skills: ["Poster Digital", "Feed Instagram", "Brand Kit", "Template Konten"],
    focus: "fashion lokal",
    serviceCount: 1,
    responseTimeHours: 3,
  },
  {
    index: 31,
    displayName: "Lala Review Produk",
    categorySlug: "video-editing",
    city: "Purbalingga",
    province: "Jawa Tengah",
    niche: "Video Editing",
    bio: "Membantu UMKM merapikan footage menjadi video promosi pendek yang enak ditonton dan mudah dipahami.",
    skills: ["Cutting Video", "Subtitle", "Hook Konten", "Audio Clean Up"],
    focus: "konten review layanan",
    serviceCount: 2,
    responseTimeHours: 4,
  },
  {
    index: 32,
    displayName: "Arga Motion",
    categorySlug: "content-creator",
    city: "Purwokerto",
    province: "Jawa Tengah",
    niche: "Content Creator",
    bio: "Membuat ide konten dan eksekusi konten pendek dengan gaya energik untuk campaign media sosial.",
    skills: ["Konsep Reels", "Talent Konten", "Storytelling", "Editing Ringan"],
    focus: "event usaha lokal",
    serviceCount: 1,
    responseTimeHours: 3,
  },
  {
    index: 33,
    displayName: "Vina Campaign",
    categorySlug: "digital-marketing",
    city: "Banyumas",
    province: "Jawa Tengah",
    niche: "Digital Marketing",
    bio: "Menyusun strategi konten praktis untuk UMKM yang ingin promosi lebih terarah tanpa bahasa yang rumit.",
    skills: ["Strategi Konten", "Audit Instagram", "Campaign Brief", "Reporting"],
    focus: "usaha kecantikan",
    serviceCount: 1,
    responseTimeHours: 5,
  },
  {
    index: 34,
    displayName: "Dito Ads",
    categorySlug: "copywriting",
    city: "Banjarnegara",
    province: "Jawa Tengah",
    niche: "Copywriting",
    bio: "Menulis copy singkat untuk iklan, caption, dan landing page agar pesan usaha terasa lebih tajam.",
    skills: ["Copy Iklan", "Caption", "Headline", "CTA"],
    focus: "penawaran layanan",
    serviceCount: 2,
    responseTimeHours: 2,
  },
  {
    index: 35,
    displayName: "Maira Studio",
    categorySlug: "web-development",
    city: "Wonosobo",
    province: "Jawa Tengah",
    niche: "Web Development",
    bio: "Membuat website kecil yang fokus pada tampilan rapi, informasi jelas, dan formulir kontak sederhana.",
    skills: ["Website Profil", "Responsive UI", "Form Kontak", "SEO Dasar"],
    focus: "profil brand kreatif",
    serviceCount: 1,
    responseTimeHours: 7,
  },
  {
    index: 36,
    displayName: "Bagas Landing",
    categorySlug: "desain-grafis",
    city: "Cilacap",
    province: "Jawa Tengah",
    niche: "Desain Grafis",
    bio: "Desainer visual yang senang membuat konten promosi terlihat lebih tertata dan konsisten antar platform.",
    skills: ["Template Feed", "Visual Campaign", "Canva", "Design System Mini"],
    focus: "kelas dan pelatihan",
    serviceCount: 1,
    responseTimeHours: 3,
  },
  {
    index: 37,
    displayName: "Citra Social",
    categorySlug: "video-editing",
    city: "Kebumen",
    province: "Jawa Tengah",
    niche: "Video Editing",
    bio: "Mengedit video promosi pendek dengan ritme ringan, subtitle jelas, dan visual yang cocok untuk UMKM.",
    skills: ["Reels Editing", "Subtitle", "Motion Text", "Konten Edukasi"],
    focus: "edukasi layanan",
    serviceCount: 1,
    responseTimeHours: 4,
  },
  {
    index: 38,
    displayName: "Hanif Visual",
    categorySlug: "content-creator",
    city: "Purbalingga",
    province: "Jawa Tengah",
    niche: "Content Creator",
    bio: "Membuat konten promosi dengan pembawaan santai untuk UMKM yang ingin tampil dekat dengan audiens.",
    skills: ["Talent Konten", "Review", "Story Script", "Reels"],
    focus: "jasa lokal",
    serviceCount: 2,
    responseTimeHours: 3,
  },
  {
    index: 39,
    displayName: "Nabila Konten",
    categorySlug: "digital-marketing",
    city: "Purwokerto",
    province: "Jawa Tengah",
    niche: "Digital Marketing",
    bio: "Membantu pemilik usaha membuat kalender konten, pesan promosi, dan evaluasi performa setiap bulan.",
    skills: ["Kalender Konten", "Analisis Konten", "Persona Audiens", "Campaign Plan"],
    focus: "kuliner sehat",
    serviceCount: 1,
    responseTimeHours: 5,
  },
  {
    index: 40,
    displayName: "Raka Web",
    categorySlug: "copywriting",
    city: "Banyumas",
    province: "Jawa Tengah",
    niche: "Copywriting",
    bio: "Menulis struktur pesan yang rapi untuk halaman promosi, caption campaign, dan materi profil usaha.",
    skills: ["Website Copy", "Caption", "Brand Voice", "Script"],
    focus: "halaman promosi",
    serviceCount: 1,
    responseTimeHours: 2,
  },
  {
    index: 41,
    displayName: "Sinta Copy Lab",
    categorySlug: "web-development",
    city: "Banjarnegara",
    province: "Jawa Tengah",
    niche: "Web Development",
    bio: "Menyusun halaman digital sederhana dengan tampilan bersih dan copy yang mudah dipahami calon pelanggan.",
    skills: ["Landing Page", "UI Layout", "Copy Section", "Responsive Design"],
    focus: "promosi event UMKM",
    serviceCount: 2,
    responseTimeHours: 6,
  },
  {
    index: 42,
    displayName: "Gilang Kreatif",
    categorySlug: "desain-grafis",
    city: "Wonosobo",
    province: "Jawa Tengah",
    niche: "Desain Grafis",
    bio: "Membuat materi visual untuk promosi musiman, campaign media sosial, dan identitas sederhana UMKM.",
    skills: ["Visual Promo", "Feed Instagram", "Poster Digital", "Brand Kit"],
    focus: "promo musiman",
    serviceCount: 1,
    responseTimeHours: 3,
  },
  {
    index: 43,
    displayName: "Omah Konten",
    categorySlug: "video-editing",
    city: "Cilacap",
    province: "Jawa Tengah",
    niche: "Video Editing",
    bio: "Studio kecil untuk merapikan video campaign UMKM agar lebih siap tayang di Reels dan TikTok.",
    skills: ["Editing Reels", "Story Cut", "Subtitle", "Motion Text"],
    focus: "campaign komunitas",
    serviceCount: 2,
    responseTimeHours: 4,
  },
  {
    index: 44,
    displayName: "Fajar Strategi",
    categorySlug: "content-creator",
    city: "Kebumen",
    province: "Jawa Tengah",
    niche: "Content Creator",
    bio: "Membantu UMKM menyiapkan ide konten, script, dan eksekusi konten pendek dengan alur yang jelas.",
    skills: ["Ide Konten", "Script", "Talent Konten", "Reels"],
    focus: "edukasi brand",
    serviceCount: 1,
    responseTimeHours: 3,
  },
  {
    index: 45,
    displayName: "Laras Motion",
    categorySlug: "digital-marketing",
    city: "Purbalingga",
    province: "Jawa Tengah",
    niche: "Digital Marketing",
    bio: "Menyusun campaign kecil yang realistis untuk UMKM, mulai dari tujuan konten sampai evaluasi akhir.",
    skills: ["Campaign UMKM", "Konten Plan", "CTA", "Analisis Ringkas"],
    focus: "campaign pembukaan usaha",
    serviceCount: 1,
    responseTimeHours: 5,
  },
  {
    index: 46,
    displayName: "Bima Design",
    categorySlug: "copywriting",
    city: "Purwokerto",
    province: "Jawa Tengah",
    niche: "Copywriting",
    bio: "Menulis caption dan script pendek dengan bahasa yang ringan, jelas, dan sesuai karakter usaha.",
    skills: ["Caption Harian", "Script Reels", "CTA", "Headline"],
    focus: "konten harian",
    serviceCount: 1,
    responseTimeHours: 2,
  },
  {
    index: 47,
    displayName: "Anindya Media",
    categorySlug: "web-development",
    city: "Banyumas",
    province: "Jawa Tengah",
    niche: "Web Development",
    bio: "Membantu UMKM membuat halaman profil digital yang cepat dibuka, rapi, dan mudah dibagikan.",
    skills: ["Website UMKM", "Landing Page", "Responsive UI", "SEO Dasar"],
    focus: "profil usaha jasa",
    serviceCount: 1,
    responseTimeHours: 7,
  },
  {
    index: 48,
    displayName: "Revan Landing",
    categorySlug: "desain-grafis",
    city: "Banjarnegara",
    province: "Jawa Tengah",
    niche: "Desain Grafis",
    bio: "Mengerjakan desain campaign yang sederhana, konsisten, dan siap dipakai untuk promosi media sosial.",
    skills: ["Design Campaign", "Feed Instagram", "Template", "Brand Color"],
    focus: "jasa edukasi",
    serviceCount: 1,
    responseTimeHours: 3,
  },
  {
    index: 49,
    displayName: "Putri Narasi",
    categorySlug: "video-editing",
    city: "Wonosobo",
    province: "Jawa Tengah",
    niche: "Video Editing",
    bio: "Mengubah bahan video sederhana menjadi konten pendek dengan narasi jelas dan subtitle yang nyaman dibaca.",
    skills: ["Video Narasi", "Subtitle", "Reels", "Audio Editing"],
    focus: "cerita usaha",
    serviceCount: 1,
    responseTimeHours: 4,
  },
  {
    index: 50,
    displayName: "Galih Campaign",
    categorySlug: "content-creator",
    city: "Cilacap",
    province: "Jawa Tengah",
    niche: "Content Creator",
    bio: "Membuat konten campaign dengan sudut pandang audiens lokal dan gaya komunikasi yang tidak kaku.",
    skills: ["Campaign Content", "Talent Konten", "Storytelling", "Review"],
    focus: "promosi layanan lokal",
    serviceCount: 2,
    responseTimeHours: 3,
  },
];

const serviceTemplates: Record<CategorySlug, ServiceTemplate[]> = {
  "desain-grafis": [
    {
      title: "Desain Feed Instagram untuk",
      shortDescription: "Paket visual feed yang rapi untuk campaign media sosial.",
      description: "Cocok untuk UMKM yang ingin punya tampilan promosi lebih konsisten tanpa proses yang rumit.",
      tags: ["feed instagram", "desain promosi", "visual campaign"],
      deliverables: ["Konsep visual", "Desain feed", "Format siap unggah"],
      requirements: ["Nama usaha", "Arah campaign", "Referensi visual", "Materi teks"],
      addOns: [
        { name: "Variasi desain", description: "Tambahan satu variasi visual untuk kebutuhan campaign.", price: 45000 },
        { name: "File editable", description: "File kerja yang bisa disesuaikan kembali oleh pemilik usaha.", price: 60000 },
      ],
    },
    {
      title: "Template Konten Mingguan untuk",
      shortDescription: "Template desain yang bisa dipakai berulang untuk konten rutin.",
      description: "Membantu UMKM menjaga ritme visual konten mingguan dengan gaya yang seragam.",
      tags: ["template konten", "canva", "konten mingguan"],
      deliverables: ["Template visual", "Panduan pemakaian", "File siap edit"],
      requirements: ["Brand color", "Logo jika ada", "Kategori konten", "Contoh referensi"],
      addOns: [
        { name: "Kalender konten", description: "Susunan tema konten sederhana untuk satu pekan.", price: 75000 },
        { name: "Revisi tambahan", description: "Satu putaran revisi tambahan di luar paket.", price: 35000 },
      ],
    },
  ],
  "video-editing": [
    {
      title: "Editing Reels Promosi untuk",
      shortDescription: "Video pendek yang ringkas, jelas, dan siap tayang.",
      description: "Mengolah bahan video menjadi Reels atau TikTok yang lebih nyaman ditonton dan mudah dipahami audiens.",
      tags: ["reels", "tiktok", "editing video"],
      deliverables: ["Video final", "Subtitle", "Cover frame"],
      requirements: ["Bahan video", "Tujuan campaign", "Durasi target", "Referensi gaya"],
      addOns: [
        { name: "Caption tambahan", description: "Caption pendek untuk mendampingi video final.", price: 40000 },
        { name: "Revisi tambahan", description: "Tambahan satu putaran revisi video.", price: 50000 },
      ],
    },
    {
      title: "Video Highlight Usaha untuk",
      shortDescription: "Potongan highlight singkat untuk memperkenalkan usaha.",
      description: "Menyusun video highlight dengan alur sederhana agar audiens cepat memahami nilai usaha.",
      tags: ["video highlight", "konten promosi", "subtitle"],
      deliverables: ["Video highlight", "Subtitle", "Versi 9:16"],
      requirements: ["Bahan video", "Poin utama", "Nada komunikasi", "Logo jika ada"],
      addOns: [
        { name: "Optimasi hook", description: "Pembuka video dibuat lebih tajam untuk menarik perhatian.", price: 55000 },
        { name: "Caption tambahan", description: "Caption ringkas untuk publikasi konten.", price: 40000 },
      ],
    },
  ],
  "content-creator": [
    {
      title: "Konten Review Natural untuk",
      shortDescription: "Konten review dengan gaya santai dan mudah dipercaya.",
      description: "Membantu UMKM menampilkan layanan lewat konten review yang terasa dekat dengan audiens lokal.",
      tags: ["review", "content creator", "reels"],
      deliverables: ["Konsep konten", "Video final", "Caption singkat"],
      requirements: ["Profil usaha", "Pesan utama", "Target audiens", "Referensi konten"],
      addOns: [
        { name: "Script tambahan", description: "Satu versi script alternatif untuk konten review.", price: 50000 },
        { name: "Caption tambahan", description: "Tambahan caption untuk variasi publikasi.", price: 35000 },
      ],
    },
    {
      title: "Konten Harian Instagram untuk",
      shortDescription: "Konten ringan untuk menjaga kehadiran brand di media sosial.",
      description: "Membuat konten pendek yang mudah dipakai untuk promosi harian atau campaign sederhana.",
      tags: ["konten harian", "instagram", "campaign"],
      deliverables: ["Ide konten", "Konten final", "Caption"],
      requirements: ["Nama usaha", "Tujuan konten", "Target audiens", "Gaya konten"],
      addOns: [
        { name: "Kalender konten", description: "Rencana konten sederhana untuk satu pekan.", price: 90000 },
        { name: "Revisi tambahan", description: "Tambahan satu kali revisi hasil konten.", price: 45000 },
      ],
    },
  ],
  "digital-marketing": [
    {
      title: "Strategi Campaign Digital untuk",
      shortDescription: "Rencana promosi praktis untuk campaign UMKM.",
      description: "Membantu pemilik usaha menentukan arah campaign, pesan utama, dan konten prioritas.",
      tags: ["campaign", "strategi konten", "digital marketing"],
      deliverables: ["Rencana campaign", "Persona audiens", "Rekomendasi CTA"],
      requirements: ["Tujuan campaign", "Target audiens", "Kanal promosi", "Kendala saat ini"],
      addOns: [
        { name: "Audit konten", description: "Review singkat konten yang sudah berjalan.", price: 125000 },
        { name: "Kalender konten", description: "Rencana tema konten untuk dua pekan.", price: 150000 },
      ],
    },
    {
      title: "Audit Instagram UMKM untuk",
      shortDescription: "Evaluasi singkat profil dan konten Instagram usaha.",
      description: "Memberi masukan praktis agar profil, konten, dan CTA terlihat lebih jelas untuk audiens.",
      tags: ["audit instagram", "cta", "konten plan"],
      deliverables: ["Audit profil", "Catatan perbaikan", "Prioritas konten"],
      requirements: ["Link Instagram", "Tujuan promosi", "Target audiens", "Contoh kompetitor"],
      addOns: [
        { name: "Optimasi copy", description: "Perbaikan bio, CTA, dan pesan utama.", price: 85000 },
        { name: "Kalender konten", description: "Rencana konten awal untuk satu pekan.", price: 100000 },
      ],
    },
  ],
  copywriting: [
    {
      title: "Caption Promosi untuk",
      shortDescription: "Caption singkat yang jelas, natural, dan sesuai karakter usaha.",
      description: "Menulis caption untuk konten promosi agar pesan campaign lebih mudah dipahami audiens.",
      tags: ["caption", "copywriting", "cta"],
      deliverables: ["Caption utama", "Alternatif hook", "CTA"],
      requirements: ["Tujuan campaign", "Karakter brand", "Target audiens", "Poin penawaran"],
      addOns: [
        { name: "Caption tambahan", description: "Tiga caption tambahan untuk variasi publikasi.", price: 45000 },
        { name: "Optimasi copy", description: "Perapihan kalimat promosi agar lebih tajam.", price: 65000 },
      ],
    },
    {
      title: "Script Reels Pendek untuk",
      shortDescription: "Script konten pendek dengan alur pembuka, isi, dan CTA.",
      description: "Membantu UMKM membuat script yang lebih terarah untuk video pendek promosi.",
      tags: ["script reels", "copy promosi", "storytelling"],
      deliverables: ["Script video", "Hook awal", "CTA akhir"],
      requirements: ["Tujuan video", "Durasi target", "Target audiens", "Gaya bicara"],
      addOns: [
        { name: "Variasi script", description: "Satu versi script alternatif dengan angle berbeda.", price: 60000 },
        { name: "Caption tambahan", description: "Caption pendamping untuk video.", price: 35000 },
      ],
    },
  ],
  "web-development": [
    {
      title: "Landing Page Profil untuk",
      shortDescription: "Halaman profil usaha yang rapi, responsif, dan mudah dibagikan.",
      description: "Membuat landing page sederhana untuk memperkenalkan usaha, layanan, dan kontak utama.",
      tags: ["landing page", "website umkm", "profil digital"],
      deliverables: ["Landing page", "Section profil", "Form kontak sederhana"],
      requirements: ["Nama usaha", "Deskripsi layanan", "Kontak", "Referensi tampilan"],
      addOns: [
        { name: "Optimasi copy", description: "Perapihan teks section agar lebih jelas.", price: 150000 },
        { name: "Section tambahan", description: "Tambahan satu section sesuai kebutuhan campaign.", price: 200000 },
      ],
    },
    {
      title: "Halaman Promo Digital untuk",
      shortDescription: "Halaman campaign kecil untuk membantu promosi online.",
      description: "Membangun halaman promosi yang fokus pada pesan utama, benefit, dan CTA.",
      tags: ["halaman promo", "web campaign", "cta"],
      deliverables: ["Halaman promo", "CTA utama", "Layout responsif"],
      requirements: ["Tujuan campaign", "Materi teks", "Kontak", "Referensi visual"],
      addOns: [
        { name: "Form minat", description: "Form sederhana untuk menerima kontak calon pelanggan.", price: 250000 },
        { name: "Optimasi copy", description: "Perapihan teks headline dan CTA.", price: 150000 },
      ],
    },
  ],
};

function loadEnvironment() {
  for (const fileName of [".env.local", ".env"]) {
    const filePath = join(process.cwd(), fileName);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex < 1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = stripQuotes(value);
      }
    }
  }
}

function stripQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function createAdminClient() {
  loadEnvironment();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib tersedia.");
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createHandle(displayName: string, index: number) {
  return `${createSlug(displayName).replace(/-/g, "")}${index}`;
}

function pickSeeds() {
  return creatorSeeds.filter((seed) => seed.index >= creatorStart && seed.index <= creatorEnd);
}

function categoryDistribution(seeds: CreatorSeed[]) {
  return seeds.reduce<Record<CategorySlug, number>>(
    (current, seed) => ({
      ...current,
      [seed.categorySlug]: current[seed.categorySlug] + 1,
    }),
    {
      "desain-grafis": 0,
      "video-editing": 0,
      "content-creator": 0,
      "digital-marketing": 0,
      copywriting: 0,
      "web-development": 0,
    },
  );
}

function createTierSeeds(categorySlug: CategorySlug, template: ServiceTemplate): TierSeed[] {
  const basePrices: Record<CategorySlug, [number, number, number]> = {
    "desain-grafis": [175000, 375000, 650000],
    "video-editing": [250000, 575000, 1050000],
    "content-creator": [300000, 725000, 1350000],
    "digital-marketing": [350000, 850000, 1500000],
    copywriting: [125000, 300000, 550000],
    "web-development": [850000, 1850000, 3500000],
  };
  const deliveryDays: Record<CategorySlug, [number, number, number]> = {
    "desain-grafis": [2, 4, 6],
    "video-editing": [3, 5, 7],
    "content-creator": [3, 6, 9],
    "digital-marketing": [4, 7, 10],
    copywriting: [2, 3, 5],
    "web-development": [7, 14, 21],
  };
  const [basicPrice, mediumPrice, premiumPrice] = basePrices[categorySlug];
  const [basicDays, mediumDays, premiumDays] = deliveryDays[categorySlug];

  return [
    {
      tierKey: "basic",
      name: "Basic",
      price: basicPrice,
      estimatedDays: basicDays,
      revisionCount: 1,
      description: "Paket awal untuk kebutuhan promosi yang sudah jelas arahnya.",
      deliverables: template.deliverables.slice(0, 2),
      sortOrder: 1,
    },
    {
      tierKey: "medium",
      name: "Medium",
      price: mediumPrice,
      estimatedDays: mediumDays,
      revisionCount: 2,
      description: "Paket lebih lengkap dengan ruang revisi dan detail output lebih matang.",
      deliverables: template.deliverables,
      sortOrder: 2,
    },
    {
      tierKey: "premium",
      name: "Premium",
      price: premiumPrice,
      estimatedDays: premiumDays,
      revisionCount: 3,
      description: "Paket penuh untuk campaign yang butuh arahan, variasi, dan hasil lebih siap pakai.",
      deliverables: [...template.deliverables, "Ringkasan rekomendasi lanjutan"],
      sortOrder: 3,
    },
  ];
}

function createServiceSeeds(seed: CreatorSeed) {
  const templates = serviceTemplates[seed.categorySlug];
  return Array.from({ length: seed.serviceCount }, (_, serviceIndex) => {
    const template = templates[(seed.index + serviceIndex) % templates.length];
    const title = `${template.title} ${seed.focus}`;
    return {
      ...template,
      title,
      slug: createSlug(title),
      tiers: createTierSeeds(seed.categorySlug, template),
    };
  });
}

async function listExistingTargetUsers(supabase: SupabaseAdmin, emails: Set<string>) {
  const existingUsers = new Map<string, User>();
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      throw new Error(`Gagal membaca Supabase Auth: ${error.message}`);
    }

    for (const user of data.users) {
      const email = user.email?.toLowerCase();
      if (email && emails.has(email)) {
        existingUsers.set(email, user);
      }
    }

    if (data.users.length < 1000) break;
    page += 1;
  }

  return existingUsers;
}

async function ensureAuthUser(
  supabase: SupabaseAdmin,
  existingUsers: Map<string, User>,
  seed: CreatorSeed,
) {
  const email = `creator${seed.index}@ruang.usaha`;
  const existingUser = existingUsers.get(email);
  const metadata = {
    full_name: seed.displayName,
    role: "creator",
  };

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password: email,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (error) {
      throw new Error(`Gagal memperbarui akun ${email}: ${error.message}`);
    }

    return {
      user: data.user ?? existingUser,
      created: false,
    };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: email,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (error || !data.user) {
    throw new Error(`Gagal membuat akun ${email}: ${error?.message ?? "user tidak tersedia"}`);
  }

  return {
    user: data.user,
    created: true,
  };
}

async function ensureCategories(supabase: SupabaseAdmin) {
  const { data, error } = await supabase
    .from("service_categories")
    .upsert(
      categorySeeds.map((category) => ({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon_name: category.iconName,
        is_active: true,
        sort_order: category.sortOrder,
      })),
      { onConflict: "slug" },
    )
    .select("id, slug");

  if (error || !data) {
    throw new Error(`Gagal menyiapkan kategori layanan: ${error?.message ?? "data kosong"}`);
  }

  return new Map(data.map((category) => [category.slug as CategorySlug, category.id]));
}

async function ensureProfile(supabase: SupabaseAdmin, user: User, seed: CreatorSeed) {
  const email = `creator${seed.index}@ruang.usaha`;
  const now = new Date().toISOString();

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      role: "creator",
      full_name: seed.displayName,
      email,
      account_status: "active",
      onboarding_completed: true,
      onboarding_skipped_at: null,
      updated_at: now,
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`Gagal menyimpan profile ${email}: ${error.message}`);
  }
}

async function ensureCreatorProfile(
  supabase: SupabaseAdmin,
  user: User,
  seed: CreatorSeed,
) {
  const handle = createHandle(seed.displayName, seed.index);
  const startingPrice = createTierSeeds(seed.categorySlug, serviceTemplates[seed.categorySlug][0])[0].price;
  const completedOrdersCount = 6 + ((seed.index - creatorStart) % 9) * 2;
  const averageRating = Number((4.55 + ((seed.index - creatorStart) % 5) * 0.08).toFixed(2));

  const { data, error } = await supabase
    .from("creator_profiles")
    .upsert(
      {
        user_id: user.id,
        display_name: seed.displayName,
        bio: seed.bio,
        location: `${seed.city}, ${seed.province}`,
        city: seed.city,
        province: seed.province,
        niche: seed.niche,
        skills: seed.skills,
        instagram_url: `https://instagram.com/${handle}`,
        tiktok_url: `https://tiktok.com/@${handle}`,
        youtube_url: `https://youtube.com/@${handle}`,
        portfolio_url: `https://ruang.usaha/portfolio/${handle}`,
        avatar_url: null,
        banner_url: null,
        availability_status: "available",
        starting_price: startingPrice,
        average_rating: averageRating,
        completed_orders_count: completedOrdersCount,
        response_time_hours: seed.responseTimeHours,
        is_verified: true,
        is_featured: (seed.index - creatorStart) % 5 === 0,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Gagal menyimpan creator profile ${seed.displayName}: ${error?.message ?? "data kosong"}`);
  }

  return data;
}

async function ensureServicePackage(
  supabase: SupabaseAdmin,
  creatorProfile: CreatorProfileRow,
  categoryId: string,
  seed: CreatorSeed,
  serviceSeed: ReturnType<typeof createServiceSeeds>[number],
) {
  const now = new Date().toISOString();
  const basicTier = serviceSeed.tiers[0];
  const servicePayload = {
    creator_id: creatorProfile.id,
    category_id: categoryId,
    title: serviceSeed.title,
    slug: serviceSeed.slug,
    short_description: serviceSeed.shortDescription,
    description: serviceSeed.description,
    cover_image_url: null,
    brief_requirements: [
      "Nama usaha",
      "Tujuan campaign",
      "Target audiens",
      "Platform konten",
      "Referensi konten",
      "Catatan tambahan",
    ] satisfies Json,
    published_at: now,
    base_price: basicTier.price,
    estimated_days: basicTier.estimatedDays,
    revision_count: basicTier.revisionCount,
    deliverables: basicTier.deliverables,
    requirements: serviceSeed.requirements,
    tags: [...serviceSeed.tags, seed.city.toLowerCase()],
    is_active: true,
    is_featured: seed.serviceCount === 2,
    deleted_at: null,
    updated_at: now,
  };

  const { data: existing, error: readError } = await supabase
    .from("service_packages")
    .select("*")
    .eq("creator_id", creatorProfile.id)
    .eq("slug", serviceSeed.slug)
    .maybeSingle();

  if (readError) {
    throw new Error(`Gagal membaca layanan ${serviceSeed.title}: ${readError.message}`);
  }

  if (existing) {
    const { data, error } = await supabase
      .from("service_packages")
      .update(servicePayload)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(`Gagal memperbarui layanan ${serviceSeed.title}: ${error?.message ?? "data kosong"}`);
    }

    return {
      service: data,
      created: false,
    };
  }

  const { data, error } = await supabase
    .from("service_packages")
    .insert(servicePayload)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Gagal membuat layanan ${serviceSeed.title}: ${error?.message ?? "data kosong"}`);
  }

  return {
    service: data,
    created: true,
  };
}

async function ensureTiers(
  supabase: SupabaseAdmin,
  service: ServicePackageRow,
  tiers: TierSeed[],
) {
  const { data: existingTiers, error: readError } = await supabase
    .from("service_package_tiers")
    .select("id, tier_key")
    .eq("service_package_id", service.id);

  if (readError) {
    throw new Error(`Gagal membaca tier ${service.title}: ${readError.message}`);
  }

  const existingByKey = new Map((existingTiers ?? []).map((tier) => [tier.tier_key, tier.id]));
  let created = 0;
  let updated = 0;

  for (const tier of tiers) {
    const payload = {
      service_package_id: service.id,
      tier_key: tier.tierKey,
      name: tier.name,
      description: tier.description,
      price: tier.price,
      estimated_days: tier.estimatedDays,
      revision_count: tier.revisionCount,
      deliverables: tier.deliverables,
      sort_order: tier.sortOrder,
      is_active: true,
    };
    const existingId = existingByKey.get(tier.tierKey);

    if (existingId) {
      const { error } = await supabase
        .from("service_package_tiers")
        .update(payload)
        .eq("id", existingId);

      if (error) {
        throw new Error(`Gagal memperbarui tier ${tier.name}: ${error.message}`);
      }

      updated += 1;
    } else {
      const { error } = await supabase.from("service_package_tiers").insert(payload);

      if (error) {
        throw new Error(`Gagal membuat tier ${tier.name}: ${error.message}`);
      }

      created += 1;
    }
  }

  return { created, updated };
}

async function ensureAddOns(
  supabase: SupabaseAdmin,
  service: ServicePackageRow,
  addOns: ServiceTemplate["addOns"],
) {
  const { data: existingAddOns, error: readError } = await supabase
    .from("service_addons")
    .select("id, name")
    .eq("service_package_id", service.id);

  if (readError) {
    throw new Error(`Gagal membaca add-on ${service.title}: ${readError.message}`);
  }

  const existingByName = new Map((existingAddOns ?? []).map((addon) => [addon.name, addon.id]));
  let created = 0;
  let updated = 0;

  for (const addon of addOns) {
    const payload = {
      service_package_id: service.id,
      name: addon.name,
      description: addon.description,
      price: addon.price,
      is_active: true,
    };
    const existingId = existingByName.get(addon.name);

    if (existingId) {
      const { error } = await supabase.from("service_addons").update(payload).eq("id", existingId);

      if (error) {
        throw new Error(`Gagal memperbarui add-on ${addon.name}: ${error.message}`);
      }

      updated += 1;
    } else {
      const { error } = await supabase.from("service_addons").insert(payload);

      if (error) {
        throw new Error(`Gagal membuat add-on ${addon.name}: ${error.message}`);
      }

      created += 1;
    }
  }

  return { created, updated };
}

async function ensurePortfolio(
  supabase: SupabaseAdmin,
  creatorProfile: CreatorProfileRow,
  categoryId: string,
  seed: CreatorSeed,
) {
  const title = `Campaign ${seed.focus} bersama ${seed.displayName}`;
  const description = `Contoh konsep pekerjaan untuk ${seed.focus} dengan pendekatan ${seed.niche.toLowerCase()}.`;
  const { data: existing, error: readError } = await supabase
    .from("portfolios")
    .select("id")
    .eq("creator_id", creatorProfile.id)
    .eq("title", title)
    .maybeSingle();

  if (readError) {
    throw new Error(`Gagal membaca portofolio ${seed.displayName}: ${readError.message}`);
  }

  const payload = {
    creator_id: creatorProfile.id,
    title,
    description,
    category_id: categoryId,
    thumbnail_url: null,
    thumbnail_storage_path: null,
    media_url: null,
    external_url: `https://ruang.usaha/portfolio/${createHandle(seed.displayName, seed.index)}`,
    client_type: "UMKM lokal",
    is_featured: seed.serviceCount === 2,
    sort_order: 10,
    deleted_at: null,
  };

  if (existing) {
    const { error } = await supabase.from("portfolios").update(payload).eq("id", existing.id);

    if (error) {
      throw new Error(`Gagal memperbarui portofolio ${seed.displayName}: ${error.message}`);
    }

    return { created: false };
  }

  const { error } = await supabase.from("portfolios").insert(payload);

  if (error) {
    throw new Error(`Gagal membuat portofolio ${seed.displayName}: ${error.message}`);
  }

  return { created: true };
}

async function run() {
  const seeds = pickSeeds();
  if (seeds.length === 0) {
    throw new Error("Rentang creator seed tidak menghasilkan data.");
  }

  const supabase = createAdminClient();
  const categoryIds = await ensureCategories(supabase);
  const targetEmails = new Set(seeds.map((seed) => `creator${seed.index}@ruang.usaha`));
  const existingUsers = await listExistingTargetUsers(supabase, targetEmails);
  const stats = {
    authCreated: 0,
    authUpdated: 0,
    servicesCreated: 0,
    servicesUpdated: 0,
    tiersCreated: 0,
    tiersUpdated: 0,
    addonsCreated: 0,
    addonsUpdated: 0,
    portfoliosCreated: 0,
    portfoliosUpdated: 0,
  };

  for (const seed of seeds) {
    const authResult = await ensureAuthUser(supabase, existingUsers, seed);
    if (authResult.created) {
      stats.authCreated += 1;
    } else {
      stats.authUpdated += 1;
    }

    await ensureProfile(supabase, authResult.user, seed);
    const creatorProfile = await ensureCreatorProfile(supabase, authResult.user, seed);
    const categoryId = categoryIds.get(seed.categorySlug);

    if (!categoryId) {
      throw new Error(`Kategori ${seed.categorySlug} tidak tersedia.`);
    }

    for (const serviceSeed of createServiceSeeds(seed)) {
      const serviceResult = await ensureServicePackage(supabase, creatorProfile, categoryId, seed, serviceSeed);
      if (serviceResult.created) {
        stats.servicesCreated += 1;
      } else {
        stats.servicesUpdated += 1;
      }

      const tierStats = await ensureTiers(supabase, serviceResult.service, serviceSeed.tiers);
      stats.tiersCreated += tierStats.created;
      stats.tiersUpdated += tierStats.updated;

      const addonStats = await ensureAddOns(supabase, serviceResult.service, serviceSeed.addOns);
      stats.addonsCreated += addonStats.created;
      stats.addonsUpdated += addonStats.updated;
    }

    const portfolioResult = await ensurePortfolio(supabase, creatorProfile, categoryId, seed);
    if (portfolioResult.created) {
      stats.portfoliosCreated += 1;
    } else {
      stats.portfoliosUpdated += 1;
    }
  }

  const distribution = categoryDistribution(seeds);

  console.log("Seed creator real selesai.");
  console.log(`Akun dibuat: ${stats.authCreated}`);
  console.log(`Akun diperbarui: ${stats.authUpdated}`);
  console.log(`Layanan dibuat: ${stats.servicesCreated}`);
  console.log(`Layanan diperbarui: ${stats.servicesUpdated}`);
  console.log(`Tier dibuat: ${stats.tiersCreated}`);
  console.log(`Tier diperbarui: ${stats.tiersUpdated}`);
  console.log(`Add-on dibuat: ${stats.addonsCreated}`);
  console.log(`Add-on diperbarui: ${stats.addonsUpdated}`);
  console.log(`Portofolio dibuat: ${stats.portfoliosCreated}`);
  console.log(`Portofolio diperbarui: ${stats.portfoliosUpdated}`);
  console.log("Distribusi kategori:");
  for (const category of categorySeeds) {
    console.log(`${category.name}: ${distribution[category.slug]}`);
  }
  console.log("Contoh login: creator24@ruang.usaha / creator24@ruang.usaha");
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed gagal tanpa pesan error.";
  console.error(message);
  process.exitCode = 1;
});
