// app/api/stocks/quote/route.ts
import { getStockQuote } from "@/lib/stocks"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")
    if (!symbol) return Response.json({ error: "Missing symbol" }, { status: 400 })

    const quote = await getStockQuote(symbol.toUpperCase())
    if (!quote) return Response.json({ error: "Unknown symbol" }, { status: 404 })

    return Response.json(quote)
}
