"use client";

import { useMemo, useState } from "react";
import { MonthlyCategoryChart } from "@/components/MonthlyCategoryChart";
import { DailyCategoryChart } from "@/components/DailyCategoryChart";
import { monthKey } from "@/lib/expense-date";

type Expense = {
  amount: number;
  category: string;
  date: string | Date;
};

export function AnalyticsCharts({ expenses }: { expenses: Expense[] }) {
  const months = useMemo(() => {
    const keys = new Set(expenses.map((e) => monthKey(e.date)));
    return Array.from(keys).sort();
  }, [expenses]);

  const defaultIndex = useMemo(() => {
    const counts = new Map<string, number>();
    for (const expense of expenses) {
      const key = monthKey(expense.date);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    let bestIndex = months.length - 1;
    let bestCount = -1;
    months.forEach((month, i) => {
      const count = counts.get(month) ?? 0;
      if (count >= bestCount) {
        bestCount = count;
        bestIndex = i;
      }
    });
    return bestIndex;
  }, [months, expenses]);

  const [index, setIndex] = useState(defaultIndex);
  const currentIndex = Math.min(Math.max(index, 0), Math.max(months.length - 1, 0));
  const selectedMonth = months[currentIndex];

  if (months.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No expenses yet.
      </p>
    );
  }

  return (
    <div>
      <MonthlyCategoryChart
        expenses={expenses}
        selectedMonth={selectedMonth}
        onPrev={() => setIndex((i) => i - 1)}
        onNext={() => setIndex((i) => i + 1)}
        canGoPrev={currentIndex > 0}
        canGoNext={currentIndex < months.length - 1}
      />

      <h3 className="mt-10 text-center text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Daily breakdown
      </h3>
      <div className="mx-auto mt-4 max-w-2xl">
        <DailyCategoryChart expenses={expenses} selectedMonth={selectedMonth} />
      </div>
    </div>
  );
}
