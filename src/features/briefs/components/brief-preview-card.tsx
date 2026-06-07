import { FileText, LinkIcon } from "lucide-react";

import type { DummyCampaignBrief } from "@/lib/dummy";
import { formatDate } from "@/lib/formatters/date";

type BriefPreviewCardProps = {
  brief: DummyCampaignBrief | null;
  title?: string;
};

export function BriefPreviewCard({
  brief,
  title = "Brief campaign",
}: BriefPreviewCardProps) {
  return (
    <section
      aria-labelledby="brief-preview-title"
      className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <FileText className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">Arahan UMKM</p>
          <h2
            id="brief-preview-title"
            className="mt-1 text-xl font-semibold tracking-tight text-foreground"
          >
            {title}
          </h2>
        </div>
      </div>

      {brief ? (
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Fokus promosi
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {brief.promotedFocus}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <BriefField label="Nama usaha" value={brief.businessName} />
            <BriefField label="Kategori usaha" value={brief.businessCategory} />
            <BriefField label="Deadline" value={formatDate(brief.deadline)} />
            <BriefField
              label="Platform konten"
              value={brief.contentPlatforms.join(", ")}
            />
          </div>
          <BriefField label="Tujuan campaign" value={brief.campaignGoal} />
          <BriefField label="Target audiens" value={brief.targetAudience.join(", ")} />
          <BriefField label="Gaya konten" value={brief.contentStyle.join(", ")} />
          <BriefField label="Catatan tambahan" value={brief.additionalNotes} />
          {brief.referenceLinks.length > 0 ? (
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <LinkIcon className="size-4 text-primary" aria-hidden="true" />
                Referensi konten
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {brief.referenceLinks.map((reference) => (
                  <li key={reference}>{reference}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-dashed border-border p-4 text-sm leading-6 text-muted-foreground">
          Brief campaign belum tersedia pada dummy data.
        </p>
      )}
    </section>
  );
}

type BriefFieldProps = {
  label: string;
  value: string;
};

function BriefField({ label, value }: BriefFieldProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}
