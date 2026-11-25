import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/PageHeading";
import { RESOURCES } from "@/data/skillbridge";

export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [{ title: "Resources — SkillBridge" }, { name: "description", content: "Free guides and courses on qualification recognition, right to work, workplace language and in-demand skills." }, { property: "og:title", content: "Resources — SkillBridge" }, { property: "og:description", content: "Free guides and courses on qualification recognition, right to work, workplace language and in-demand skills." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Resources,
});

function Resources() {
  const tags = ["All", ...new Set(RESOURCES.map((r) => r.tag))];
  const [tag, setTag] = useState("All");
  return (
    <>
      <PageHeading eyebrow="Learning & career development" title="Close your skills gaps" text="Free, practical learning picked for displaced professionals." />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap gap-2">{tags.map((t) => <button key={t} aria-pressed={tag === t} onClick={() => setTag(t)} className={"rounded-full border px-4 py-1.5 text-sm " + (tag === t ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{t}</button>)}</div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.filter((r) => tag === "All" || r.tag === tag).map((r) => (
            <button key={r.title} onClick={() => toast("Added to your learning plan", { description: r.title })} className="rounded-2xl border border-border bg-card p-6 text-left transition hover:shadow-soft">
              <BookOpen className="h-6 w-6 text-accent" />
              <p className="mt-3 text-xs font-semibold uppercase text-accent">{r.tag}</p>
              <h2 className="mt-1 text-lg font-semibold">{r.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{r.time}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
