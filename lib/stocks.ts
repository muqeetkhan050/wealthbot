import "server-only"

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY!
const BASE_URL = "https://www.alphavantage.co/query"

export type StockQuote = {
    symbol: string
    price: number
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`

    const res = await fetch(url, {
        next: { revalidate: 300 },
    })

    if (!res.ok) return null

    const data = await res.json()
    const quote = data["Global Quote"]

    if (!quote || !quote["05. price"]) return null

    return {
        symbol,
        price: parseFloat(quote["05. price"]),
    }
}
