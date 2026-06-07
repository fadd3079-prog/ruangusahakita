"use client";

import { useMemo, useState } from "react";
import {
  ClipboardList,
  FileCheck2,
  ListChecks,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CatalogEmptyState } from "@/features/catalog/components/catalog-empty-state";
import { CatalogSearch } from "@/features/catalog/components/catalog-search";
import {
  CatalogSort,
  type CatalogSortValue,
} from "@/features/catalog/components/catalog-sort";
import {
  CreatorGrid,
  type CatalogCreator,
} from "@/features/catalog/components/creator-grid";
import type { DummyAvailabilityStatus } from "@/lib/dummy";
import { cn } from "@/lib/utils";

type PriceFilterValue = "all" | "under_150" | "150_250" | "over_250";
type RatingFilterValue = "all" | "4_8" | "4_7";
type AvailabilityFilterValue = DummyAvailabilityStatus | "all";

type CatalogFilterProps = {
  items: readonly CatalogCreator[];
  categories: readonly {
    id: string;
    name: string;
  }[];
  locations: readonly string[];
  niches: readonly string[];
};

type FilterSelectOption = {
  value: string;
  label: string;
};

type CatalogFilterState = {
  availability: AvailabilityFilterValue;
  categoryId: string;
  location: string;
  niche: string;
  price: PriceFilterValue;
  rating: RatingFilterValue;
};

const priceOptions: readonly FilterSelectOption[] = [
  { value: "all", label: "Semua harga" },
  { value: "under_150", label: "Di bawah Rp150.000" },
  { value: "150_250", label: "Rp150.000 - Rp250.000" },
  { value: "over_250", label: "Di atas Rp250.000" },
];

const ratingOptions: readonly FilterSelectOption[] = [
  { value: "all", label: "Semua rating" },
  { value: "4_8", label: "Minimal 4.8" },
  { value: "4_7", label: "Minimal 4.7" },
];

const availabilityOptions: readonly FilterSelectOption[] = [
  { value: "all", label: "Semua ketersediaan" },
  { value: "available", label: "Tersedia" },
  { value: "limited", label: "Terbatas" },
  { value: "busy", label: "Penuh sementara" },
  { value: "unavailable", label: "Belum tersedia" },
];

const guidanceItems: readonly {
  title: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Sesuaikan niche dengan jenis usaha",
    icon: Sparkles,
  },
  {
    title: "Cek portofolio dan gaya konten kreator",
    icon: Star,
  },
  {
    title: "Cek output paket jasa sebelum memilih",
    icon: ListChecks,
  },
  {
    title: "Perhatikan estimasi pengerjaan dan revisi",
    icon: FileCheck2,
  },
  {
    title: "Isi brief campaign dengan jelas saat checkout",
    icon: ClipboardList,
  },
];

function matchesPrice(value: number, filter: PriceFilterValue) {
  if (filter === "under_150") {
    return value < 150000;
  }

  if (filter === "150_250") {
    return value >= 150000 && value <= 250000;
  }

  if (filter === "over_250") {
    return value > 250000;
  }

  return true;
}

function matchesRating(value: number, filter: RatingFilterValue) {
  if (filter === "4_8") {
    return value >= 4.8;
  }

  if (filter === "4_7") {
    return value >= 4.7;
  }

  return true;
}

function sortItems(items: readonly CatalogCreator[], sort: CatalogSortValue) {
  return [...items].sort((first, second) => {
    if (sort === "rating") {
      return second.creator.averageRating - first.creator.averageRating;
    }

    if (sort === "price_low") {
      return first.creator.startingPrice - second.creator.startingPrice;
    }

    if (sort === "projects") {
      return (
        second.creator.completedOrdersCount - first.creator.completedOrdersCount
      );
    }

    if (sort === "fastest") {
      return (
        (first.primaryService?.estimatedDays ?? Number.POSITIVE_INFINITY) -
        (second.primaryService?.estimatedDays ?? Number.POSITIVE_INFINITY)
      );
    }

    return 0;
  });
}

export function CatalogFilter({
  items,
  categories,
  locations,
  niches,
}: CatalogFilterProps) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [location, setLocation] = useState("all");
  const [niche, setNiche] = useState("all");
  const [price, setPrice] = useState<PriceFilterValue>("all");
  const [rating, setRating] = useState<RatingFilterValue>("all");
  const [availability, setAvailability] =
    useState<AvailabilityFilterValue>("all");
  const [sort, setSort] = useState<CatalogSortValue>("relevant");
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  const filterState: CatalogFilterState = {
    availability,
    categoryId,
    location,
    niche,
    price,
    rating,
  };

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = items.filter((item) => {
      const creator = item.creator;
      const service = item.primaryService;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        item.searchText.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        categoryId === "all" || service?.categoryId === categoryId;
      const matchesLocation = location === "all" || creator.city === location;
      const matchesNiche = niche === "all" || creator.niche === niche;
      const matchesAvailability =
        availability === "all" || creator.availabilityStatus === availability;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesNiche &&
        matchesPrice(creator.startingPrice, price) &&
        matchesRating(creator.averageRating, rating) &&
        matchesAvailability
      );
    });

    return sortItems(result, sort);
  }, [
    availability,
    categoryId,
    items,
    location,
    niche,
    price,
    query,
    rating,
    sort,
  ]);

  const hasActiveFilter =
    query.trim().length > 0 ||
    categoryId !== "all" ||
    location !== "all" ||
    niche !== "all" ||
    price !== "all" ||
    rating !== "all" ||
    availability !== "all" ||
    sort !== "relevant";

  function resetFilters() {
    setQuery("");
    setCategoryId("all");
    setLocation("all");
    setNiche("all");
    setPrice("all");
    setRating("all");
    setAvailability("all");
    setSort("relevant");
  }

  function renderFilterPanel() {
    return (
      <FilterPanel
        categories={categories}
        filterState={filterState}
        locations={locations}
        niches={niches}
        onAvailabilityChange={(nextValue) =>
          setAvailability(nextValue as AvailabilityFilterValue)
        }
        onCategoryChange={setCategoryId}
        onLocationChange={setLocation}
        onNicheChange={setNiche}
        onPriceChange={(nextValue) => setPrice(nextValue as PriceFilterValue)}
        onRatingChange={(nextValue) =>
          setRating(nextValue as RatingFilterValue)
        }
      />
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 lg:items-start",
        isFilterCollapsed
          ? "lg:grid-cols-[72px_minmax(0,1fr)]"
          : "lg:grid-cols-[280px_minmax(0,1fr)]",
      )}
    >
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-[var(--shadow-soft)] transition-[width] duration-200 ease-out",
            isFilterCollapsed ? "w-[72px]" : "w-[280px]",
          )}
        >
          <div className="flex min-h-14 items-center justify-between gap-2 border-b border-border/70 px-4">
            <div className={cn("min-w-0", isFilterCollapsed && "sr-only")}>
              <p className="text-sm font-semibold text-foreground">Filter</p>
              <p className="text-xs text-muted-foreground">
                Sesuaikan kebutuhan campaign
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                setIsFilterCollapsed((currentValue) => !currentValue)
              }
              aria-label={
                isFilterCollapsed ? "Perluas filter" : "Ciutkan filter"
              }
              className="shrink-0"
            >
              {isFilterCollapsed ? (
                <PanelLeftOpen aria-hidden="true" />
              ) : (
                <PanelLeftClose aria-hidden="true" />
              )}
            </Button>
          </div>
          {!isFilterCollapsed ? (
            <div className="p-4">{renderFilterPanel()}</div>
          ) : null}
        </div>
      </aside>

      <div className="min-w-0 space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/90 p-4 shadow-[var(--shadow-soft)] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <CatalogSearch value={query} onChange={setQuery} />
            <CatalogSort value={sort} onChange={setSort} />
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="lg:hidden"
                  >
                    <SlidersHorizontal aria-hidden="true" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[min(24rem,calc(100vw-2rem))] overflow-y-auto p-0"
                >
                  <SheetHeader className="border-b p-5 text-left">
                    <SheetTitle>Filter katalog</SheetTitle>
                    <SheetDescription>
                      Pilih kategori, lokasi, niche, harga, rating, dan
                      ketersediaan kreator.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="p-5">{renderFilterPanel()}</div>
                </SheetContent>
              </Sheet>

              <p className="text-sm text-muted-foreground">
                {filteredItems.length} kreator ditemukan
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              disabled={!hasActiveFilter}
            >
              <RotateCcw aria-hidden="true" />
              Reset
            </Button>
          </div>
        </section>

        {filteredItems.length > 0 ? (
          <CreatorGrid items={filteredItems} />
        ) : (
          <CatalogEmptyState />
        )}

        <CatalogGuidanceStrip />
      </div>
    </div>
  );
}

type FilterPanelProps = {
  categories: readonly {
    id: string;
    name: string;
  }[];
  filterState: CatalogFilterState;
  locations: readonly string[];
  niches: readonly string[];
  onAvailabilityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onNicheChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onRatingChange: (value: string) => void;
};

function FilterPanel({
  categories,
  filterState,
  locations,
  niches,
  onAvailabilityChange,
  onCategoryChange,
  onLocationChange,
  onNicheChange,
  onPriceChange,
  onRatingChange,
}: FilterPanelProps) {
  return (
    <div className="grid gap-4">
      <FilterSelect
        label="Kategori layanan"
        value={filterState.categoryId}
        onChange={onCategoryChange}
        options={[
          { value: "all", label: "Semua kategori" },
          ...categories.map((category) => ({
            value: category.id,
            label: category.name,
          })),
        ]}
      />
      <FilterSelect
        label="Lokasi"
        value={filterState.location}
        onChange={onLocationChange}
        options={[
          { value: "all", label: "Semua lokasi" },
          ...locations.map((item) => ({ value: item, label: item })),
        ]}
      />
      <FilterSelect
        label="Niche"
        value={filterState.niche}
        onChange={onNicheChange}
        options={[
          { value: "all", label: "Semua niche" },
          ...niches.map((item) => ({ value: item, label: item })),
        ]}
      />
      <FilterSelect
        label="Harga"
        value={filterState.price}
        onChange={onPriceChange}
        options={priceOptions}
      />
      <FilterSelect
        label="Rating"
        value={filterState.rating}
        onChange={onRatingChange}
        options={ratingOptions}
      />
      <FilterSelect
        label="Ketersediaan kreator"
        value={filterState.availability}
        onChange={onAvailabilityChange}
        options={availabilityOptions}
      />
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterSelectOption[];
};

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function CatalogGuidanceStrip() {
  return (
    <section className="rounded-2xl border border-primary/15 bg-[linear-gradient(135deg,rgba(12,41,73,0.96),rgba(17,73,85,0.94))] p-5 text-primary-foreground shadow-[0_18px_45px_rgba(12,41,73,0.16)] sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-primary-foreground/75">
            Panduan memilih kreator
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
            Pilih berdasarkan kebutuhan campaign, bukan hanya harga.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {guidanceItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-start gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 text-primary-foreground ring-1 ring-white/15">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <p className="pt-1 text-sm leading-6 text-primary-foreground/80">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
