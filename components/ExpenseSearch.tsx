

'use client'

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useRef } from "react"
import { Search } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export default function ExpenseSearch({ resultCount }: { resultCount: number }) {
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
        <InputGroup className="max-w-xs">
            <InputGroupInput
                placeholder="Search expenses..."
                defaultValue={searchParams.get('q')?.toString()}
                onChange={handleChange}
            />
            <InputGroupAddon>
                <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
                {resultCount} {resultCount === 1 ? "result" : "results"}
            </InputGroupAddon>
        </InputGroup>
    )
}
