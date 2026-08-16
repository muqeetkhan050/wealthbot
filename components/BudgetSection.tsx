"use client"

import { BudgetProgressBar } from "@/components/BudgetProgressBar"
import type { BudgetRow } from "@/lib/budget"
import { CATEGORICAL_COLORS } from "@/lib/chart-colors"

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
            color={CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length]}
          />
        ))}
      </div>
    </div>
  )
}
