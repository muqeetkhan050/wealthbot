// app/api/stocks/history/route.ts
import { getDailyHistory, getIntradayHistory } from "@/lib/stocks"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")
    const range = searchParams.get("range") // "intraday" | "daily"

    if (!symbol) return Response.json({ error: "Missing symbol" }, { status: 400 })

    const history = range === "intraday"
        ? await getIntradayHistory(symbol.toUpperCase())
        : await getDailyHistory(symbol.toUpperCase())

    if (!history) return Response.json({ error: "No data" }, { status: 404 })

    return Response.json(history)
}
