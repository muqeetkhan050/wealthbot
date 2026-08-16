'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddIncomeForm() {
    const router = useRouter()
    const [category, setCategory] = useState("")
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(() => new Date().toISOString().split("T")[0])
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        const res = await fetch("/api/income", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, amount: parseFloat(amount), description, date }),
        })

        setSubmitting(false)

        if (!res.ok) {
            const data = await res.json().catch(() => null)
            setError(data?.error ?? "Something went wrong.")
            return
        }

        setCategory("")
        setAmount("")
        setDescription("")
        router.refresh()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add income</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="incomeCategory">Category</Label>
                        <Input
                            id="incomeCategory"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Salary"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="incomeAmount">Amount</Label>
                        <Input
                            id="incomeAmount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="border border-black/40 dark:border-white/40"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="incomeDate">Date</Label>
                        <Input
                            id="incomeDate"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="incomeDescription">Description</Label>
                        <Input
                            id="incomeDescription"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional"
                        />
                    </div>
                    <Button type="submit" disabled={submitting} className="ml-auto">
                        {submitting ? "Adding…" : "Add"}
                    </Button>
                    {error && <p className="w-full text-sm text-destructive">{error}</p>}
                </form>
            </CardContent>
        </Card>
    )
}
