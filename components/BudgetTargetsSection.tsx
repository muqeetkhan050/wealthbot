'use client'

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetTargetRow } from "@/components/BudgetTargetRow"
import { groupExpenseRows, type BudgetRow } from "@/lib/budget"

export function BudgetTargetsSection({
    title,
    type,
    rows,
    grouped = false,
}: {
    title: string
    type: "INCOME" | "EXPENSE"
    rows: BudgetRow[]
    grouped?: boolean
}) {
    const router = useRouter()

    async function saveTarget(category: string, target: number) {
        await fetch("/api/budget", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, category, target }),
        })
        router.refresh()
    }

    const groups = grouped ? groupExpenseRows(rows) : [{ group: null, rows }]

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {rows.length === 0 ? (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No categories yet.</p>
                ) : (
                    <div className="space-y-4">
                        {groups.map(({ group, rows: groupRows }) => (
                            <div key={group ?? "ungrouped"}>
                                {group && (
                                    <h4 className="mb-1 text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                                        {group}
                                    </h4>
                                )}
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {groupRows.map((row) => (
                                        <BudgetTargetRow
                                            key={row.category}
                                            category={row.category}
                                            actual={row.actual}
                                            target={row.target}
                                            onSave={(value) => saveTarget(row.category, value)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
