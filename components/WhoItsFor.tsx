"use client";

import { useState } from "react";

const personas = {
  individuals: {
    tab: "Individuals",
    heading: ["Built for the people who", "run their money."],
    items: [
      {
        title: "It plugs into what you already have",
        body: "Your bank, your statements, your spreadsheets. WealthBot connects them all.",
      },
      {
        title: "It does the categorizing for you",
        body: "Every transaction sorted the moment it lands, not at month-end review.",
      },
      {
        title: "It hands you the fix",
        body: "A clear breakdown of where to cut back, plus alerts before you overspend.",
      },
      {
        title: "It backs up your savings goals",
        body: "Every category feeds a living picture of your spending, so goals come with real numbers, not guesswork.",
      },
    ],
    card: {
      label: "TRANSACTION #4821 · Dining",
      headline:
        "Uber Eats charged $42.18 — 3rd order this week. Category: Dining, up 18% vs last month.",
      checks: [
        { text: "Categorized as Dining", done: true },
        { text: "Flagged as spending spike", done: true },
        { text: "Added to monthly budget alert", done: false },
      ],
      footerLeft: "Verifying in statement data…",
      footerRight: "est. −$126/mo",
    },
  },
  freelancers: {
    tab: "Freelancers",
    heading: ["Built for freelancers", "watching every dollar."],
    items: [
      {
        title: "It separates business from personal",
        body: "Client payments and business expenses split out automatically, no manual tagging.",
      },
      {
        title: "It tracks income as it varies",
        body: "See your real monthly average, not just this month's number.",
      },
      {
        title: "It sets aside for taxes",
        body: "WealthBot estimates what to hold back from every payout, before you spend it.",
      },
      {
        title: "It backs up your quarterly filing",
        body: "Every category traces back to a statement line, so tax season isn't a scramble.",
      },
    ],
    card: {
      label: "TRANSACTION #5183 · Client payment",
      headline:
        "Payment received $2,400 — Acme Co. Category: Business income, tax set-aside applied.",
      checks: [
        { text: "Categorized as Business income", done: true },
        { text: "30% set aside for taxes", done: true },
        { text: "Added to quarterly estimate", done: false },
      ],
      footerLeft: "Verifying in statement data…",
      footerRight: "set aside +$720",
    },
  },
  families: {
    tab: "Families",
    heading: ["Built for families running", "one budget together."],
    items: [
      {
        title: "It plugs into every account",
        body: "Joint accounts, individual cards, and savings goals, all pulled into one place.",
      },
      {
        title: "It does the sorting for you",
        body: "Groceries, school costs, subscriptions, categorized the moment they land.",
      },
      {
        title: "It hands you the fix",
        body: "A shared alert when spending drifts from the plan, before it becomes a problem.",
      },
      {
        title: "It backs up your family goals",
        body: "Every category feeds a shared picture of your spending, so saving for what matters comes with real numbers.",
      },
    ],
    card: {
      label: "TRANSACTION #6027 · Household",
      headline:
        "Grocery spend $612 this month — up 22% vs budget. Category: Household, shared account.",
      checks: [
        { text: "Categorized as Household", done: true },
        { text: "Flagged over shared budget", done: true },
        { text: "Notified both account holders", done: false },
      ],
      footerLeft: "Verifying in statement data…",
      footerRight: "over budget +$112",
    },
  },
} as const;

type PersonaKey = keyof typeof personas;

export default function WhoItsFor() {
  const [active, setActive] = useState<PersonaKey>("individuals");
  const persona = personas[active];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p
          className="font-mono text-xs font-semibold tracking-widest uppercase"
          style={{ color: "#0F472E" }}
        >
          Who it&apos;s for
        </p>

        <div className="mt-4 flex gap-8 border-b border-zinc-200 dark:border-zinc-800">
          {(Object.keys(personas) as PersonaKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className="cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors"
              style={{
                borderColor: active === key ? "#0F472E" : "transparent",
                color: active === key ? "#0F472E" : undefined,
              }}
            >
              <span
                className={
                  active === key
                    ? ""
                    : "text-zinc-500 dark:text-zinc-400"
                }
              >
                {personas[key].tab}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-4xl leading-tight font-bold text-zinc-900 sm:text-5xl dark:text-zinc-100">
              {persona.heading[0]}
              <br />
              {persona.heading[1]}
            </h2>

            <ol className="mt-8 flex flex-col gap-6">
              {persona.items.map((item, i) => (
                <li key={item.title} className="flex gap-4">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "#0F472E22", color: "#0F472E" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl bg-zinc-950 p-6 text-white">
            <div className="flex items-center justify-between text-xs font-mono tracking-widest text-zinc-400 uppercase">
              <span>WealthBot · Mobile</span>
              <span
                className="rounded-full px-3 py-1 text-[10px] font-semibold"
                style={{ backgroundColor: "#0F472E", color: "#8fe3b8" }}
              >
                Auto-categorized
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-xs tracking-widest text-zinc-500 uppercase">
                {persona.card.label}
              </p>
              <p className="mt-3 font-semibold text-white">
                {persona.card.headline}
              </p>

              <ul className="mt-5 flex flex-col gap-3">
                {persona.card.checks.map((check) => (
                  <li
                    key={check.text}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]"
                      style={{
                        borderColor: check.done ? "#3fae7a" : "#52525b",
                        color: check.done ? "#3fae7a" : "transparent",
                      }}
                    >
                      {check.done ? "✓" : ""}
                    </span>
                    <span className={check.done ? "text-zinc-200" : "text-zinc-500"}>
                      {check.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
              <span>{persona.card.footerLeft}</span>
              <span className="font-semibold" style={{ color: "#3fae7a" }}>
                {persona.card.footerRight}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
