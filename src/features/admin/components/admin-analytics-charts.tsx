"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  conversionFunnel: readonly AnalyticsBucket[];
  deviceBreakdown: readonly AnalyticsBucket[];
  eventsByDay: readonly AnalyticsBucket[];
  sourceBreakdown: readonly AnalyticsBucket[];
  topPages: readonly AnalyticsBucket[];
};

const chartColors = [
  "#167163",
  "#114955",
  "#0C2949",
  "#3B82F6",
  "#14B8A6",
  "#64748B",
];

export function AdminAnalyticsCharts({
  categoryPerformance,
  conversionFunnel,
  deviceBreakdown,
  eventsByDay,
  sourceBreakdown,
  topPages,
}: AnalyticsChartsProps) {
  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
      <ChartSurface title="Aktivitas 30 hari">
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={eventsByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.18)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={32} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#167163"
              strokeWidth={3}
              fill="rgba(22,113,99,0.16)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartSurface>

      <ChartSurface title="Device">
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={deviceBreakdown}
              dataKey="value"
              nameKey="label"
              innerRadius={54}
              outerRadius={88}
              paddingAngle={3}
            >
              {deviceBreakdown.map((entry, index) => (
                <Cell key={entry.label} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartSurface>

      <ChartSurface title="Conversion funnel">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={conversionFunnel}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.16)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={32} />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#0C2949" />
          </BarChart>
        </ResponsiveContainer>
      </ChartSurface>

      <div className="grid gap-4">
        <MiniRank title="Top pages" items={topPages} />
        <MiniRank title="Source" items={sourceBreakdown} />
        <MiniRank title="Kategori layanan" items={categoryPerformance} />
      </div>
    </div>
  );
}

function ChartSurface({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MiniRank({
  items,
  title,
}: {
  items: readonly AnalyticsBucket[];
  title: string;
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
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
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max((item.value / maxValue) * 100, 4)}%` }}
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
