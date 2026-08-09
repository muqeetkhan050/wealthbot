const stats = [
  {
    value: "Automatic",
    label: "Every transaction categorized the moment it lands, no manual entry.",
  },
  {
    value: "Traced",
    label: "Each category links straight back to the statement line it came from.",
  },
  {
    value: "24/7",
    label: "Continuous monitoring across every account you connect.",
  },
];

const team = [
  {
    name: "Muhammad Muqeet ur rehman",
    title: "Founder & Developer",
    bio: "Add a short bio here — your background and what led you to build WealthBot.",
  },
];

export default function ResultsAndTeam() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p
          className="font-mono text-xs font-semibold tracking-widest uppercase"
          style={{ color: "#0F472E" }}
        >
          Results
        </p>
        <h2 className="mt-4 text-4xl leading-tight font-bold text-zinc-900 sm:text-5xl dark:text-zinc-100">
          Built to save you money.
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="border-t pt-6"
              style={{ borderColor: "#0F472E" }}
            >
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <p
          className="mt-24 font-mono text-xs font-semibold tracking-widest uppercase"
          style={{ color: "#0F472E" }}
        >
          The team
        </p>
        <h2 className="mt-4 text-4xl leading-tight font-bold text-zinc-900 sm:text-5xl dark:text-zinc-100">
          Built for this.
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {team.map((person) => (
            <div
              key={person.name}
              className="max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: "#0F472E" }}
                >
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {person.name}
                  </p>
                  <p
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "#0F472E" }}
                  >
                    {person.title}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                {person.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
