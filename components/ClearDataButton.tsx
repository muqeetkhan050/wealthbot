'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ClearDataButton() {
    const router = useRouter()
    const [confirming, setConfirming] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState("")

    async function handleConfirm() {
        setDeleting(true)
        setError("")

        const res = await fetch("/api/reset-data", { method: "DELETE" })

        setDeleting(false)

        if (!res.ok) {
            setError("Something went wrong. Please try again.")
            return
        }

        setConfirming(false)
        router.refresh()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Clear my data</CardTitle>
                <CardDescription>
                    Permanently deletes all your income, expenses, budgets, and holdings. Your
                    login and profile stay intact. Use this before uploading a fresh statement
                    to start clean.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!confirming ? (
                    <Button type="button" variant="destructive" onClick={() => setConfirming(true)}>
                        Clear my data
                    </Button>
                ) : (
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-destructive">
                            This can&apos;t be undone. Delete all income, expenses, budgets, and
                            holdings?
                        </p>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleConfirm}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting…" : "Yes, delete everything"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setConfirming(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
                {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </CardContent>
        </Card>
    )
}
