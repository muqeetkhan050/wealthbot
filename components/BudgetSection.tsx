"use client"

import { Fragment } from "react"
import { BudgetProgressBar } from "@/components/BudgetProgressBar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { groupExpenseRows, type BudgetRow } from "@/lib/budget"
import { CATEGORICAL_COLORS } from "@/lib/chart-colors"

export function BudgetSection({
  title,
  rows,
  grouped = false,
}: {
  title: string
  rows: BudgetRow[]
  grouped?: boolean
}) {
  const groups = grouped ? groupExpenseRows(rows) : [{ group: null, rows }]

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <Table className="mt-2 bg-transparent">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Spent</TableHead>
            <TableHead className="text-right">Target</TableHead>
            <TableHead className="w-40">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map(({ group, rows: groupRows }) => (
            <Fragment key={group ?? "ungrouped"}>
              {group && (
                <TableRow key={`${group}-header`} className="hover:bg-transparent">
                  <TableCell
                    colSpan={4}
                    className="bg-black/5 text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:bg-white/5 dark:text-zinc-400"
                  >
                    {group}
                  </TableCell>
                </TableRow>
              )}
              {groupRows.map((row, i) => (
                <BudgetProgressBar
                  key={row.category}
                  category={row.category}
                  actual={row.actual}
                  target={row.target}
                  color={CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length]}
                />
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
