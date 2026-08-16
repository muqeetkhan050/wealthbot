"use client"

import { useMemo } from "react"
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { monthlyIncomeExpense } from "@/lib/expense-date"

const GOOD = "#0ca30c"
const CRITICAL = "#d03b3b"

const chartConfig = {
  income: { label: "Income", color: GOOD },
  expenseNegative: { label: "Expenses", color: CRITICAL },
  net: { label: "Net Income", color: "var(--foreground)" },
} satisfies ChartConfig

type Item = { amount: number; date: string | Date }

export function NetIncomeChart({
  income,
  expenses,
}: {
  income: Item[]
  expenses: Item[]
}) {
  const data = useMemo(
    () =>
      monthlyIncomeExpense(income, expenses).map((row) => ({
        ...row,
        expenseNegative: -row.expense,
      })),
    [income, expenses]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Income</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No income or expenses recorded yet.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
            <ComposedChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="0" />
              <XAxis dataKey="shortLabel" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                width={64}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill={GOOD} radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="expenseNegative" fill={CRITICAL} radius={[0, 0, 4, 4]} maxBarSize={24} />
              <Line
                dataKey="net"
                type="monotone"
                stroke="var(--foreground)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--foreground)", stroke: "var(--background)", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
