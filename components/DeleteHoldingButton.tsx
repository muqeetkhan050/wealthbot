'use client'

import { useRouter } from "next/navigation"

export function DeleteHoldingButton({ id }: { id: number }) {
    const router = useRouter()

    async function handleDelete() {
        const res = await fetch(`/api/holdings/${id}`, { method: "DELETE" })
        if (res.ok) router.refresh()
    }

    return (
        <button
            onClick={handleDelete}
            className="text-sm text-zinc-400 hover:text-destructive"
        >
            Remove
        </button>
    )
}
