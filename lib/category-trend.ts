import { monthKey, monthShortLabel } from "@/lib/expense-date"

type CategoryItem = { category: string; amount: number; date: string | Date }

export function monthlyCategoryTotals(items: CategoryItem[], maxCategories = 7) {
    const categoryTotals = new Map<string, number>()
    for (const item of items) {
        categoryTotals.set(item.category, (categoryTotals.get(item.category) ?? 0) + item.amount)
    }

    const sorted = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])
    const topCategories = sorted.slice(0, maxCategories).map(([category]) => category)
    const topSet = new Set(topCategories)
    const hasOverflow = sorted.length > maxCategories

    const byMonth = new Map<string, { key: string; shortLabel: string; values: Record<string, number> }>()
    for (const item of items) {
        const key = monthKey(item.date)
        if (!byMonth.has(key)) {
            byMonth.set(key, { key, shortLabel: monthShortLabel(key), values: {} })
        }
        const bucket = topSet.has(item.category) ? item.category : "Other"
        const entry = byMonth.get(key)!
        entry.values[bucket] = (entry.values[bucket] ?? 0) + item.amount
    }

    const rows = [...byMonth.values()]
        .sort((a, b) => a.key.localeCompare(b.key))
        .map(({ key, shortLabel, values }) => ({ key, shortLabel, ...values }))

    const categories = [...topCategories, ...(hasOverflow ? ["Other"] : [])]

    return { rows, categories }
}
