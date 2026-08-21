import { monthKey } from "@/lib/expense-date"

export function daysInMonth(key: string) {
    const [year, month] = key.split("-").map(Number)
    return new Date(year, month, 0).getDate()
}

export type TransactionPoint = {
    day: number
    date: string
    amount: number
    description: string
    category: string
}

export function monthlyTransactionPoints(
    items: { amount: number; date: string | Date; description: string | null; category: string }[],
    selectedMonth: string
): TransactionPoint[] {
    return items
        .filter((item) => monthKey(item.date) === selectedMonth)
        .map((item) => ({
            day: new Date(item.date).getDate(),
            date: new Date(item.date).toISOString().split("T")[0],
            amount: item.amount,
            description: item.description?.trim() || "No description",
            category: item.category,
        }))
        .sort((a, b) => a.day - b.day)
}
