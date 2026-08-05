import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(request: Request) {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    if (!session) {
        return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
        return Response.json({ error: "Current and new password are required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } })

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        return Response.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: session.userId }, data: { password: hashedPassword } })

    return Response.json({ success: true })
}
