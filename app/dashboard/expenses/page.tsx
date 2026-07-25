import { prisma } from "@/lib/prisma"

export default async function ExpensesPage() {
    const expenses = await prisma.expense.findMany({
        orderBy: { date: "desc" },
    })

    return (
        <div>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Expenses</h2>
            <table className="mt-4 w-full text-sm">
                <thead>
                    <tr className="text-left text-zinc-500 dark:text-zinc-400">
                        <th className="py-2">Date</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Category</th>
                        <th className="py-2 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id} className="border-t border-zinc-200 dark:border-zinc-800">
                            <td className="py-2">{expense.date.toLocaleDateString()}</td>
                            <td className="py-2">{expense.description}</td>
                            <td className="py-2">{expense.category}</td>
                            <td className="py-2 text-right">${expense.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
