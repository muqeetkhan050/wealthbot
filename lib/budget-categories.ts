// YNAB-style expense category groups shown on the dashboard/profile budget sections.
export const EXPENSE_CATEGORY_GROUPS: { group: string; categories: string[] }[] = [
    {
        group: "Bills",
        categories: ["Rent/Mortgage", "Phone & Internet", "Utilities", "Bills"],
    },
    {
        group: "Needs",
        categories: ["Groceries", "Transport", "Medical Expenses", "Emergency Fund"],
    },
    {
        group: "Wants",
        categories: ["Dining", "Entertainment"],
    },
]

export const EXPENSE_GROUP_ORDER = [...EXPENSE_CATEGORY_GROUPS.map((g) => g.group), "Other"]

export const ALL_KNOWN_EXPENSE_CATEGORIES = EXPENSE_CATEGORY_GROUPS.flatMap((g) => g.categories)

const CATEGORY_TO_GROUP = new Map(
    EXPENSE_CATEGORY_GROUPS.flatMap(({ group, categories }) => categories.map((c) => [c, group]))
)

export function groupForCategory(category: string): string {
    return CATEGORY_TO_GROUP.get(category) ?? "Other"
}
