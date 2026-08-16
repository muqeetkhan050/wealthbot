"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { monthlyIncomeExpense } from "@/lib/expense-date"

const GOOD = "#0ca30c"
const CRITICAL = "#d03b3b"

const chartConfig = {
  income: { label: "Income", color: GOOD },
  expense: { label: "Expense", color: CRITICAL },
} satisfies ChartConfig

type Item = { amount: number; date: string | Date }

export function IncomeExpenseTrendChart({
  income,
  expenses,
}: {
  income: Item[]
  expenses: Item[]
}) {
  const data = useMemo(() => monthlyIncomeExpense(income, expenses), [income, expenses])

  if (data.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No income or expenses recorded yet.
      </p>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <AreaChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="0" />
        <XAxis
          dataKey="shortLabel"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: number) => `$${value.toLocaleString()}`}
          width={64}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="income"
          type="monotone"
          stroke={GOOD}
          fill={GOOD}
          fillOpacity={0.1}
          strokeWidth={2}
          dot={{ r: 4, fill: GOOD, stroke: "var(--background)", strokeWidth: 2 }}
        />
        <Area
          dataKey="expense"
          type="monotone"
          stroke={CRITICAL}
          fill={CRITICAL}
          fillOpacity={0.1}
          strokeWidth={2}
          dot={{ r: 4, fill: CRITICAL, stroke: "var(--background)", strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
