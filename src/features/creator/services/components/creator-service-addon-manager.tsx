import { Plus, Save, Trash2 } from "lucide-react";

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
  createCreatorServiceAddonAction,
  deleteCreatorServiceAddonAction,
  updateCreatorServiceAddonAction,
} from "@/features/creator/services/actions/creator-service-actions";
import type { CreatorServiceAddon } from "@/features/creator/services/data/creator-service-queries";
import { formatCurrency } from "@/lib/formatters/currency";

type CreatorServiceAddonManagerProps = {
  addons: readonly CreatorServiceAddon[];
  serviceId: string;
};

export function CreatorServiceAddonManager({
  addons,
  serviceId,
}: CreatorServiceAddonManagerProps) {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="text-lg">Add-on layanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <form action={createCreatorServiceAddonAction} className="space-y-3 rounded-2xl border border-primary/15 bg-primary/5 p-4">
          <input type="hidden" name="serviceId" value={serviceId} />
          <div className="space-y-2">
            <Label htmlFor="new-addon-name">Nama add-on</Label>
            <Input
              id="new-addon-name"
              name="addonName"
              placeholder="Contoh: Revisi tambahan"
              className="h-10 bg-background"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-addon-price">Harga add-on</Label>
            <Input
              id="new-addon-price"
              name="addonPrice"
              type="number"
              min="0"
              placeholder="50000"
              className="h-10 bg-background"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-addon-description">Deskripsi</Label>
            <Textarea
              id="new-addon-description"
              name="addonDescription"
              placeholder="Jelaskan manfaat add-on secara singkat."
              className="min-h-20 bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-addon-status">Status</Label>
            <select
              id="new-addon-status"
              name="addonIsActive"
              defaultValue="true"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="true">Aktif</option>
              <option value="false">Tidak aktif</option>
            </select>
          </div>
          <Button type="submit" className="h-10 w-full rounded-full">
            <Plus className="size-4" />
            Tambah Add-on
          </Button>
        </form>

        {addons.length > 0 ? (
          <div className="space-y-3">
            {addons.map((addon) => (
              <form
                key={addon.id}
                action={updateCreatorServiceAddonAction}
                className="space-y-3 rounded-2xl border border-border/70 bg-background p-4"
              >
                <input type="hidden" name="serviceId" value={serviceId} />
                <input type="hidden" name="addonId" value={addon.id} />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">
                      {addon.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCurrency(Number(addon.price))}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      addon.is_active
                        ? "rounded-full border-primary/20 bg-primary/10 text-primary"
                        : "rounded-full"
                    }
                  >
                    {addon.is_active ? "Aktif" : "Tidak aktif"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`addon-name-${addon.id}`}>Nama</Label>
                  <Input
                    id={`addon-name-${addon.id}`}
                    name="addonName"
                    defaultValue={addon.name}
                    className="h-10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`addon-price-${addon.id}`}>Harga</Label>
                  <Input
                    id={`addon-price-${addon.id}`}
                    name="addonPrice"
                    type="number"
                    min="0"
                    defaultValue={Number(addon.price)}
                    className="h-10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`addon-description-${addon.id}`}>Deskripsi</Label>
                  <Textarea
                    id={`addon-description-${addon.id}`}
                    name="addonDescription"
                    defaultValue={addon.description ?? ""}
                    className="min-h-20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`addon-status-${addon.id}`}>Status</Label>
                  <select
                    id={`addon-status-${addon.id}`}
                    name="addonIsActive"
                    defaultValue={addon.is_active ? "true" : "false"}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Tidak aktif</option>
                  </select>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button type="submit" className="h-10 rounded-full">
                    <Save className="size-4" />
                    Simpan
                  </Button>
                  <Button
                    type="submit"
                    variant="outline"
                    formAction={deleteCreatorServiceAddonAction}
                    className="h-10 rounded-full border-destructive/30 bg-background text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                    Hapus
                  </Button>
                </div>
              </form>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/25 p-4 text-sm leading-6 text-muted-foreground">
            Belum ada add-on untuk paket jasa ini.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
