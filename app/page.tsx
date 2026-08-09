import Link from "next/link";
import HomeNav from "@/components/HomeNav";
import Footer from "@/components/Footer";
import WhoItsFor from "@/components/WhoItsFor";
import Logo from "@/components/Logo";
import ResultsAndTeam from "@/components/ResultsAndTeam";
import SignalsAnimation from "@/components/SignalsAnimation";
import { Button } from "@/components/ui/button";

const steps = [
  {
    index: "01",
    label: "Ingest",
    title: "Connect what you have",
    body: "Bank statements, CSV exports, and manual entries — all pulled into one place. Nothing to reconcile by hand.",
  },
  {
    index: "02",
    label: "Detect",
    title: "Learn your spending",
    body: "WealthBot learns your normal spending, then flags unusual charges, subscriptions, and waste in real time.",
  },
  {
    index: "03",
    label: "Act",
    title: "Take the fix",
    body: "See exactly where to cut back, get alerts before you overspend, and adjust budgets on the fly.",
  },
  {
    index: "04",
    label: "Verify",
    title: "Prove the savings",
    body: "Every category traces back to the statement it came from. If it doesn't add up, you'll know.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-4 z-50 mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/30 bg-white/30 px-6 py-3 shadow-lg backdrop-blur-md dark:border-zinc-700/30 dark:bg-zinc-900/30">
        <Logo />
        <HomeNav />
      </header>

      <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 pt-40 pb-32 text-center">
        <p
          className="font-mono text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400"
        >
          AI for personal finance
        </p>
        <h1
          className="text-5xl font-bold leading-tight sm:text-6xl"
          style={{ color: "#0F472E" }}
        >
          AI for the people who
          <br />
          run their money.
        </h1>
        <p className="max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
          Your <span className="font-bold italic">bank statements</span>, transactions, and budgets live in different places. WealthBot pulls them into one place, catches overspending as it starts, categorizes it, and proves where your money went.
        </p>
        <div className="flex gap-4">
          <Button
            nativeButton={false}
            render={<Link href="/login">Login</Link>}
            className="w-32 px-5 py-3 text-base text-white"
            style={{ backgroundColor: "#0F472E" }}
          />
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/register">Register</Link>}
            className="w-32 bg-transparent px-5 py-3 text-base"
            style={{ borderColor: "#0F472E", color: "#0F472E" }}
          />
        </div>

        <div className="mt-16 w-full">
          <SignalsAnimation />
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.index}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p
                className="font-mono text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#0F472E" }}
              >
                {step.index} / {step.label}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl">
          <p
            className="font-mono text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#3fae7a" }}
          >
            Financial twin
          </p>
          <h2 className="mt-4 text-4xl leading-tight font-bold sm:text-5xl">
            Every statement makes the model smarter.
            <br />
            The model makes your next budget smarter.
          </h2>
          <p className="mt-6 max-w-xl text-zinc-400">
            Everything WealthBot ingests and every category it verifies builds
            a living picture of your finances, so each recommendation gets
            sharper than the last.
          </p>
        </div>
      </section>

      <WhoItsFor />
      <ResultsAndTeam />
      <Footer />
    </div>
  );
}
