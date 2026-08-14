"use client"

import { BudgetProgressBar } from "@/components/BudgetProgressBar"
import type { BudgetRow } from "@/lib/budget"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function BudgetSection({ title, rows }: { title: string; rows: BudgetRow[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <div className="mt-2 divide-y divide-zinc-100 dark:divide-zinc-800">
        {rows.map((row, i) => (
          <BudgetProgressBar
            key={row.category}
            category={row.category}
            actual={row.actual}
            target={row.target}
            color={CHART_COLORS[i % CHART_COLORS.length]}
          />
        ))}
      </div>
    </div>
  )
}
