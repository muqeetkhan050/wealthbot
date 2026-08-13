import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import { getStockQuote } from "@/lib/stocks"

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { symbol, shares } = await request.json()

    if (!symbol || typeof shares !== "number" || shares <= 0) {
        return Response.json({ error: "Invalid symbol or shares" }, { status: 400 })
    }

    const normalizedSymbol = symbol.toUpperCase()
    const quote = await getStockQuote(normalizedSymbol)

    if (!quote) {
        return Response.json({ error: "Unknown ticker symbol" }, { status: 400 })
    }

    const holding = await prisma.holding.create({
        data: {
            symbol: normalizedSymbol,
            shares,
            authorId: session.userId,
        },
    })

    return Response.json(holding, { status: 201 })
}
