import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/PageHeading";
import { MENTORS } from "@/data/skillbridge";

export const Route = createFileRoute("/mentors")({
  head: () => ({ meta: [{ title: "Mentors — SkillBridge" }, { name: "description", content: "Connect with professional mentors who help refugees rebuild careers, in their own language." }, { property: "og:title", content: "Mentors — SkillBridge" }, { property: "og:description", content: "Connect with professional mentors who help refugees rebuild careers, in their own language." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Mentors,
});

const AREAS = ["All", "Healthcare", "Engineering", "Finance", "Tech", "Education", "Trades"];

function Mentors() {
  const [area, setArea] = useState("All");
  const [requested, setRequested] = useState<string[]>([]);
  const list = MENTORS.filter((m) => area === "All" || m.expertise.includes(area));
  return (
    <>
      <PageHeading eyebrow="Mentorship" title="Find your mentor" text="Professionals — many of them former refugees — volunteering to help you navigate recognition, interviews and networks." />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by area">
          {AREAS.map((a) => <button key={a} aria-pressed={area === a} onClick={() => setArea(a)} className={"rounded-full border px-4 py-1.5 text-sm " + (area === a ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-accent")}>{a}</button>)}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => {
            const r = requested.includes(m.name);
            return (
              <div key={m.name} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">{m.name.split(" ").slice(-2).map((w) => w[0]).join("")}</div>
                <h2 className="mt-4 text-xl font-semibold">{m.name}</h2>
                <p className="text-sm text-muted-foreground">{m.role}</p>
                <p className="mt-3 flex-1 text-sm italic">"{m.story}"</p>
                <p className="mt-3 text-xs text-accent">Speaks: {m.langs.join(", ")}</p>
                <button disabled={r} onClick={() => { setRequested([...requested, m.name]); toast.success("Request sent to " + m.name); }} className="mt-4 rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:bg-secondary disabled:text-secondary-foreground">{r ? "Request sent ✓" : "Request mentorship"}</button>
              </div>
            );
          })}
        </div>
        <div className="mt-14 rounded-2xl bg-secondary p-8 text-center">
          <h2 className="text-2xl font-semibold">Want to give back?</h2>
          <p className="mt-2 text-muted-foreground">One hour a month can change someone's career.</p>
          <button onClick={() => toast.success("Thank you! We'll be in touch about mentoring.")} className="mt-4 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground">Become a mentor</button>
        </div>
      </div>
    </>
  );
}
