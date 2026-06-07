import { Button } from "@/components/ui/button";

type OrderActionPanelProps = {
  actions: readonly string[];
  note: string;
  title: string;
};

export function OrderActionPanel({ actions, note, title }: OrderActionPanelProps) {
  return (
    <section
      aria-labelledby="order-action-panel-title"
      className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]"
    >
      <p className="text-sm font-semibold text-primary">Aksi placeholder</p>
      <h2
        id="order-action-panel-title"
        className="mt-2 text-xl font-semibold tracking-tight text-foreground"
      >
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{note}</p>
      <div className="mt-5 grid gap-2">
        {actions.map((action) => (
          <Button key={action} type="button" className="h-11 justify-start">
            {action}
          </Button>
        ))}
      </div>
    </section>
  );
}
