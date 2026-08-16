import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { monthlyIncomeExpense } from "@/lib/expense-date"

const GOOD = "#0ca30c"
const CRITICAL = "#d03b3b"

type Item = { amount: number; date: string | Date }

export function IncomeExpenseStatement({
  income,
  expenses,
}: {
  income: Item[]
  expenses: Item[]
}) {
  const rows = monthlyIncomeExpense(income, expenses)

  if (rows.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No income or expenses recorded yet.
      </p>
    )
  }

  return (
    <Table className="bg-transparent">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Month</TableHead>
          <TableHead className="text-right">Income</TableHead>
          <TableHead className="text-right">Expense</TableHead>
          <TableHead className="w-40">Difference</TableHead>
          <TableHead className="text-right">Net</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const total = row.income + row.expense
          const incomePct = total > 0 ? (row.income / total) * 100 : 0
          const expensePct = total > 0 ? (row.expense / total) * 100 : 0

          return (
            <TableRow key={row.key} className="hover:bg-black/5 dark:hover:bg-white/5">
              <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                {row.shortLabel}
              </TableCell>
              <TableCell className="text-right text-emerald-600 dark:text-emerald-400">
                ${row.income.toFixed(2)}
              </TableCell>
              <TableCell className="text-right text-rose-600 dark:text-rose-400">
                ${row.expense.toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div style={{ width: `${incomePct}%`, backgroundColor: GOOD }} />
                  <div className="w-0.5 shrink-0" />
                  <div style={{ width: `${expensePct}%`, backgroundColor: CRITICAL }} />
                </div>
              </TableCell>
              <TableCell
                className={`text-right font-semibold ${
                  row.net >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {row.net >= 0 ? "+" : "-"}${Math.abs(row.net).toFixed(2)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
