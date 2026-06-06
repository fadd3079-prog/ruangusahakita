import { SearchX } from "lucide-react";

export function CatalogEmptyState() {
  return (
    <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
          <SearchX className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          Belum ada kreator yang sesuai.
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Ubah kata kunci atau filter untuk melihat pilihan lain.
        </p>
      </div>
    </div>
  );
}
