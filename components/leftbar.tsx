"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {useRouter} from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/expenses", label: "Expenses" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/summaryTalk", label: "Summarytalk" },
];

export default function Leftbar() {
  const pathname = usePathname();
  const router=useRouter()

async function handleLogout() {
    const res = await fetch('/api/logout', { method: 'POST' })
    if (res.ok) {
        router.push('/login')
    }
}






  return (
    <aside className="w-56 shrink-0 border-r border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                  : "text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-4 rounded bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
      >
        Logout
      </button>
    </aside>
  );
}
