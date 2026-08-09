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
    <aside
      className="flex w-56 shrink-0 flex-col rounded-2xl p-4"
      style={{ backgroundColor: "#CCD1B0" }}
    >
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-2 text-sm font-medium ${
                isActive
                  ? "text-white"
                  : "text-zinc-700 hover:bg-black/5 dark:text-zinc-700"
              }`}
              style={isActive ? { backgroundColor: "#0F472E" } : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto w-full rounded-2xl px-4 py-2 text-sm font-medium text-white"
        style={{ backgroundColor: "#0F472E" }}
      >
        Logout
      </button>
    </aside>
  );
}
