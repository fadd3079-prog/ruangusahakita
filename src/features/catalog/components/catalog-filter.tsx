"use client";

import { useMemo, useState } from "react";
import {
  ClipboardList,
  ChevronDown,
  FileCheck2,
  ListChecks,
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
  SheetFooter,
  SheetHeader,
  SheetClose,
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
import type { PublicAvailabilityStatus } from "@/features/catalog/data/catalog-types";
import { cn } from "@/lib/utils";

type PriceFilterValue = "all" | "under_150" | "150_250" | "over_250";
type RatingFilterValue = "all" | "4_8" | "4_7";
type AvailabilityFilterValue = PublicAvailabilityStatus | "all";

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
  const activeFilterCount = [
    categoryId !== "all",
    location !== "all",
    niche !== "all",
    price !== "all",
    rating !== "all",
    availability !== "all",
  ].filter(Boolean).length;

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
    <div className="space-y-6">
      <section className="sticky top-[4rem] z-30 rounded-2xl border border-border/80 bg-background/94 p-2.5 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-3">
        <div className="flex items-center gap-2 lg:hidden">
          <CatalogSearch
            value={query}
            onChange={setQuery}
            labelClassName="sr-only"
            className="min-w-0 flex-1"
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0 rounded-xl bg-card px-3"
              >
                <SlidersHorizontal aria-hidden="true" className="size-4" />
                <span>Filter</span>
                {activeFilterCount > 0 ? (
                  <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[82dvh] gap-0 overflow-hidden rounded-t-2xl p-0"
            >
              <SheetHeader className="border-b px-4 py-3 text-left">
                <SheetTitle>Filter katalog</SheetTitle>
                <SheetDescription>
                  Saring kreator dan urutkan hasil.
                </SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
                <CatalogSort value={sort} onChange={setSort} />
                {renderFilterPanel()}
              </div>
              <SheetFooter className="mt-0 grid grid-cols-2 border-t bg-background p-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  disabled={!hasActiveFilter}
                >
                  Reset
                </Button>
                <SheetClose asChild>
                  <Button type="button">Lihat {filteredItems.length} kreator</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden gap-3 lg:grid xl:grid-cols-[minmax(280px,1fr)_auto] xl:items-end">
          <div className="grid gap-3 lg:grid-cols-[minmax(260px,1.2fr)_repeat(3,minmax(150px,0.72fr))] lg:items-end">
            <CatalogSearch
              value={query}
              onChange={setQuery}
              labelClassName="sr-only"
            />
            <FilterSelect
              label="Kategori"
              value={categoryId}
              onChange={setCategoryId}
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
              value={location}
              onChange={setLocation}
              options={[
                { value: "all", label: "Semua lokasi" },
                ...locations.map((item) => ({ value: item, label: item })),
              ]}
            />
            <CatalogSort value={sort} onChange={setSort} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 xl:justify-end">
            <p className="text-sm font-medium text-muted-foreground">
              {filteredItems.length} kreator
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowAdvancedFilters((currentValue) => !currentValue)
              }
              className="h-10 rounded-full bg-card"
            >
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              Filter detail
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-4 transition-transform",
                  showAdvancedFilters && "rotate-180",
                )}
              />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={resetFilters}
              disabled={!hasActiveFilter}
              title="Reset filter"
              className="h-10 w-10 rounded-full"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>

        {showAdvancedFilters ? (
          <div className="mt-3 hidden border-t border-border/70 pt-3 lg:block">
            <AdvancedFilterPanel
              availability={availability}
              niche={niche}
              niches={niches}
              onAvailabilityChange={(value) =>
                setAvailability(value as AvailabilityFilterValue)
              }
              onNicheChange={setNiche}
              onPriceChange={(value) => setPrice(value as PriceFilterValue)}
              onRatingChange={(value) => setRating(value as RatingFilterValue)}
              price={price}
              rating={rating}
            />
          </div>
        ) : null}
      </section>

      <div className="min-w-0 space-y-6">
        <section className="marketplace-card flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Pilih kreator berdasarkan kebutuhan campaign
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Bandingkan niche, portofolio, output paket jasa, estimasi, dan
                revisi sebelum masuk checkout brief campaign.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {hasActiveFilter ? (
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="h-10 rounded-full bg-background"
              >
                Reset hasil
              </Button>
            ) : null}
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
    <div className="grid gap-3 lg:grid-cols-5">
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

type AdvancedFilterPanelProps = {
  availability: AvailabilityFilterValue;
  niche: string;
  niches: readonly string[];
  onAvailabilityChange: (value: string) => void;
  onNicheChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  price: PriceFilterValue;
  rating: RatingFilterValue;
};

function AdvancedFilterPanel({
  availability,
  niche,
  niches,
  onAvailabilityChange,
  onNicheChange,
  onPriceChange,
  onRatingChange,
  price,
  rating,
}: AdvancedFilterPanelProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-4">
      <FilterSelect
        label="Niche"
        value={niche}
        onChange={onNicheChange}
        options={[
          { value: "all", label: "Semua niche" },
          ...niches.map((item) => ({ value: item, label: item })),
        ]}
      />
      <FilterSelect
        label="Harga"
        value={price}
        onChange={onPriceChange}
        options={priceOptions}
      />
      <FilterSelect
        label="Rating"
        value={rating}
        onChange={onRatingChange}
        options={ratingOptions}
      />
      <FilterSelect
        label="Ketersediaan"
        value={availability}
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
  const safeOptions = options.filter(
    (option) => option.value.trim().length > 0,
  );

  return (
    <label className="block min-w-0">
      <span className="mb-2 block truncate text-sm font-medium text-foreground">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 min-w-0 w-full rounded-xl bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {safeOptions.map((option) => (
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
    <section className="rounded-2xl border border-primary/15 bg-[linear-gradient(135deg,rgba(12,41,73,0.96),rgba(17,73,85,0.94))] p-5 text-primary-foreground shadow-[0_18px_45px_rgba(12,41,73,0.12)] sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-primary-foreground/75">
            Panduan memilih kreator
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Pilih berdasarkan kebutuhan campaign.
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {guidanceItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-start gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 text-primary-foreground ring-1 ring-white/15">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <p className="pt-1 text-sm leading-5 text-primary-foreground/80">
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
