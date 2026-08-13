'use client'

import { useEffect, useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Quote = {
    symbol: string
    price: number
    open: number
    high: number
    low: number
    previousClose: number
    change: number
    changePercent: number
}

type PricePoint = { date: string; open: number; high: number; low: number; close: number }
type SymbolMatch = { symbol: string; name: string }

const RANGES = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "Max"] as const
type Range = (typeof RANGES)[number]

const chartConfig = {
    close: { label: "Price", color: "#0F472E" },
} satisfies ChartConfig

function sliceDaily(daily: PricePoint[], range: Range): PricePoint[] {
    if (range === "Max") return daily
    const now = new Date()
    const cutoff = new Date(now)

    if (range === "1M") cutoff.setMonth(now.getMonth() - 1)
    else if (range === "6M") cutoff.setMonth(now.getMonth() - 6)
    else if (range === "YTD") cutoff.setMonth(0, 1)
    else if (range === "1Y") cutoff.setFullYear(now.getFullYear() - 1)
    else if (range === "5Y") cutoff.setFullYear(now.getFullYear() - 5)
    else return daily

    const cutoffStr = cutoff.toISOString().slice(0, 10)
    return daily.filter((d) => d.date >= cutoffStr)
}

export function StockChart() {
    const [symbol, setSymbol] = useState("SPY")
    const [name, setName] = useState("S&P 500 (SPY)")
    const [quote, setQuote] = useState<Quote | null>(null)
    const [daily, setDaily] = useState<PricePoint[]>([])
    const [intraday, setIntraday] = useState<PricePoint[]>([])
    const [range, setRange] = useState<Range>("1M")
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SymbolMatch[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            fetch(`/api/stocks/quote?symbol=${symbol}`).then((r) => (r.ok ? r.json() : null)),
            fetch(`/api/stocks/history?symbol=${symbol}&range=daily`).then((r) => (r.ok ? r.json() : [])),
        ]).then(([q, d]) => {
            setQuote(q)
            setDaily(d)
            setLoading(false)
        })
        setIntraday([]) // reset, fetched lazily only if user picks 1D/5D
    }, [symbol])

    useEffect(() => {
        if ((range === "1D" || range === "5D") && intraday.length === 0) {
            fetch(`/api/stocks/history?symbol=${symbol}&range=intraday`)
                .then((r) => (r.ok ? r.json() : []))
                .then(setIntraday)
        }
    }, [range, symbol, intraday.length])

    const chartData = useMemo(() => {
        if (range === "1D") return intraday.slice(-26) // ~1 trading day at 15min bars
        if (range === "5D") return intraday
        return sliceDaily(daily, range)
    }, [range, daily, intraday])

    const fiftyTwoWeek = useMemo(() => {
        const lastYear = daily.slice(-252)
        if (lastYear.length === 0) return null
        return {
            high: Math.max(...lastYear.map((d) => d.high)),
            low: Math.min(...lastYear.map((d) => d.low)),
        }
    }, [daily])

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if (!query.trim()) return
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`)
        setResults(res.ok ? await res.json() : [])
    }

    function pickResult(match: SymbolMatch) {
        setSymbol(match.symbol)
        setName(`${match.name} (${match.symbol})`)
        setResults([])
        setQuery("")
        setRange("1M")
    }

    const isUp = (quote?.change ?? 0) >= 0

    return (
        <div>
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search a company (e.g. Apple)"
                />
                <Button type="submit">Search</Button>
            </form>

            {results.length > 0 && (
                <ul className="mb-6 flex flex-col gap-1 rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
                    {results.map((m) => (
                        <li key={m.symbol}>
                            <button
                                onClick={() => pickResult(m)}
                                className="w-full rounded px-2 py-1 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <span className="font-medium">{m.symbol}</span>{" "}
                                <span className="text-zinc-500">{m.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <p className="text-sm text-zinc-500 dark:text-zinc-400">{name}</p>

            {quote && (
                <div className="mt-1 flex items-baseline gap-3">
                    <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                        ${quote.price.toFixed(2)}
                    </p>
                    <span
                        className={`rounded-full px-2 py-0.5 text-sm font-medium ${
                            isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                    >
                        {isUp ? "+" : ""}
                        {quote.changePercent.toFixed(2)}%
                    </span>
                    <span className={isUp ? "text-green-700" : "text-red-700"}>
                        {isUp ? "+" : ""}
                        {quote.change.toFixed(2)} today
                    </span>
                </div>
            )}

            <div className="mt-4 flex gap-1">
                {RANGES.map((r) => (
                    <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                            range === r
                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                                : "text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {(range === "1D" || range === "5D") && !loading && chartData.length === 0 ? (
                <div className="mt-4 flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-zinc-300 text-center text-sm text-zinc-500 dark:border-zinc-700">
                    Intraday data ({range}) requires a premium Alpha Vantage plan.
                    <br />
                    Try 1M or 6M instead.
                </div>
            ) : (
                <ChartContainer config={chartConfig} className="mt-4 h-64 w-full">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0F472E" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#0F472E" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={40} />
                        <YAxis domain={["auto", "auto"]} tickLine={false} axisLine={false} width={50} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        {quote && (
                            <ReferenceLine
                                y={quote.previousClose}
                                stroke="#a1a1aa"
                                strokeDasharray="4 4"
                            />
                        )}
                        <Area
                            dataKey="close"
                            type="monotone"
                            stroke="#0F472E"
                            strokeWidth={2}
                            fill="url(#stockFill)"
                        />
                    </AreaChart>
                </ChartContainer>
            )}

            {quote && (
                <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-zinc-500">Open</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">${quote.open.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500">High</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">${quote.high.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500">Low</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">${quote.low.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500">Prev close</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">${quote.previousClose.toFixed(2)}</p>
                    </div>
                    {fiftyTwoWeek && (
                        <>
                            <div>
                                <p className="text-zinc-500">52-wk high</p>
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">${fiftyTwoWeek.high.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500">52-wk low</p>
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">${fiftyTwoWeek.low.toFixed(2)}</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {loading && <p className="mt-4 text-sm text-zinc-500">Loading…</p>}
        </div>
    )
}
