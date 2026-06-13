"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AnalyticsBucket } from "@/features/admin/data/admin-analytics-queries";

type AnalyticsChartsProps = {
  categoryPerformance: readonly AnalyticsBucket[];
  completedOrderTrend: readonly AnalyticsBucket[];
  conversionFunnel: readonly AnalyticsBucket[];
  deviceBreakdown: readonly AnalyticsBucket[];
  eventsByDay: readonly AnalyticsBucket[];
  orderTrend: readonly AnalyticsBucket[];
  revenueTrend: readonly AnalyticsBucket[];
  roleBreakdown: readonly AnalyticsBucket[];
  sourceBreakdown: readonly AnalyticsBucket[];
  topPages: readonly AnalyticsBucket[];
};

const chartColors = [
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#DC2626",
  "#7C3AED",
  "#06B6D4",
  "#0C2949",
  "#167163",
];

export function AdminAnalyticsCharts({
  categoryPerformance,
  completedOrderTrend,
  conversionFunnel,
  deviceBreakdown,
  eventsByDay,
  orderTrend,
  revenueTrend,
  roleBreakdown,
  sourceBreakdown,
  topPages,
}: AnalyticsChartsProps) {
  return (
    <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
      <div className="grid min-w-0 gap-4">
        <ChartSurface title="Traffic 30 hari" tone="blue">
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={eventsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.18)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={34} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={3}
                fill="rgba(37,99,235,0.14)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartSurface>

        <div className="grid gap-4 xl:grid-cols-2">
          <ChartSurface title="Order dan completed" tone="green">
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={mergeTrendBuckets(orderTrend, completedOrderTrend)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.16)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={34} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#2563EB" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="completed" stroke="#16A34A" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartSurface>

          <ChartSurface title="Platform revenue" tone="cyan">
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.16)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={42} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  fill="rgba(6,182,212,0.16)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartSurface>
        </div>

        <ChartSurface title="Conversion funnel" tone="purple">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={conversionFunnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.16)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={34} />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {conversionFunnel.map((entry, index) => (
                  <Cell key={entry.label} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSurface>
      </div>

      <div className="grid min-w-0 gap-4">
        <ChartSurface title="Role traffic" tone="purple">
          <Donut items={roleBreakdown} />
        </ChartSurface>
        <ChartSurface title="Device" tone="amber">
          <Donut items={deviceBreakdown} />
        </ChartSurface>
        <MiniRank title="Top pages" items={topPages} color="#2563EB" />
        <MiniRank title="Source" items={sourceBreakdown} color="#7C3AED" />
        <MiniRank title="Kategori layanan" items={categoryPerformance} color="#16A34A" />
      </div>
    </div>
  );
}

function Donut({ items }: { items: readonly AnalyticsBucket[] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid gap-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={items}
            dataKey="value"
            nameKey="label"
            innerRadius={42}
            outerRadius={68}
            paddingAngle={3}
          >
            {items.map((entry, index) => (
              <Cell key={entry.label} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid min-w-0 gap-2">
        {items.length > 0 ? (
          items.slice(0, 5).map((item, index) => (
            <div key={item.label} className="flex min-w-0 items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: chartColors[index % chartColors.length] }}
                />
                <span className="truncate text-foreground">{item.label}</span>
              </span>
              <span className="shrink-0 text-muted-foreground">
                {total > 0 ? `${((item.value / total) * 100).toFixed(0)}%` : "0%"}
              </span>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            Belum ada data.
          </p>
        )}
      </div>
    </div>
  );
}

function ChartSurface({
  children,
  title,
  tone,
}: {
  children: ReactNode;
  title: string;
  tone: "amber" | "blue" | "cyan" | "green" | "purple";
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="mb-3 flex items-center gap-2">
        <span className={getToneDotClass(tone)} />
        <h2 className="truncate text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MiniRank({
  color,
  items,
  title,
}: {
  color: string;
  items: readonly AnalyticsBucket[];
  title: string;
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]">
      <h2 className="truncate text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-3 grid gap-3">
        {items.length > 0 ? (
          items.slice(0, 5).map((item) => (
            <div key={item.label} className="min-w-0">
              <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                <span className="truncate font-medium text-foreground">{item.label}</span>
                <span className="shrink-0 text-muted-foreground">{item.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: color,
                    width: `${Math.max((item.value / maxValue) * 100, 4)}%`,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            Belum ada data.
          </p>
        )}
      </div>
    </section>
  );
}

function mergeTrendBuckets(
  orders: readonly AnalyticsBucket[],
  completed: readonly AnalyticsBucket[],
) {
  const labels = Array.from(new Set([...orders, ...completed].map((item) => item.label))).sort();
  const orderMap = new Map(orders.map((item) => [item.label, item.value]));
  const completedMap = new Map(completed.map((item) => [item.label, item.value]));

  return labels.map((label) => ({
    completed: completedMap.get(label) ?? 0,
    label,
    orders: orderMap.get(label) ?? 0,
  }));
}

function getToneDotClass(tone: "amber" | "blue" | "cyan" | "green" | "purple") {
  const classes = {
    amber: "size-2.5 rounded-full bg-amber-500",
    blue: "size-2.5 rounded-full bg-blue-600",
    cyan: "size-2.5 rounded-full bg-cyan-500",
    green: "size-2.5 rounded-full bg-emerald-600",
    purple: "size-2.5 rounded-full bg-violet-600",
  };

  return classes[tone];
}
