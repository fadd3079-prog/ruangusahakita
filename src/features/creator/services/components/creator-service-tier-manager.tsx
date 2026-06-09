import { Plus, Power, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createCreatorServiceTierAction,
  toggleCreatorServiceTierStatusAction,
  updateCreatorServiceTierAction,
} from "@/features/creator/services/actions/creator-service-actions";
import type { CreatorServiceTier } from "@/features/creator/services/data/creator-service-queries";
import { formatCurrency } from "@/lib/formatters/currency";

type CreatorServiceTierManagerProps = {
  serviceId: string;
  tiers: readonly CreatorServiceTier[];
};

export function CreatorServiceTierManager({
  serviceId,
  tiers,
}: CreatorServiceTierManagerProps) {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="text-lg">Tier paket jasa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          action={createCreatorServiceTierAction}
          className="space-y-3 rounded-2xl border border-primary/15 bg-primary/5 p-4"
        >
          <input type="hidden" name="serviceId" value={serviceId} />
          <input type="hidden" name="tierIsActive" value="true" />
          <TierFields
            idPrefix="new-tier"
            defaultName=""
            defaultDescription=""
            defaultPrice=""
            defaultEstimatedDays="3"
            defaultRevisionCount="1"
            defaultDeliverables=""
            defaultSortOrder={String(tiers.length + 1)}
          />
          <Button type="submit" className="h-10 w-full rounded-full">
            <Plus className="size-4" />
            Tambah Tier
          </Button>
        </form>

        {tiers.length > 0 ? (
          <div className="space-y-3">
            {tiers.map((tier) => (
              <form
                key={tier.id}
                action={updateCreatorServiceTierAction}
                className="space-y-3 rounded-2xl border border-border/70 bg-background p-4"
              >
                <input type="hidden" name="serviceId" value={serviceId} />
                <input type="hidden" name="tierId" value={tier.id} />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">
                      {tier.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCurrency(Number(tier.price))}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      tier.is_active
                        ? "rounded-full border-primary/20 bg-primary/10 text-primary"
                        : "rounded-full"
                    }
                  >
                    {tier.is_active ? "Aktif" : "Tidak aktif"}
                  </Badge>
                </div>

                <TierFields
                  idPrefix={`tier-${tier.id}`}
                  defaultName={tier.name}
                  defaultDescription={tier.description ?? ""}
                  defaultPrice={String(Number(tier.price))}
                  defaultEstimatedDays={String(tier.estimated_days)}
                  defaultRevisionCount={String(tier.revision_count)}
                  defaultDeliverables={tier.deliverables?.join("\n") ?? ""}
                  defaultSortOrder={String(tier.sort_order)}
                  defaultIsActive={tier.is_active ? "true" : "false"}
                  showStatus
                />

                <div className="grid gap-2 sm:grid-cols-2">
                  <Button type="submit" className="h-10 rounded-full">
                    <Save className="size-4" />
                    Simpan
                  </Button>
                  <Button
                    type="submit"
                    variant="outline"
                    formAction={toggleCreatorServiceTierStatusAction}
                    className="h-10 rounded-full bg-background"
                  >
                    <Power className="size-4" />
                    {tier.is_active ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                </div>
              </form>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/25 p-4 text-sm leading-6 text-muted-foreground">
            Belum ada tier untuk paket jasa ini.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type TierFieldsProps = {
  defaultDeliverables: string;
  defaultDescription: string;
  defaultEstimatedDays: string;
  defaultIsActive?: "false" | "true";
  defaultName: string;
  defaultPrice: string;
  defaultRevisionCount: string;
  defaultSortOrder: string;
  idPrefix: string;
  showStatus?: boolean;
};

function TierFields({
  defaultDeliverables,
  defaultDescription,
  defaultEstimatedDays,
  defaultIsActive = "true",
  defaultName,
  defaultPrice,
  defaultRevisionCount,
  defaultSortOrder,
  idPrefix,
  showStatus = false,
}: TierFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-name`}>Nama tier</Label>
        <Input
          id={`${idPrefix}-name`}
          name="tierName"
          defaultValue={defaultName}
          placeholder="Contoh: Standard"
          className="h-10 bg-background"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-description`}>Deskripsi</Label>
        <Textarea
          id={`${idPrefix}-description`}
          name="tierDescription"
          defaultValue={defaultDescription}
          placeholder="Jelaskan cakupan tier secara singkat."
          className="min-h-20 bg-background"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-price`}>Harga</Label>
          <Input
            id={`${idPrefix}-price`}
            name="tierPrice"
            type="number"
            min="1"
            defaultValue={defaultPrice}
            placeholder="250000"
            className="h-10 bg-background"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-sort`}>Urutan</Label>
          <Input
            id={`${idPrefix}-sort`}
            name="tierSortOrder"
            type="number"
            min="0"
            defaultValue={defaultSortOrder}
            className="h-10 bg-background"
            required
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-days`}>Estimasi hari</Label>
          <Input
            id={`${idPrefix}-days`}
            name="tierEstimatedDays"
            type="number"
            min="1"
            defaultValue={defaultEstimatedDays}
            className="h-10 bg-background"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-revision`}>Jumlah revisi</Label>
          <Input
            id={`${idPrefix}-revision`}
            name="tierRevisionCount"
            type="number"
            min="0"
            defaultValue={defaultRevisionCount}
            className="h-10 bg-background"
            required
          />
        </div>
      </div>
      {showStatus ? (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <select
            id={`${idPrefix}-status`}
            name="tierIsActive"
            defaultValue={defaultIsActive}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="true">Aktif</option>
            <option value="false">Tidak aktif</option>
          </select>
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-deliverables`}>Output tier</Label>
        <Textarea
          id={`${idPrefix}-deliverables`}
          name="tierDeliverables"
          defaultValue={defaultDeliverables}
          placeholder="Pisahkan setiap output dengan baris baru."
          className="min-h-20 bg-background"
        />
      </div>
    </div>
  );
}
