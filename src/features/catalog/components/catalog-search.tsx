import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type CatalogSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CatalogSearch({ value, onChange }: CatalogSearchProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">
        Pencarian
      </span>
      <span className="relative block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Cari kreator, layanan, atau kategori"
          className="h-11 bg-background pl-10"
        />
      </span>
    </label>
  );
}
