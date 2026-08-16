'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function BudgetTargetRow({
    category,
    actual,
    target,
    onSave,
}: {
    category: string
    actual: number
    target: number | null
    onSave: (value: number) => Promise<void>
}) {
    const [value, setValue] = useState(target?.toString() ?? "")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    async function handleSave() {
        const parsed = Number(value)
        if (Number.isNaN(parsed) || parsed < 0) return

        setSaving(true)
        setSaved(false)
        await onSave(parsed)
        setSaving(false)
        setSaved(true)
    }

    return (
        <div className="flex items-center gap-3 py-2">
            <p className="w-32 shrink-0 text-sm text-zinc-700 dark:text-zinc-300">{category}</p>
            <p className="w-28 shrink-0 text-sm whitespace-nowrap text-zinc-500 dark:text-zinc-400">
                ${actual.toFixed(2)} spent
            </p>
            <Input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                    setSaved(false)
                }}
                placeholder="Target"
                className="w-28 border border-black/40 dark:border-white/40"
            />
            <div className="ml-auto flex items-center gap-2">
                {saved && <span className="text-xs text-green-600 dark:text-green-400">Saved</span>}
                <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                </Button>
            </div>
        </div>
    )
}
