import { EXPENSE_GROUP_ORDER, groupForCategory } from "@/lib/budget-categories"

export type BudgetRow = { category: string; actual: number; target: number | null }
export type BudgetRowGroup = { group: string; rows: BudgetRow[] }

export function toBudgetRows(
    items: { category: string; amount: number }[],
    budgets: { type: "INCOME" | "EXPENSE"; category: string; target: number }[],
    type: "INCOME" | "EXPENSE",
    knownCategories: string[] = []
): BudgetRow[] {
    const totals = new Map<string, number>()
    for (const category of knownCategories) {
        totals.set(category, 0)
    }
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

export function groupExpenseRows(rows: BudgetRow[]): BudgetRowGroup[] {
    const buckets = new Map<string, BudgetRow[]>()
    for (const row of rows) {
        const group = groupForCategory(row.category)
        if (!buckets.has(group)) buckets.set(group, [])
        buckets.get(group)!.push(row)
    }
    return EXPENSE_GROUP_ORDER.filter((group) => buckets.has(group)).map((group) => ({
        group,
        rows: buckets.get(group)!,
    }))
}
