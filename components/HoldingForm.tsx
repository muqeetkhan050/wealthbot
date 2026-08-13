'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function HoldingForm() {
    const router = useRouter()
    const [symbol, setSymbol] = useState("")
    const [shares, setShares] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        const res = await fetch("/api/holdings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbol, shares: parseFloat(shares) }),
        })

        setSubmitting(false)

        if (!res.ok) {
            const data = await res.json().catch(() => null)
            setError(data?.error ?? "Something went wrong.")
            return
        }

        setSymbol("")
        setShares("")
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="grid gap-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="AAPL" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="shares">Shares</Label>
                <Input id="shares" type="number" step="any" value={shares} onChange={(e) => setShares(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting}>
                {submitting ? "Adding…" : "Add"}
            </Button>
        </form>
    )
}
