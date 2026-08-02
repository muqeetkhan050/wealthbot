'use client'

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useRef } from "react"

export default function ExpenseSearch() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams)
            if (value) {
                params.set('q', value)
            } else {
                params.delete('q')
            }
            router.replace(`${pathname}?${params.toString()}`)
        }, 300)
    }

    return (
        <input
            type="text"
            placeholder="Search expenses..."
            defaultValue={searchParams.get('q')?.toString()}
            onChange={handleChange}
            className="w-full max-w-sm rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
    )
}
