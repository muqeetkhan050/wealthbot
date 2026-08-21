import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import UploadDocument from "@/components/uploadcomponent"
import { CategorySpendDonut } from "@/components/CategorySpendDonut"
import { BudgetSection } from "@/components/BudgetSection"
import { IncomeExpenseStatement } from "@/components/IncomeExpenseStatement"
import { IncomeExpenseTrendChart } from "@/components/IncomeExpenseTrendChart"
import { CategorySpendTrendChart } from "@/components/CategorySpendTrendChart"
import { InteractiveIncomeExpenseChart } from "@/components/InteractiveIncomeExpenseChart"
import { toBudgetRows } from "@/lib/budget"
import { ALL_KNOWN_EXPENSE_CATEGORIES } from "@/lib/budget-categories"

export default async function Dashboard() {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    const [allExpenses, allIncomes, budgets] = session
        ? await Promise.all([
              prisma.expense.findMany({ where: { authorId: session.userId } }),
              prisma.income.findMany({ where: { authorId: session.userId } }),
              prisma.budget.findMany({ where: { authorId: session.userId } }),
          ])
        : [[], [], []]

    return (
        <div>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Dashboard</h2>

            <div className="mt-4">
                <InteractiveIncomeExpenseChart income={allIncomes} expenses={allExpenses} />
            </div>

            <div className="mt-6">
                <IncomeExpenseTrendChart income={allIncomes} expenses={allExpenses} />
            </div>

            <div className="mt-6">
                <CategorySpendTrendChart items={allExpenses} />
            </div>

            <div className="mt-6 overflow-x-auto">
                <IncomeExpenseStatement income={allIncomes} expenses={allExpenses} />
            </div>

            <div className="mt-8 space-y-6">
                <BudgetSection title="Income" rows={toBudgetRows(allIncomes, budgets, "INCOME")} />
                <BudgetSection
                    title="Expenses"
                    rows={toBudgetRows(allExpenses, budgets, "EXPENSE", ALL_KNOWN_EXPENSE_CATEGORIES)}
                    grouped
                />
            </div>

            <h3 className="mt-8 text-sm font-semibold text-zinc-700 dark:text-zinc-300">All time</h3>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
                <CategorySpendDonut title="Income by Category" centerLabel="Earned" items={allIncomes} />
                <CategorySpendDonut title="Expenses by Category" centerLabel="Spent" items={allExpenses} />
            </div>

            <div className="mt-8">
                <UploadDocument />
            </div>
        </div>
    )
}
