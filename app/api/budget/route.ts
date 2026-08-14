import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request) {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    if (!session) {
        return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { type, category, target } = await request.json()

    const budget = await prisma.budget.upsert({
        where: {
            authorId_type_category: {
                authorId: session.userId,
                type,
                category,
            },
        },
        update: { target },
        create: { authorId: session.userId, type, category, target },
    })

    return Response.json(budget)
}
