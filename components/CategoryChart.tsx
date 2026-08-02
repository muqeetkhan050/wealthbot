'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
    amount: {
        label: "Amount",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function CategoryChart({ data }: { data: { category: string; amount: number }[] }) {
    return (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="category" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
