"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryChart } from "@/components/CategoryChart";
import { monthKey, monthLabel } from "@/lib/expense-date";

type Expense = {
  amount: number;
  category: string;
  date: string | Date;
};

export function MonthlyCategoryChart({
  expenses,
  selectedMonth,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: {
  expenses: Expense[];
  selectedMonth: string;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}) {
  const chartData = useMemo(() => {
    const totals = new Map<string, number>();
    for (const expense of expenses) {
      if (monthKey(expense.date) !== selectedMonth) continue;
      totals.set(
        expense.category,
        (totals.get(expense.category) ?? 0) + expense.amount
      );
    }
    return [...totals].map(([category, amount]) => ({ category, amount }));
  }, [expenses, selectedMonth]);

  return (
    <div>
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={onPrev} disabled={!canGoPrev}>
          <ChevronLeft className="size-4" />
        </Button>
        <p className="w-40 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {monthLabel(selectedMonth)}
        </p>
        <Button variant="outline" size="icon" onClick={onNext} disabled={!canGoNext}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="mx-auto mt-4 max-w-lg">
        {chartData.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            No expenses in {monthLabel(selectedMonth)}.
          </p>
        ) : (
          <CategoryChart data={chartData} />
        )}
      </div>
    </div>
  );
}
