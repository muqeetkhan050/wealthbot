import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, category, description, date } = await request.json()

    if (typeof amount !== "number" || amount <= 0 || !category) {
        return Response.json({ error: "Invalid amount or category" }, { status: 400 })
    }

    const income = await prisma.income.create({
        data: {
            amount,
            category,
            description: description || null,
            date: date ? new Date(date) : new Date(),
            authorId: session.userId,
        },
    })

    return Response.json(income, { status: 201 })
}
