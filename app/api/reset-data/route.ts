import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/session"

export async function DELETE() {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.$transaction([
        prisma.expense.deleteMany({ where: { authorId: session.userId } }),
        prisma.income.deleteMany({ where: { authorId: session.userId } }),
        prisma.budget.deleteMany({ where: { authorId: session.userId } }),
        prisma.holding.deleteMany({ where: { authorId: session.userId } }),
    ])

    return Response.json({ ok: true })
}
