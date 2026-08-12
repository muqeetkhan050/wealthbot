// components/CategorySpendDonut.tsx
"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CategoryIcon } from "@/components/CategoryIcon";
import { categoryColorMap } from "@/components/DailyCategoryChart";

type Expense = {
  amount: number;
  category: string;
};

export function CategorySpendDonut({ expenses }: { expenses: Expense[] }) {
  const data = useMemo(() => {
    const totals = new Map<string, number>();
    for (const expense of expenses) {
      totals.set(
        expense.category,
        (totals.get(expense.category) ?? 0) + expense.amount
      );
    }
    return [...totals]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const categories = useMemo(() => data.map((d) => d.category), [data]);
  const colors = useMemo(() => categoryColorMap(categories), [categories]);
  const total = useMemo(() => data.reduce((sum, d) => sum + d.amount, 0), [data]);

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

  if (data.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No expenses this month.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
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
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Spent</p>
          <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-3">
        {data.map(({ category, amount }) => (
          <li key={category} className="flex items-center gap-3">
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
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                ${amount.toFixed(2)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
