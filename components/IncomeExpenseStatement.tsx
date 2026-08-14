type Expense = {
  amount: number
}

export function IncomeExpenseStatement({
  income,
  expenses,
}: {
  income: number | null
  expenses: Expense[]
}) {
  const totalIncome = income ?? 0
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const net = totalIncome - totalExpenses

  return (
    <div className="rounded-xl ring-1 ring-foreground/10">
      <div className="grid grid-cols-1 divide-y divide-foreground/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Income</p>
          <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            ${totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Outcome</p>
          <p className="mt-1 text-lg font-semibold text-rose-600 dark:text-rose-400">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Net</p>
          <p
            className={`mt-1 text-lg font-semibold ${
              net >= 0
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {net >= 0 ? "+" : "-"}${Math.abs(net).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
