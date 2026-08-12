import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import UploadDocument from "@/components/uploadcomponent"
import { CategorySpendDonut } from "@/components/CategorySpendDonut"

export default async function Dashboard() {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    const allExpenses = session
        ? await prisma.expense.findMany({
              where: { authorId: session.userId },
          })
        : []

    return (
        <div>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Dashboard</h2>

            <h3 className="mt-8 text-sm font-semibold text-zinc-700 dark:text-zinc-300">All time</h3>
            <div className="mt-4">
                <CategorySpendDonut expenses={allExpenses} />
            </div>

            <div className="mt-8">
                <UploadDocument />
            </div>
        </div>
    )
}
