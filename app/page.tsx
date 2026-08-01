import { redirect } from "next/navigation";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50">WealthBot</h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Upload your bank statements and let WealthBot categorize your spending automatically.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded bg-zinc-900 px-5 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-black"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
