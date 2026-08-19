import {
    ShoppingCart,
    UtensilsCrossed,
    Car,
    Receipt,
    Film,
    Wallet,
    Home,
    Smartphone,
    Zap,
    Stethoscope,
    PiggyBank,
    type LucideIcon,
} from "lucide-react"

const categoryIcons: Record<string, LucideIcon> = {
    Groceries: ShoppingCart,
    Dining: UtensilsCrossed,
    Transport: Car,
    Bills: Receipt,
    Entertainment: Film,
    "Rent/Mortgage": Home,
    "Phone & Internet": Smartphone,
    Utilities: Zap,
    "Medical Expenses": Stethoscope,
    "Emergency Fund": PiggyBank,
}

export function CategoryIcon({ category }: { category: string }) {
    const Icon = categoryIcons[category] ?? Wallet
    return <Icon className="size-4 text-zinc-500 dark:text-zinc-400" />
}
