import {prisma} from "@/lib/prisma";



export default async function Analytics(){

    const analyticsData=await prisma.expense.findMany({
        orderBy:{date:"desc"}
    })
     const totals=new Map<string, number>()
for (const expense of analyticsData) {
    const current = totals.get(expense.category) ?? 0
    totals.set(expense.category, current + expense.amount)
}


    return (
      <div>
    <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Analytics</h2>
    <ul className="mt-4 space-y-1">
        {[...totals].map(([category, amount]) => (
            <li key={category} className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">{category}</span>
                <span className="text-black dark:text-zinc-50">${amount.toFixed(2)}</span>
            </li>
        ))}
    </ul>
</div>

    )
}
