export function monthKey(date: string | Date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function monthShortLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: "short",
  });
}

export type MonthlyIncomeExpense = {
  key: string;
  label: string;
  shortLabel: string;
  income: number;
  expense: number;
  net: number;
};

export function monthlyIncomeExpense(
  incomes: { amount: number; date: string | Date }[],
  expenses: { amount: number; date: string | Date }[]
): MonthlyIncomeExpense[] {
  const byMonth = new Map<string, { income: number; expense: number }>();

  for (const income of incomes) {
    const key = monthKey(income.date);
    const entry = byMonth.get(key) ?? { income: 0, expense: 0 };
    entry.income += income.amount;
    byMonth.set(key, entry);
  }

  for (const expense of expenses) {
    const key = monthKey(expense.date);
    const entry = byMonth.get(key) ?? { income: 0, expense: 0 };
    entry.expense += expense.amount;
    byMonth.set(key, entry);
  }

  return [...byMonth]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, { income, expense }]) => ({
      key,
      label: monthLabel(key),
      shortLabel: monthShortLabel(key),
      income,
      expense,
      net: income - expense,
    }));
}
