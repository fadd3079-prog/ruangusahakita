import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PublicPortfolioItem, PublicServiceCategory } from "@/features/catalog/data/catalog-types";

type PortfolioCardProps = {
  portfolio: PublicPortfolioItem;
  category?: PublicServiceCategory;
};

export function PortfolioCard({ portfolio, category }: PortfolioCardProps) {
  const visualUrl = portfolio.thumbnailUrl || "/images/image (10).webp";

  return (
    <Card className="marketplace-card h-full overflow-hidden p-0">
      <div
        className="aspect-video bg-cover bg-center"
        style={{ backgroundImage: `url("${visualUrl}")` }}
      />
      <CardHeader className="px-4 pb-2 pt-4">
        <div className="flex flex-wrap gap-2">
          {category ? (
            <Badge variant="secondary" className="rounded-full">
              {category.name}
            </Badge>
          ) : null}
          {portfolio.isFeatured ? (
            <Badge variant="outline" className="rounded-full text-primary">
              Portofolio unggulan
            </Badge>
          ) : null}
        </div>
        <CardTitle className="line-clamp-2 min-h-11 text-lg">
          {portfolio.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {portfolio.description}
        </p>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">{portfolio.clientName}</span>
          {portfolio.externalUrl ? (
            <a
              href={portfolio.externalUrl}
              className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80"
              target="_blank"
              rel="noreferrer"
            >
              Preview
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
