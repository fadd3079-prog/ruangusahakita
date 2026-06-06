"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DummyAvailabilityStatus } from "@/lib/dummy";
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

const priceOptions: readonly {
  value: PriceFilterValue;
  label: string;
}[] = [
  { value: "all", label: "Semua harga" },
  { value: "under_150", label: "Di bawah Rp150.000" },
  { value: "150_250", label: "Rp150.000 - Rp250.000" },
  { value: "over_250", label: "Di atas Rp250.000" },
];

const ratingOptions: readonly {
  value: RatingFilterValue;
  label: string;
}[] = [
  { value: "all", label: "Semua rating" },
  { value: "4_8", label: "Minimal 4.8" },
  { value: "4_7", label: "Minimal 4.7" },
];

const availabilityOptions: readonly {
  value: AvailabilityFilterValue;
  label: string;
}[] = [
  { value: "all", label: "Semua ketersediaan" },
  { value: "available", label: "Tersedia" },
  { value: "limited", label: "Terbatas" },
  { value: "busy", label: "Penuh sementara" },
  { value: "unavailable", label: "Belum tersedia" },
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
      return second.creator.completedOrdersCount - first.creator.completedOrdersCount;
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
  }, [availability, categoryId, items, location, niche, price, query, rating, sort]);

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

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border/70 bg-card p-4 shadow-xs sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(180px,0.7fr)]">
          <CatalogSearch value={query} onChange={setQuery} />
          <CatalogSort value={sort} onChange={setSort} />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <FilterSelect
            label="Kategori layanan"
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
          <FilterSelect
            label="Niche"
            value={niche}
            onChange={setNiche}
            options={[
              { value: "all", label: "Semua niche" },
              ...niches.map((item) => ({ value: item, label: item })),
            ]}
          />
          <FilterSelect
            label="Harga"
            value={price}
            onChange={(value) => setPrice(value as PriceFilterValue)}
            options={priceOptions}
          />
          <FilterSelect
            label="Rating"
            value={rating}
            onChange={(value) => setRating(value as RatingFilterValue)}
            options={ratingOptions}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-end sm:justify-between">
          <FilterSelect
            label="Ketersediaan kreator"
            value={availability}
            onChange={(value) => setAvailability(value as AvailabilityFilterValue)}
            options={availabilityOptions}
            className="sm:max-w-xs"
          />
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-sm text-muted-foreground">
              {filteredItems.length} kreator ditemukan
            </p>
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
        </div>
      </section>

      {filteredItems.length > 0 ? (
        <CreatorGrid items={filteredItems} />
      ) : (
        <CatalogEmptyState />
      )}
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly {
    value: string;
    label: string;
  }[];
  className?: string;
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
  className,
}: FilterSelectProps) {
  return (
    <label className={className}>
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
