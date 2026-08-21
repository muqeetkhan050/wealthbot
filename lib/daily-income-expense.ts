import { monthKey } from "@/lib/expense-date"

export function daysInMonth(key: string) {
    const [year, month] = key.split("-").map(Number)
    return new Date(year, month, 0).getDate()
}

export type DailyTransaction = { description: string; amount: number }
export type DailySpending = { day: number; total: number; transactions: DailyTransaction[] }

export function monthlyDailySpending(
    items: { amount: number; date: string | Date; description: string | null }[],
    selectedMonth: string
): DailySpending[] {
    const totalDays = daysInMonth(selectedMonth)
    const rows: DailySpending[] = Array.from({ length: totalDays }, (_, i) => ({
        day: i + 1,
        total: 0,
        transactions: [],
    }))

    for (const item of items) {
        if (monthKey(item.date) !== selectedMonth) continue
        const day = new Date(item.date).getDate()
        rows[day - 1].total += item.amount
        rows[day - 1].transactions.push({
            description: item.description?.trim() || "No description",
            amount: item.amount,
        })
    }

    return rows
}
