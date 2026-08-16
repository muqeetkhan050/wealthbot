


import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import { CategoryChart } from "@/components/CategoryChart"
import { AnalyticsCharts } from "@/components/AnalyticsCharts"
import { NetIncomeChart } from "@/components/NetIncomeChart"

export default async function Analytics() {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    const [analyticsData, incomeData] = session
        ? await Promise.all([
              prisma.expense.findMany({
                  where: { authorId: session.userId },
                  orderBy: { date: "desc" }
              }),
              prisma.income.findMany({
                  where: { authorId: session.userId },
              }),
          ])
        : [[], []]

    const totals = new Map<string, number>()
    for (const expense of analyticsData) {
        const current = totals.get(expense.category) ?? 0
        totals.set(expense.category, current + expense.amount)
    }

    const chartData = [...totals].map(([category, amount]) => ({ category, amount }))

    return (
        <div>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Analytics</h2>

            <div className="mt-4">
                <NetIncomeChart income={incomeData} expenses={analyticsData} />
            </div>

            <h3 className="mt-8 text-sm font-semibold text-zinc-700 dark:text-zinc-300">By month</h3>
            <div className="mt-4">
                <AnalyticsCharts expenses={analyticsData} />
            </div>

            <h3 className="mt-10 text-sm font-semibold text-zinc-700 dark:text-zinc-300">All time</h3>
            <div className="mx-auto mt-4 max-w-lg">
                <CategoryChart data={chartData} />
            </div>
        </div>
    )
}
