"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryIcon } from "@/components/CategoryIcon";
import { categoryColorMap } from "@/components/DailyCategoryChart";

type Item = {
  amount: number;
  category: string;
  description: string | null;
};

export function CategorySpendDonut({
  title,
  centerLabel,
  items,
}: {
  title: string;
  centerLabel: string;
  items: Item[];
}) {
  const data = useMemo(() => {
    const totals = new Map<string, number>();
    for (const item of items) {
      totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
    }
    return [...totals]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [items]);

  const categories = useMemo(() => data.map((d) => d.category), [data]);
  const colors = useMemo(() => categoryColorMap(categories), [categories]);
  const total = useMemo(() => data.reduce((sum, d) => sum + d.amount, 0), [data]);

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const detailsByCategory = useMemo(() => {
    const grouped = new Map<string, Map<string, { amount: number; count: number }>>();

    for (const item of items) {
      const label = item.description?.trim() || "No description";
      if (!grouped.has(item.category)) {
        grouped.set(item.category, new Map());
      }
      const byLabel = grouped.get(item.category)!;
      const existing = byLabel.get(label) ?? { amount: 0, count: 0 };
      byLabel.set(label, {
        amount: existing.amount + item.amount,
        count: existing.count + 1,
      });
    }

    const result = new Map<string, { label: string; amount: number; count: number }[]>();
    for (const [category, byLabel] of grouped) {
      result.set(
        category,
        [...byLabel]
          .map(([label, v]) => ({ label, ...v }))
          .sort((a, b) => b.amount - a.amount)
      );
    }
    return result;
  }, [items]);

  const chartConfig = useMemo(
    () =>
      Object.fromEntries(
        data.map(({ category }) => [
          category,
          { label: category, color: colors[category] },
        ])
      ) satisfies ChartConfig,
    [data, colors]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Nothing recorded yet.</p>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative aspect-square w-56 shrink-0">
              <ChartContainer config={chartConfig} className="aspect-square h-full w-full">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={65}
                    outerRadius={95}
                    strokeWidth={2}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.category} fill={colors[entry.category]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{centerLabel}</p>
                <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>

            <ul className="flex w-full flex-col gap-1">
              {data.map(({ category, amount }) => {
                const isExpanded = expandedCategory === category;
                const details = detailsByCategory.get(category) ?? [];

                return (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCategory(isExpanded ? null : category)
                      }
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${colors[category]}22` }}
                      >
                        <CategoryIcon category={category} />
                      </span>
                      <div className="flex flex-1 items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {category}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {total > 0 ? Math.round((amount / total) * 100) : 0}%
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            ${amount.toFixed(2)}
                          </p>
                          <ChevronDown
                            className={`size-4 text-zinc-400 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <ul className="mb-2 ml-11 flex flex-col gap-1 border-l border-zinc-200 pl-3 dark:border-zinc-800">
                        {details.map((detail) => (
                          <li
                            key={detail.label}
                            className="flex items-center justify-between gap-2 py-1 text-xs"
                          >
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {detail.label}
                              {detail.count > 1 ? ` ×${detail.count}` : ""}
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">
                              ${detail.amount.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
