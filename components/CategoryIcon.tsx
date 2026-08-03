import { ShoppingCart, UtensilsCrossed, Car, Receipt, Film, Wallet, type LucideIcon } from "lucide-react"

const categoryIcons: Record<string, LucideIcon> = {
    Groceries: ShoppingCart,
    Dining: UtensilsCrossed,
    Transport: Car,
    Bills: Receipt,
    Entertainment: Film,
}

export function CategoryIcon({ category }: { category: string }) {
    const Icon = categoryIcons[category] ?? Wallet
    return <Icon className="size-4 text-zinc-500 dark:text-zinc-400" />
}
