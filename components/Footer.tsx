import Link from "next/link";

export default function Footer() {
  return (
    <>
      <section
        className="px-6 py-24 text-center text-white"
        style={{ backgroundColor: "#0F472E" }}
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl leading-tight font-bold sm:text-5xl">
            See what WealthBot finds in your own spending.
          </h2>
          <p className="mt-6 text-lg text-white/80">
            We&apos;ll connect your accounts and show you what it catches in
            the first statement. No spreadsheets, no manual entry.
          </p>
          <Link
            href="/register"
            className="mt-10 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-900"
          >
            Get started
          </Link>
        </div>
      </section>

      <footer className="bg-zinc-950 px-6 py-10 text-zinc-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white"
              style={{ backgroundColor: "#0F472E" }}
            >
              W
            </span>
            <span className="font-semibold text-white">WealthBot</span>
          </div>

          <p className="text-sm">AI for the people who run their money.</p>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            <a href="#" className="hover:text-white">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white">
              X
            </a>
            <a href="mailto:hello@wealthbot.com" className="hover:text-white">
              hello@wealthbot.com
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
