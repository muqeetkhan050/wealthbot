export type BudgetRow = { category: string; actual: number; target: number | null }

export function toBudgetRows(
    items: { category: string; amount: number }[],
    budgets: { type: "INCOME" | "EXPENSE"; category: string; target: number }[],
    type: "INCOME" | "EXPENSE"
): BudgetRow[] {
    const totals = new Map<string, number>()
    for (const item of items) {
        totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount)
    }
    const targets = new Map(
        budgets.filter((b) => b.type === type).map((b) => [b.category, b.target])
    )
    return [...totals].map(([category, actual]) => ({
        category,
        actual,
        target: targets.get(category) ?? null,
    }))
}
