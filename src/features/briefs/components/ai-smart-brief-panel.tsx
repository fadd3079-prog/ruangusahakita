"use client";

import { useCallback, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ClipboardPaste,
  FileText,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SmartBriefState =
  | "idle"
  | "generating"
  | "draft_ready"
  | "inserted"
  | "validation_warning";

type ConfirmOverwrite = {
  visible: boolean;
  draft: string;
};

const PLATFORM_OPTIONS = [
  "Instagram",
  "TikTok",
  "YouTube Shorts",
  "Website",
  "Marketplace",
  "Lainnya",
] as const;

const STYLE_OPTIONS = [
  "Casual",
  "Profesional",
  "Elegan",
  "Ceria",
  "Informatif",
  "Persuasif",
] as const;

const BENEFITS = [
  { icon: FileText, label: "Brief lebih jelas" },
  { icon: Sparkles, label: "Arahan lebih terstruktur" },
  { icon: RefreshCw, label: "Mengurangi revisi" },
  { icon: ClipboardPaste, label: "Memudahkan kreator memahami kebutuhan" },
] as const;

function buildDraft(fields: {
  campaignGoal: string;
  product: string;
  targetAudience: string;
  platforms: string[];
  style: string[];
  keyMessage: string;
  reference: string;
}): string {
  const sections: string[] = [];

  if (fields.campaignGoal.trim()) {
    sections.push(`Tujuan Campaign:\n${fields.campaignGoal.trim()}`);
  }

  if (fields.product.trim()) {
    sections.push(
      `Produk/Jasa yang Dipromosikan:\n${fields.product.trim()}`
    );
  }

  if (fields.targetAudience.trim()) {
    sections.push(`Target Audiens:\n${fields.targetAudience.trim()}`);
  }

  if (fields.platforms.length > 0) {
    sections.push(`Platform Konten:\n${fields.platforms.join(", ")}`);
  }

  if (fields.style.length > 0) {
    sections.push(`Gaya Komunikasi:\n${fields.style.join(", ")}`);
  }

  if (fields.keyMessage.trim()) {
    sections.push(`Pesan Utama:\n${fields.keyMessage.trim()}`);
  }

  const contentDirection: string[] = [];
  if (fields.platforms.length > 0) {
    contentDirection.push(
      `Konten dibuat untuk ${fields.platforms.join(", ")}.`
    );
  }
  if (fields.style.length > 0) {
    contentDirection.push(`Gunakan gaya ${fields.style.join(", ").toLowerCase()}.`);
  }
  if (contentDirection.length > 0) {
    sections.push(`Arahan Konten:\n${contentDirection.join(" ")}`);
  }

  if (fields.reference.trim()) {
    sections.push(
      `Referensi atau Catatan Tambahan:\n${fields.reference.trim()}`
    );
  }

  return sections.join("\n\n");
}

function setNativeInputValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const nativeInputValueSetter =
    Object.getOwnPropertyDescriptor(
      el.tagName === "TEXTAREA"
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype,
      "value"
    )?.set;

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    el.value = value;
  }
}

function insertDraftIntoForm(draft: string, fields: {
  campaignGoal: string;
  product: string;
  targetAudience: string;
  platforms: string[];
  style: string[];
  reference: string;
}) {
  const formFieldMap: Record<string, string> = {
    campaignGoal: fields.campaignGoal.trim(),
    promotedFocus: fields.product.trim(),
    targetAudience: fields.targetAudience.trim(),
    contentPlatforms: fields.platforms.join(", "),
    contentStyle: fields.style.join(", "),
    additionalNotes: draft,
    referenceLinks: fields.reference.trim(),
  };

  for (const [id, value] of Object.entries(formFieldMap)) {
    if (!value) continue;
    const el = document.getElementById(id) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (el) {
      setNativeInputValue(el, value);
    }
  }
}

export function AiSmartBriefPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<SmartBriefState>("idle");
  const [draft, setDraft] = useState("");
  const [confirmOverwrite, setConfirmOverwrite] = useState<ConfirmOverwrite>({
    visible: false,
    draft: "",
  });

  const goalRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<HTMLInputElement>(null);
  const audienceRef = useRef<HTMLInputElement>(null);
  const keyMessageRef = useRef<HTMLTextAreaElement>(null);
  const referenceRef = useRef<HTMLTextAreaElement>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const togglePlatform = useCallback((platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  }, []);

  const toggleStyle = useCallback((style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  }, []);

  const getFieldValues = useCallback(() => {
    return {
      campaignGoal: goalRef.current?.value ?? "",
      product: productRef.current?.value ?? "",
      targetAudience: audienceRef.current?.value ?? "",
      platforms: selectedPlatforms,
      style: selectedStyles,
      keyMessage: keyMessageRef.current?.value ?? "",
      reference: referenceRef.current?.value ?? "",
    };
  }, [selectedPlatforms, selectedStyles]);

  const handleGenerate = useCallback(() => {
    const fields = getFieldValues();

    if (!fields.campaignGoal.trim() && !fields.product.trim()) {
      setState("validation_warning");
      return;
    }

    setState("generating");

    setTimeout(() => {
      const result = buildDraft(fields);
      setDraft(result);
      setState("draft_ready");
    }, 400);
  }, [getFieldValues]);

  const handleInsert = useCallback(() => {
    const fields = getFieldValues();
    const campaignGoalEl = document.getElementById("campaignGoal") as
      | HTMLTextAreaElement
      | null;
    const existingValue = campaignGoalEl?.value?.trim() ?? "";

    if (existingValue.length > 0) {
      setConfirmOverwrite({ visible: true, draft });
      return;
    }

    insertDraftIntoForm(draft, fields);
    setState("inserted");
  }, [draft, getFieldValues]);

  const handleConfirmOverwrite = useCallback(() => {
    const fields = getFieldValues();
    insertDraftIntoForm(confirmOverwrite.draft, fields);
    setConfirmOverwrite({ visible: false, draft: "" });
    setState("inserted");
  }, [confirmOverwrite.draft, getFieldValues]);

  const handleReset = useCallback(() => {
    setDraft("");
    setState("idle");
    setSelectedPlatforms([]);
    setSelectedStyles([]);
    setConfirmOverwrite({ visible: false, draft: "" });
    if (goalRef.current) goalRef.current.value = "";
    if (productRef.current) productRef.current.value = "";
    if (audienceRef.current) audienceRef.current.value = "";
    if (keyMessageRef.current) keyMessageRef.current.value = "";
    if (referenceRef.current) referenceRef.current.value = "";
  }, []);

  return (
    <section className="rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#0C2949,#167163)] text-white">
          <Sparkles className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              AI Smart Brief
            </span>
            <span className="rounded-md bg-[#167163]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#167163]">
              Beta
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            Bantu susun brief campaign yang lebih jelas untuk kreator.
          </p>
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div className="border-t border-border/70 px-5 pb-5 pt-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Isi kebutuhan promosi secara ringkas, lalu sistem akan membantu
            menyusun draft brief yang lebih terstruktur.
          </p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {BENEFITS.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <item.icon className="size-3.5 text-[#167163]" aria-hidden="true" />
                {item.label}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <SmartField label="Tujuan campaign" htmlFor="sb-goal">
              <Input
                ref={goalRef}
                id="sb-goal"
                placeholder="Meningkatkan awareness, promosi produk baru, meningkatkan penjualan, atau lainnya"
                className="h-10 bg-background"
              />
            </SmartField>

            <SmartField label="Produk/jasa yang dipromosikan" htmlFor="sb-product">
              <Input
                ref={productRef}
                id="sb-product"
                placeholder="Contoh: kopi susu botol, paket hampers, menu baru"
                className="h-10 bg-background"
              />
            </SmartField>

            <SmartField label="Target audiens" htmlFor="sb-audience">
              <Input
                ref={audienceRef}
                id="sb-audience"
                placeholder="Contoh: mahasiswa, pekerja kantoran, ibu rumah tangga"
                className="h-10 bg-background"
              />
            </SmartField>

            <SmartField label="Platform konten">
              <div className="flex flex-wrap gap-1.5">
                {PLATFORM_OPTIONS.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedPlatforms.includes(platform)
                        ? "border-[#167163]/40 bg-[#167163]/10 text-[#167163]"
                        : "border-border bg-background text-muted-foreground hover:border-border/80 hover:bg-muted/50"
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </SmartField>

            <SmartField label="Gaya komunikasi">
              <div className="flex flex-wrap gap-1.5">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedStyles.includes(style)
                        ? "border-[#167163]/40 bg-[#167163]/10 text-[#167163]"
                        : "border-border bg-background text-muted-foreground hover:border-border/80 hover:bg-muted/50"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </SmartField>

            <SmartField label="Poin utama pesan" htmlFor="sb-message">
              <Textarea
                ref={keyMessageRef}
                id="sb-message"
                placeholder="Contoh: harga terjangkau, bahan premium, promo pembukaan"
                rows={2}
                className="min-h-0 bg-background"
              />
            </SmartField>

            <SmartField label="Referensi/catatan tambahan" htmlFor="sb-reference">
              <Textarea
                ref={referenceRef}
                id="sb-reference"
                placeholder="Link referensi, tone visual, warna brand, atau hal yang harus dihindari"
                rows={2}
                className="min-h-0 bg-background"
              />
            </SmartField>
          </div>

          {state === "validation_warning" ? (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Isi minimal tujuan campaign dan produk yang dipromosikan.
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={state === "generating"}
              className="h-9 gap-1.5 rounded-xl bg-[linear-gradient(135deg,#0C2949,#167163)] px-4 text-white hover:opacity-90"
            >
              {state === "generating" ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" aria-hidden="true" />
                  Menyusun...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Susun Draft Brief
                </>
              )}
            </Button>

            {state === "draft_ready" || state === "inserted" ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="h-9 rounded-xl bg-background"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                Reset Draft
              </Button>
            ) : null}
          </div>

          {(state === "draft_ready" || state === "inserted") && draft ? (
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Preview Draft Brief
                </p>
                {state === "inserted" ? (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Sudah dimasukkan
                  </span>
                ) : null}
              </div>
              <div className="rounded-xl border border-border/70 bg-background p-4">
                <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                  {draft}
                </pre>
              </div>

              {state === "draft_ready" ? (
                <Button
                  type="button"
                  onClick={handleInsert}
                  className="h-9 gap-1.5 rounded-xl px-4"
                >
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                  Masukkan ke Brief
                </Button>
              ) : null}
            </div>
          ) : null}

          {confirmOverwrite.visible ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">
                Brief utama sudah berisi teks. Timpa dengan draft baru?
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmOverwrite}
                  className="h-8 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                >
                  Timpa
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setConfirmOverwrite({ visible: false, draft: "" })
                  }
                  className="h-8 rounded-lg bg-white"
                >
                  Batal
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function SmartField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
