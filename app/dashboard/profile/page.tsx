import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/ProfileForm"
import { BudgetTargetsSection } from "@/components/BudgetTargetsSection"
import { AddIncomeForm } from "@/components/AddIncomeForm"
import { toBudgetRows } from "@/lib/budget"

export default async function Profile() {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)
    const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null

    if (!user) {
        return null
    }

    const [allExpenses, allIncomes, budgets] = await Promise.all([
        prisma.expense.findMany({ where: { authorId: user.id } }),
        prisma.income.findMany({ where: { authorId: user.id } }),
        prisma.budget.findMany({ where: { authorId: user.id } }),
    ])

    return (
        <div className="w-full space-y-8">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Profile</h2>
            <div className="mt-4">
                <ProfileForm
                    email={user.email}
                    dateOfBirth={user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : null}
                    monthlyIncome={user.monthlyIncome}
                    profilePicture={user.profilePicture}
                />
            </div>

            <AddIncomeForm />

            <BudgetTargetsSection
                title="Income budgets"
                type="INCOME"
                rows={toBudgetRows(allIncomes, budgets, "INCOME")}
            />
            <BudgetTargetsSection
                title="Expense budgets"
                type="EXPENSE"
                rows={toBudgetRows(allExpenses, budgets, "EXPENSE")}
            />
        </div>
    )
}
