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
    <div className="flex items-center gap-4 py-1.5">
      <p className="w-32 shrink-0 text-sm text-zinc-700 dark:text-zinc-300">{category}</p>

      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>

      <div className="w-40 shrink-0 text-right text-sm font-medium whitespace-nowrap text-zinc-900 dark:text-zinc-100">
        ${actual.toFixed(2)} / {target != null ? `$${target.toFixed(2)}` : "not set"}
      </div>
    </div>
  )
}
