import "server-only"

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY!
const BASE_URL = "https://www.alphavantage.co/query"

export type StockQuote = {
    symbol: string
    price: number
    open: number
    high: number
    low: number
    previousClose: number
    change: number
    changePercent: number
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return null

    const data = await res.json()
    const q = data["Global Quote"]
    if (!q || !q["05. price"]) return null

    return {
        symbol,
        price: parseFloat(q["05. price"]),
        open: parseFloat(q["02. open"]),
        high: parseFloat(q["03. high"]),
        low: parseFloat(q["04. low"]),
        previousClose: parseFloat(q["08. previous close"]),
        change: parseFloat(q["09. change"]),
        changePercent: parseFloat((q["10. change percent"] ?? "0").replace("%", "")),
    }
}

export type PricePoint = {
    date: string
    open: number
    high: number
    low: number
    close: number
}

export async function getDailyHistory(symbol: string): Promise<PricePoint[] | null> {
    const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${API_KEY}`
    const res = await fetch(url, { next: { revalidate: 21600 } }) // 6 hours
    if (!res.ok) return null

    const data = await res.json()
    const series = data["Time Series (Daily)"]
    if (!series) return null

    return Object.entries(series)
        .map(([date, v]: [string, any]) => ({
            date,
            open: parseFloat(v["1. open"]),
            high: parseFloat(v["2. high"]),
            low: parseFloat(v["3. low"]),
            close: parseFloat(v["4. close"]),
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
}

export async function getIntradayHistory(symbol: string): Promise<PricePoint[] | null> {
    const url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${encodeURIComponent(symbol)}&interval=15min&outputsize=compact&apikey=${API_KEY}`
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return null

    const data = await res.json()
    const series = data["Time Series (15min)"]
    if (!series) return null

    return Object.entries(series)
        .map(([date, v]: [string, any]) => ({
            date,
            open: parseFloat(v["1. open"]),
            high: parseFloat(v["2. high"]),
            low: parseFloat(v["3. low"]),
            close: parseFloat(v["4. close"]),
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
}

export type SymbolMatch = {
    symbol: string
    name: string
}

export async function searchSymbols(query: string): Promise<SymbolMatch[]> {
    const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return []

    const data = await res.json()
    const matches = data["bestMatches"] ?? []

    return matches.map((m: any) => ({
        symbol: m["1. symbol"],
        name: m["2. name"],
    }))
}
