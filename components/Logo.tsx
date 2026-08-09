import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-white"
        style={{ backgroundColor: "#0F472E" }}
      >
        W
      </span>
      <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        WealthBot
      </span>
    </Link>
  );
}
