// import { cookies } from "next/headers"
// import { prisma } from "@/lib/prisma"
// import { decrypt } from "@/lib/session"
// import UploadDocument from "@/components/uploadcomponent"
// import { CategorySpendDonut } from "@/components/CategorySpendDonut"
// import { IncomeExpenseStatement } from "@/components/IncomeExpenseStatement"
// import { monthKey, monthLabel } from "@/lib/expense-date"

// export default async function Dashboard() {
//     const cookieStore = await cookies()
//     const session = await decrypt(cookieStore.get('session')?.value)

//     const user = session ? await prisma.user.findUnique({ where: { id: session.userId } })
//         : null

//     const allExpenses = session
//         ? await prisma.expense.findMany({
//               where: { authorId: session.userId },
//           })
//         : []

//     const currentMonth = monthKey(new Date())
//     const monthExpenses = allExpenses.filter((e) => monthKey(e.date) === currentMonth)

//     return (
//         <div>
//             <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Dashboard</h2>

//             <div className="mt-4">
//                 <IncomeExpenseStatement
//                     income={user?.monthlyIncome ?? null}
//                     expenses={monthExpenses}
//                     periodLabel={monthLabel(currentMonth)}
//                 />
//             </div>

//             <h3 className="mt-8 text-sm font-semibold text-zinc-700 dark:text-zinc-300">All time</h3>
//             <div className="mt-4">
//                 <CategorySpendDonut expenses={allExpenses} />
//             </div>

//             <div className="mt-8">
//                 <UploadDocument />
//             </div>
//         </div>
//     )
// }

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import UploadDocument from "@/components/uploadcomponent"
import { CategorySpendDonut } from "@/components/CategorySpendDonut"
import { IncomeExpenseStatement } from "@/components/IncomeExpenseStatement"

export default async function Dashboard() {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    const user = session
        ? await prisma.user.findUnique({ where: { id: session.userId } })
        : null

    const allExpenses = session
        ? await prisma.expense.findMany({
              where: { authorId: session.userId },
          })
        : []

    return (
        <div>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Dashboard</h2>

            <div className="mt-4">
                <IncomeExpenseStatement
                    income={user?.monthlyIncome ?? null}
                    expenses={allExpenses}
                />
            </div>

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
