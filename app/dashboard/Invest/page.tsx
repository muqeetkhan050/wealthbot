import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import { getStockQuote } from "@/lib/stocks"
import { StockChart } from "@/components/StockChart"
import { HoldingForm } from "@/components/HoldingForm"
import { DeleteHoldingButton } from "@/components/DeleteHoldingButton"

export default async function InvestPage() {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    const holdings = session
        ? await prisma.holding.findMany({ where: { authorId: session.userId } })
        : []

    const uniqueSymbols = [...new Set(holdings.map((h) => h.symbol))]
    const quotes = await Promise.all(uniqueSymbols.map(getStockQuote))
    const priceBySymbol = new Map(
        quotes.filter((q) => q !== null).map((q) => [q.symbol, q.price])
    )

    const rows = holdings.map((h) => {
        const price = priceBySymbol.get(h.symbol) ?? null
        return {
            ...h,
            price,
            value: price !== null ? price * h.shares : null,
        }
    })

    const total = rows.reduce((sum, r) => sum + (r.value ?? 0), 0)

    return (
        <div>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Investing</h2>

            <p className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                ${total.toFixed(2)}
            </p>

            <ul className="mt-6 flex flex-col gap-2">
                {rows.map((r) => (
                    <li key={r.id} className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800">
                        <div>
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">{r.symbol}</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{r.shares} shares</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {r.value !== null ? `$${r.value.toFixed(2)}` : "Price unavailable"}
                            </p>
                            <DeleteHoldingButton id={r.id} />
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mb-10">
    <StockChart />
</div>

            <div className="mt-8">
                <HoldingForm />
            </div>
        </div>
    )
}
