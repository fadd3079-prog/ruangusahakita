import { CreatorCard } from "@/components/cards/creator-card";
import type { PublicCreatorProfile } from "@/features/catalog/data/catalog-types";

export type CatalogCreator = {
  readonly creator: PublicCreatorProfile;
  readonly primaryService: {
    readonly id: string;
    readonly title: string;
    readonly categoryId: string;
    readonly categoryName: string;
    readonly estimatedDays: number;
    readonly basePrice: number;
  } | null;
  readonly searchText: string;
};

type CreatorGridProps = {
  items: readonly CatalogCreator[];
};

export function CreatorGrid({ items }: CreatorGridProps) {
  return (
    <div className="grid min-w-0 auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <CreatorCard
          key={item.creator.id}
          creator={item.creator}
          primaryService={item.primaryService}
        />
      ))}
    </div>
  );
}
