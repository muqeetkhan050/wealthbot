"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { monthlyCategoryTotals } from "@/lib/category-trend"
import { CATEGORICAL_COLORS } from "@/lib/chart-colors"

type Item = { category: string; amount: number; date: string | Date }

export function CategorySpendTrendChart({ items }: { items: Item[] }) {
    const { rows, categories } = useMemo(() => monthlyCategoryTotals(items), [items])

    const chartConfig = useMemo(
        () =>
            Object.fromEntries(
                categories.map((category, i) => [
                    category,
                    { label: category, color: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length] },
                ])
            ) satisfies ChartConfig,
        [categories]
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Spending by category</CardTitle>
            </CardHeader>
            <CardContent>
                {rows.length === 0 ? (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No expenses recorded yet.</p>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
                        <BarChart data={rows} margin={{ left: 8, right: 8, top: 8 }}>
                            <CartesianGrid vertical={false} strokeDasharray="0" />
                            <XAxis dataKey="shortLabel" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                                width={64}
                            />
                            <ChartTooltip
                                cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            {categories.map((category, i) => (
                                <Bar
                                    key={category}
                                    dataKey={category}
                                    fill={CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length]}
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={24}
                                />
                            ))}
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
