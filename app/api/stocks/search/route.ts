// app/api/stocks/search/route.ts
import { searchSymbols } from "@/lib/stocks"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")
    if (!q) return Response.json([])

    const results = await searchSymbols(q)
    return Response.json(results)
}
