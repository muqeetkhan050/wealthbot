"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { monthKey } from "@/lib/expense-date";

type Expense = {
  amount: number;
  category: string;
  date: string | Date;
};

function daysInMonth(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function dayOfMonth(date: string | Date) {
  return new Date(date).getDate();
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function categoryColorMap(categories: string[]) {
  const sorted = [...categories].sort();
  return Object.fromEntries(
    sorted.map((category, i) => [category, CHART_COLORS[i % CHART_COLORS.length]])
  );
}

export function DailyCategoryChart({
  expenses,
  selectedMonth,
}: {
  expenses: Expense[];
  selectedMonth: string; // "YYYY-MM"
}) {
  const monthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(e.date) === selectedMonth),
    [expenses, selectedMonth]
  );

  const categories = useMemo(
    () => Array.from(new Set(monthExpenses.map((e) => e.category))).sort(),
    [monthExpenses]
  );

  const colors = useMemo(() => categoryColorMap(categories), [categories]);

  const chartConfig = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category,
          { label: category, color: colors[category] },
        ])
      ) satisfies ChartConfig,
    [categories, colors]
  );

  const data = useMemo(() => {
    const total = daysInMonth(selectedMonth);
    const rows = Array.from({ length: total }, (_, i) => {
      const day = i + 1;
      const row: Record<string, number> = { day };
      for (const category of categories) row[category] = 0;
      return row;
    });

    for (const expense of monthExpenses) {
      const day = dayOfMonth(expense.date);
      rows[day - 1][expense.category] += expense.amount;
    }

    return rows;
  }, [monthExpenses, categories, selectedMonth]);

  if (categories.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No expenses this month.
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {categories.map((category) => (
          <Line
            key={category}
            dataKey={category}
            type="monotone"
            stroke={colors[category]}
            dot={{ r: 3 }}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
