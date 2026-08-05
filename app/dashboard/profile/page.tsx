import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/ProfileForm"

export default async function Profile() {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)
    const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null

    if (!user) {
        return null
    }

    return (
        <div className="max-w-lg">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Profile</h2>
            <div className="mt-4">
                <ProfileForm
                    email={user.email}
                    dateOfBirth={user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : null}
                    monthlyIncome={user.monthlyIncome}
                    profilePicture={user.profilePicture}
                />
            </div>
        </div>
    )
}
