import { CategoryIcon } from "@/components/CategoryIcon"
    

import { prisma } from "@/lib/prisma"
import ExpenseSearch from "@/components/ExpenseSearch"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function ExpensesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams

    const expenses = await prisma.expense.findMany({
        where: q
            ? { description: { contains: q, mode: "insensitive" } }
            : undefined,
        orderBy: { date: "desc" },
    })

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    return (
        <div>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Expenses</h2>
            <div className="mt-4">
                <ExpenseSearch resultCount={expenses.length} />
            </div>
            <Table className="mt-4">
                <TableCaption>
                    {q ? `Expenses matching "${q}"` : "A list of your expenses."}
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell>{expense.date.toLocaleDateString()}</TableCell>
                            <TableCell className="font-medium">{expense.description}</TableCell>
                            <TableCell>
                                <CategoryIcon category={expense.category} />
                            </TableCell>
                            <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">${total.toFixed(2)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}
