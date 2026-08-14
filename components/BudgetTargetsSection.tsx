'use client'

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetTargetRow } from "@/components/BudgetTargetRow"
import type { BudgetRow } from "@/lib/budget"

export function BudgetTargetsSection({
    title,
    type,
    rows,
}: {
    title: string
    type: "INCOME" | "EXPENSE"
    rows: BudgetRow[]
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {rows.length === 0 ? (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No categories yet.</p>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {rows.map((row) => (
                            <BudgetTargetRow
                                key={row.category}
                                category={row.category}
                                actual={row.actual}
                                target={row.target}
                                onSave={(value) => saveTarget(row.category, value)}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
