"use client";

import { useEffect, useState } from "react";

type Card = {
  dot: string;
  tag: string;
  status: string;
  title: string;
  sub: string;
};

const leftCards: Card[] = [
  {
    dot: "#c2410c",
    tag: "STATEMENT · CHASE CHECKING",
    status: "NEW",
    title: "3 Uber Eats charges this week",
    sub: "dining, +$126",
  },
  {
    dot: "#a16207",
    tag: "SUBSCRIPTION · NETFLIX",
    status: "RECURRING",
    title: "Renewed for $15.99",
    sub: "entertainment",
  },
  {
    dot: "#7c3aed",
    tag: "ACCOUNT · SAVINGS",
    status: "GOAL",
    title: "Off pace for vacation fund",
    sub: "$340 behind schedule",
  },
];

const rightCards: Card[] = [
  {
    dot: "#0F472E",
    tag: "CATEGORY",
    status: "TAGGED",
    title: "Categorized as Dining",
    sub: "spending pattern updated",
  },
  {
    dot: "#0F472E",
    tag: "BUDGET",
    status: "ALERTED",
    title: "Dining budget notification sent",
    sub: "18% over this month",
  },
  {
    dot: "#0F472E",
    tag: "PLAN",
    status: "VERIFIED",
    title: "Savings plan adjusted",
    sub: "on pace again next cycle",
  },
];

// order in which slots reveal: L0, L1, R0, L2, R1, R2
const order: Array<{ side: "L" | "R"; index: number }> = [
  { side: "L", index: 0 },
  { side: "L", index: 1 },
  { side: "R", index: 0 },
  { side: "L", index: 2 },
  { side: "R", index: 1 },
  { side: "R", index: 2 },
];

const rowY = [36, 210, 384];

function pathFor(side: "L" | "R", index: number) {
  const y = rowY[index];
  if (side === "L") {
    return `M256,${y} C 340,${y} 340,210 416,210`;
  }
  return `M584,210 C 660,210 660,${y} 744,${y}`;
}

export default function SignalsAnimation() {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    function step(count: number) {
      if (cancelled) return;
      setRevealed(count);
      if (count < order.length) {
        timeout = setTimeout(() => step(count + 1), 900);
      } else {
        timeout = setTimeout(() => step(0), 2600);
      }
    }

    step(0);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const isVisible = (side: "L" | "R", index: number) =>
    order.findIndex((o) => o.side === side && o.index === index) < revealed;

  return (
    <div className="mx-auto hidden w-full max-w-5xl px-6 md:block">
      <div className="mb-4 flex justify-between text-xs font-mono font-semibold tracking-widest text-zinc-500 uppercase">
        <span>Signals in</span>
        <span>Actions out</span>
      </div>

      <div className="relative h-[420px] w-full">
        <svg
          viewBox="0 0 1000 420"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {leftCards.map((_, i) => (
            <path
              key={`l-base-${i}`}
              d={pathFor("L", i)}
              fill="none"
              stroke="#e4e4e7"
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          ))}
          {rightCards.map((_, i) => (
            <path
              key={`r-base-${i}`}
              d={pathFor("R", i)}
              fill="none"
              stroke="#e4e4e7"
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          ))}

          {leftCards.map((_, i) => (
            <path
              key={`l-pulse-${i}`}
              d={pathFor("L", i)}
              fill="none"
              stroke="#0F472E"
              strokeWidth={2}
              strokeLinecap="round"
              className="signal-dash-in"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
          {rightCards.map((_, i) => (
            <path
              key={`r-pulse-${i}`}
              d={pathFor("R", i)}
              fill="none"
              stroke="#0F472E"
              strokeWidth={2}
              strokeLinecap="round"
              className="signal-dash-out"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </svg>

        {leftCards.map((card, i) => (
          <div
            key={`left-${i}`}
            className="absolute w-64 rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all duration-1000 ease-out dark:border-zinc-800 dark:bg-zinc-900"
            style={{
              left: 0,
              top: `${rowY[i] - 36}px`,
              opacity: isVisible("L", i) ? 1 : 0,
              transform: isVisible("L", i)
                ? "translateY(0)"
                : "translateY(8px)",
            }}
          >
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              <span className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: card.dot }}
                />
                {card.tag}
              </span>
              <span>{card.status}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {card.title}
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-500">{card.sub}</p>
          </div>
        ))}

        {rightCards.map((card, i) => (
          <div
            key={`right-${i}`}
            className="absolute w-64 rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all duration-1000 ease-out dark:border-zinc-800 dark:bg-zinc-900"
            style={{
              right: 0,
              top: `${rowY[i] - 36}px`,
              opacity: isVisible("R", i) ? 1 : 0,
              transform: isVisible("R", i)
                ? "translateY(0)"
                : "translateY(8px)",
            }}
          >
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              <span className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: card.dot }}
                />
                {card.tag}
              </span>
              <span style={{ color: "#0F472E" }}>{card.status}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {card.title}
            </p>
            <p className="mt-1 font-mono text-xs" style={{ color: "#3fae7a" }}>
              {card.sub}
            </p>
          </div>
        ))}

        <div
          className="absolute flex flex-col items-center justify-center gap-2 rounded-3xl border border-white/30 bg-white/30 p-6 text-center shadow-lg backdrop-blur-md dark:border-zinc-700/30 dark:bg-zinc-900/30"
          style={{
            left: "50%",
            top: "50%",
            width: 168,
            height: 168,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold text-white"
            style={{ backgroundColor: "#0F472E" }}
          >
            W
          </span>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            WealthBot
          </span>
        </div>
      </div>

      <p className="mt-6 text-center font-mono text-xs font-semibold tracking-widest text-zinc-400 uppercase">
        Ingest · Detect · Act · Verify
      </p>
    </div>
  );
}
