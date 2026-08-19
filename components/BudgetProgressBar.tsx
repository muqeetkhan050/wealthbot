import { CategoryIcon } from "@/components/CategoryIcon"
import { TableCell, TableRow } from "@/components/ui/table"

export function BudgetProgressBar({
  category,
  actual,
  target,
  color,
}: {
  category: string
  actual: number
  target: number | null
  color: string
}) {
  const pct = target && target > 0 ? Math.min((actual / target) * 100, 100) : 0

  return (
    <TableRow className="hover:bg-black/5 dark:hover:bg-white/5">
      <TableCell>
        <div className="flex items-center gap-2">
          <CategoryIcon category={category} />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">{category}</span>
        </div>
      </TableCell>
      <TableCell className="text-right text-sm font-medium whitespace-nowrap text-zinc-900 dark:text-zinc-100">
        ${actual.toFixed(2)}
      </TableCell>
      <TableCell className="text-right text-sm font-medium whitespace-nowrap text-zinc-900 dark:text-zinc-100">
        {target != null ? `$${target.toFixed(2)}` : "not set"}
      </TableCell>
      <TableCell className="w-40">
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      </TableCell>
    </TableRow>
  )
}
