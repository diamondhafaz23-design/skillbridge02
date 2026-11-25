import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useAccount } from "@/components/AccountProvider";
import { directoryOptions, accountOptions } from "@/lib/skillbridge-queries";
import { useState } from "react";
import { toast } from "sonner";
import { Search, BriefcaseBusiness, Languages, Clock, UserRound } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MentorDialog } from "@/components/MentorDialog";
import { DIRECTORY_MENTORS, INDUSTRIES, LANGUAGES, filterMentors, type Mentor } from "@/data/mentors";

export const Route = createFileRoute("/mentors")({
  head: () => ({ meta: [{ title: "Mentors — SkillBridge" }, { name: "description", content: "Connect with professional mentors who help refugees rebuild careers, in their own language." }, { property: "og:title", content: "Mentors — SkillBridge" }, { property: "og:description", content: "Connect with professional mentors who help refugees rebuild careers, in their own language." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(directoryOptions),
  component: Mentors,
});

function Mentors() {
  const { user } = useAccount();
  const account = useQuery(accountOptions(user?.id));
  const { data: directory } = useSuspenseQuery(directoryOptions);
  const [area, setArea] = useState("All");
  const [language, setLanguage] = useState("All");
  const [query, setQuery] = useState("");
  const [requested, setRequested] = useState<string[]>([]);
  const [active, setActive] = useState<{ mentor: Mentor; mode: "profile" | "request" } | null>(null);
  const list = filterMentors(directory.mentors, query, area, language);
  function clearFilters() { setArea("All"); setLanguage("All"); setQuery(""); }
  const selectClass = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <>
      <PageHeading eyebrow="Mentorship" title="Find your mentor" text="Professionals — many of them former refugees — volunteering to help you navigate recognition, interviews and networks." />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="mb-6 text-sm text-muted-foreground"><span className="font-semibold text-primary">Sample mentor directory.</span> All profiles, employer affiliations and experience shown here are fictional demonstration data.</p>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <div><label htmlFor="mentor-search" className="mb-2 block text-sm font-medium">Search mentors</label><div className="relative"><Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="mentor-search" type="search" placeholder="Name, profession or skill" maxLength={200} value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 pl-9" /></div></div>
          <div><label htmlFor="mentor-industry" className="mb-2 block text-sm font-medium">Professional industry</label><select id="mentor-industry" className={selectClass} value={area} onChange={(e) => setArea(e.target.value)}>{INDUSTRIES.map((industry) => <option key={industry} value={industry}>{industry === "All" ? "All industries" : industry}</option>)}</select></div>
          <div><label htmlFor="mentor-language" className="mb-2 block text-sm font-medium">Language</label><select id="mentor-language" className={selectClass} value={language} onChange={(e) => setLanguage(e.target.value)}><option value="All">All languages</option>{LANGUAGES.map((lang) => <option key={lang}>{lang}</option>)}</select></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by area">
          {INDUSTRIES.map((a) => <Button key={a} variant={area === a ? "default" : "outline"} aria-pressed={area === a} onClick={() => setArea(a)} className="rounded-full">{a}</Button>)}
        </div>
        <div className="mt-6 flex min-h-9 items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{list.length} {list.length === 1 ? "mentor" : "mentors"} found</p>
          {(query || area !== "All" || language !== "All") && <Button variant="ghost" onClick={clearFilters}>Clear filters</Button>}
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => {
            const r = Boolean(user && account.data?.requests.some(request => request.mentor_id === m.id && request.status === "pending"));
            return (
              <article key={m.id} aria-label={m.name} className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between gap-3"><div aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">{m.name.split(" ").slice(-2).map((w) => w[0]).join("")}</div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">Sample profile</span></div>
                <h2 className="mt-4 text-xl font-semibold">{m.name}</h2>
                <p className="text-sm text-muted-foreground">{m.role}</p>
                <dl className="mt-4 space-y-2 text-sm"><div className="flex items-start gap-2"><BriefcaseBusiness aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><dt className="sr-only">Industry</dt><dd>{m.industry}</dd></div><div className="flex items-start gap-2"><Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><dt className="sr-only">Experience</dt><dd>{m.experience} years of experience</dd></div><div className="flex items-start gap-2"><Languages aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><dt className="sr-only">Languages</dt><dd>{m.langs.join(", ")}</dd></div></dl>
                <p className="mt-4 text-sm italic">"{m.story}"</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{m.bio.split(". ")[0]}.</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{m.skills.map((skill) => <span key={skill} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{skill}</span>)}</div>
                <div className="mt-5 grid gap-2"><Button variant="outline" className="w-full rounded-full" aria-label={`View Profile: ${m.name}`} onClick={() => setActive({ mentor: m, mode: "profile" })}><UserRound aria-hidden="true" />View Profile</Button><Button disabled={r} aria-label={`Request Mentorship: ${m.name}`} onClick={() => setActive({ mentor: m, mode: "request" })} className="w-full rounded-full disabled:bg-secondary disabled:text-secondary-foreground">{r ? "Request saved ✓" : "Request Mentorship"}</Button></div>
              </article>
            );
          })}
        </div>
        {list.length === 0 && <div className="py-16 text-center"><h2 className="text-2xl font-semibold">No mentors found</h2><p className="mt-2 text-muted-foreground">No sample profiles match your search and filters.</p><Button variant="outline" className="mt-4 rounded-full" onClick={clearFilters}>Clear filters</Button></div>}
        {user && <section className="mt-10 border-t border-border pt-6"><h2 className="text-2xl font-semibold">Your private requests</h2>{account.isPending ? <p role="status">Loading requests…</p> : account.isError ? <p role="alert">Could not load your requests. <Button variant="link" onClick={() => account.refetch()}>Try again</Button></p> : account.data?.requests.length ? <ul className="mt-4 space-y-3">{account.data.requests.map(r => <li key={r.id} className="border-b border-border pb-3"><p className="font-semibold">{directory.mentors.find(m => m.id === r.mentor_id)?.name ?? "Mentor"} · {r.status}</p><p className="mt-1 text-sm">{r.message}</p><p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()} · Saved privately; sample mentors are not contacted.</p></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">No requests saved yet.</p>}</section>}
        <div className="mt-14 rounded-2xl bg-secondary p-8 text-center">
          <h2 className="text-2xl font-semibold">Want to give back?</h2>
          <p className="mt-2 text-muted-foreground">One hour a month can change someone's career.</p>
          <Button onClick={() => toast.success("Thank you for your interest!", { description: "This is a demonstration. Mentor registration is not yet available and your interest has not been saved." })} className="mt-4 h-auto rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:bg-accent/90">Become a mentor</Button>
        </div>
      </div>
      {active && <MentorDialog key={`${active.mentor.id}-${active.mode}`} mentor={active.mentor} mode={active.mode} onClose={() => setActive(null)} onRequest={() => setActive({ mentor: active.mentor, mode: "request" })} onSubmitted={() => setRequested((previous) => previous.includes(active.mentor.id) ? previous : [...previous, active.mentor.id])} />}
    </>
  );
}
