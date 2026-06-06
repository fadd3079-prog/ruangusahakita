import { ExternalLink, Images } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DummyPortfolioItem, DummyServiceCategory } from "@/lib/dummy";

type PortfolioCardProps = {
  portfolio: DummyPortfolioItem;
  category?: DummyServiceCategory;
};

export function PortfolioCard({ portfolio, category }: PortfolioCardProps) {
  return (
    <Card className="rounded-lg border-border/70 bg-card/85 shadow-xs">
      <div className="mx-4 mt-4 grid aspect-video place-items-center rounded-lg border border-border/70 bg-primary/10 text-primary">
        <Images className="size-8" aria-hidden="true" />
      </div>
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          {category ? (
            <Badge variant="secondary" className="rounded-lg">
              {category.name}
            </Badge>
          ) : null}
          {portfolio.isFeatured ? (
            <Badge variant="outline" className="rounded-lg text-primary">
              Portofolio unggulan
            </Badge>
          ) : null}
        </div>
        <CardTitle className="text-lg">{portfolio.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {portfolio.description}
        </p>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">{portfolio.clientName}</span>
          <a
            href={portfolio.externalUrl}
            className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80"
            target="_blank"
            rel="noreferrer"
          >
            Preview
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
