"use client";

import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { monthKey } from "@/lib/expense-date";
import { CATEGORICAL_COLORS } from "@/lib/chart-colors";

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

export function categoryColorMap(categories: string[]) {
  const sorted = [...categories].sort();
  return Object.fromEntries(
    sorted.map((category, i) => [category, CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length]])
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

  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] ?? "");

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0] ?? "");
    }
  }, [categories, selectedCategory]);

  const chartConfig = useMemo(
    () =>
      ({
        [selectedCategory]: {
          label: selectedCategory,
          color: colors[selectedCategory],
        },
      }) satisfies ChartConfig,
    [selectedCategory, colors]
  );

  const data = useMemo(() => {
    const total = daysInMonth(selectedMonth);
    const rows = Array.from({ length: total }, (_, i) => ({
      day: i + 1,
      [selectedCategory]: 0,
    }));

    for (const expense of monthExpenses) {
      if (expense.category !== selectedCategory) continue;
      const day = dayOfMonth(expense.date);
      rows[day - 1][selectedCategory] += expense.amount;
    }

    return rows;
  }, [monthExpenses, selectedCategory, selectedMonth]);

  if (categories.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No expenses this month.
      </p>
    );
  }

  return (
    <div>
      <div className="flex justify-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <ChartContainer config={chartConfig} className="mt-4 h-70 w-full">
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey={selectedCategory}
            type="monotone"
            stroke={colors[selectedCategory]}
            dot={{ r: 3 }}
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
