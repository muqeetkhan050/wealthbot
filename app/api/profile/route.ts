import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { prisma } from "@/lib/prisma"

const PICTURE_DIR = path.join(process.cwd(), "public", "uploads", "profile-pictures")

export async function PATCH(request: Request) {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    if (!session) {
        return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const formData = await request.formData()
    const dateOfBirth = formData.get("dateOfBirth") as string | null
    const monthlyIncome = formData.get("monthlyIncome") as string | null
    const picture = formData.get("profilePicture")

    let profilePicturePath: string | undefined

    if (picture instanceof File && picture.size > 0) {
        await mkdir(PICTURE_DIR, { recursive: true })
        const safeName = `${session.userId}-${Date.now()}-${picture.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
        const buffer = Buffer.from(await picture.arrayBuffer())
        await writeFile(path.join(PICTURE_DIR, safeName), buffer)
        profilePicturePath = `/uploads/profile-pictures/${safeName}`
    }

    const user = await prisma.user.update({
        where: { id: session.userId },
        data: {
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            monthlyIncome: monthlyIncome ? Number(monthlyIncome) : undefined,
            ...(profilePicturePath ? { profilePicture: profilePicturePath } : {}),
        },
    })

    return Response.json({
        dateOfBirth: user.dateOfBirth,
        monthlyIncome: user.monthlyIncome,
        profilePicture: user.profilePicture,
    })
}
