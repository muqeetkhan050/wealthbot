"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { daysInMonth, monthlyTransactionPoints, type TransactionPoint } from "@/lib/daily-income-expense"
import { monthKey, monthLabel } from "@/lib/expense-date"

const GOOD = "#0ca30c"
const CRITICAL = "#d03b3b"

const chartConfig = {
    income: { label: "Income", color: GOOD },
    expense: { label: "Expense", color: CRITICAL },
} satisfies ChartConfig

type Item = { amount: number; date: string | Date; description: string | null; category: string }
type SeriesKey = "income" | "expense"

function TransactionTooltip({
    active,
    payload,
}: {
    active?: boolean
    payload?: { payload: TransactionPoint }[]
}) {
    if (!active || !payload?.length) return null
    const point = payload[0].payload

    return (
        <div className="grid gap-1 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
            <p className="font-medium text-foreground">
                {new Date(point.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
            <p className="text-foreground">{point.description}</p>
            <p className="font-mono font-semibold text-foreground">${point.amount.toFixed(2)}</p>
        </div>
    )
}

export function InteractiveIncomeExpenseChart({
    income,
    expenses,
}: {
    income: Item[]
    expenses: Item[]
}) {
    const months = useMemo(() => {
        const keys = new Set([...income, ...expenses].map((item) => monthKey(item.date)))
        return [...keys].sort()
    }, [income, expenses])

    const [index, setIndex] = useState(0)
    const [activeChart, setActiveChart] = useState<SeriesKey>("income")

    const currentIndex = Math.min(Math.max(index, 0), Math.max(months.length - 1, 0))
    const selectedMonth = months[currentIndex]

    const incomePoints = useMemo(
        () => (selectedMonth ? monthlyTransactionPoints(income, selectedMonth) : []),
        [income, selectedMonth]
    )
    const expensePoints = useMemo(
        () => (selectedMonth ? monthlyTransactionPoints(expenses, selectedMonth) : []),
        [expenses, selectedMonth]
    )

    const totals = {
        income: incomePoints.reduce((sum, p) => sum + p.amount, 0),
        expense: expensePoints.reduce((sum, p) => sum + p.amount, 0),
    }

    const activePoints = activeChart === "income" ? incomePoints : expensePoints
    const activeColor = activeChart === "income" ? GOOD : CRITICAL

    if (months.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        No income or expenses recorded yet.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle>Income vs Expense</CardTitle>
                    <CardDescription>Every transaction in {monthLabel(selectedMonth)}</CardDescription>
                </div>
                <div className="flex">
                    {(["income", "expense"] as const).map((key) => (
                        <button
                            key={key}
                            type="button"
                            data-active={activeChart === key}
                            className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-black/5 dark:data-[active=true]:bg-white/10 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                            onClick={() => setActiveChart(key)}
                        >
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {chartConfig[key].label}
                            </span>
                            <span className="text-lg leading-none font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
                                ${totals[key].toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <div className="flex items-center justify-center gap-4 pb-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIndex((i) => i - 1)}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <p className="w-40 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {monthLabel(selectedMonth)}
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIndex((i) => i + 1)}
                        disabled={currentIndex === months.length - 1}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>

                {activePoints.length === 0 ? (
                    <p className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        No {chartConfig[activeChart].label.toLowerCase()} transactions in {monthLabel(selectedMonth)}.
                    </p>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
                        <LineChart data={activePoints} margin={{ left: 12, right: 12, top: 8 }}>
                            <CartesianGrid vertical={false} strokeDasharray="0" />
                            <XAxis
                                dataKey="day"
                                type="number"
                                domain={[1, daysInMonth(selectedMonth)]}
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
                            <Tooltip cursor={{ stroke: activeColor, strokeDasharray: "3 3" }} content={<TransactionTooltip />} />
                            <Line
                                dataKey="amount"
                                type="linear"
                                stroke={activeColor}
                                strokeWidth={2}
                                dot={{ r: 4, fill: activeColor, stroke: "var(--background)", strokeWidth: 1 }}
                            />
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
