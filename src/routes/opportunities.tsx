import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useAccount } from "@/components/AccountProvider";
import { Button } from "@/components/ui/button";
import { directoryOptions, accountOptions } from "@/lib/skillbridge-queries";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MapPin, ShieldCheck } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { JOBS, SKILLS } from "@/data/skillbridge";
import { combinedMatch, loadAssessment, selfReportedSkills, verifiedSkills } from "@/data/assessment";

export const Route = createFileRoute("/opportunities")({
  head: () => ({ meta: [{ title: "Opportunities — SkillBridge" }, { name: "description", content: "Discover jobs matched to your existing skills with live match scores and skills gap analysis." }, { property: "og:title", content: "Opportunities — SkillBridge" }, { property: "og:description", content: "Discover jobs matched to your existing skills with live match scores and skills gap analysis." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(directoryOptions),
  component: Opportunities,
});

function Opportunities() {
  const { user, loading } = useAccount();
  const account = useQuery(accountOptions(user?.id));
  const { data: directory } = useSuspenseQuery(directoryOptions);
  const [have, setHave] = useState<string[]>(["Excel", "English", "Accounting"]);
  const [verified, setVerified] = useState<string[]>([]);
  const [fromAssessment, setFromAssessment] = useState(false);
  const [flexOnly, setFlexOnly] = useState(false);
  useEffect(() => {
    if (loading || (user && account.isPending)) return;
    const a = user ? account.data?.assessment : loadAssessment();
    const allSkills = account.data?.skills ?? [];
    if (user) {
      const v = allSkills.filter(s => s.source === 'assessment-supported').map(s => s.skill_name);
      setVerified(v); setHave([...new Set(allSkills.map(s => s.skill_name))]); setFromAssessment(Boolean(a) || allSkills.length > 0); return;
    }
    if (!a) { setHave(["Excel", "English", "Accounting"]); setVerified([]); setFromAssessment(false); return; }
    const v = verifiedSkills(a.quizAnswers);
    setVerified(v); setHave([...new Set([...v, ...selfReportedSkills(a.experience, v)])]); setFromAssessment(true);
  }, [loading, user, account.data, account.isPending]);
  const jobs = useMemo(() => directory.jobs.filter((j) => !flexOnly || j.credentialFlexible).map((j) => ({ ...j, ...combinedMatch(verified, have.filter((s) => !verified.includes(s)), j) })).sort((a, b) => b.score - a.score), [directory.jobs, have, verified, flexOnly]);
  const toggle = (s: string) => setHave((h) => (h.includes(s) ? h.filter((x) => x !== s) : [...h, s]));
  return (
    <>
      <PageHeading eyebrow="Skills-First Matching Engine" title="Opportunities matched to you" text="Select the skills you have. Jobs are ranked by what you can do — and we show the exact gaps to close." />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-20">
          <h2 className="text-lg font-semibold">Your skills</h2>
          <p className="mt-1 text-xs text-muted-foreground">{fromAssessment ? "Loaded from your saved skills profile. ✓ = verified by quiz; others are self-reported and count at 75%." : <>Self-reported skills count at 75%. <Link to="/assessment" className="text-accent underline">Take the assessment</Link> to verify them.</>}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...new Set([...SKILLS, ...have])].map((s) => (
              <button key={s} aria-pressed={have.includes(s)} onClick={() => toggle(s)} className={"rounded-full border px-3 py-1 text-xs font-medium transition " + (have.includes(s) ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent")}>{verified.includes(s) ? "✓ " : ""}{s}</button>
            ))}
          </div>
          <label className="mt-5 flex items-center gap-2 text-sm"><input type="checkbox" checked={flexOnly} onChange={(e) => setFlexOnly(e.target.checked)} className="accent-[var(--accent)]" /> Credential-flexible only</label>
        </aside>
        <ul className="space-y-4">
          <li className="text-sm text-muted-foreground">Sample opportunities and matching results are demonstration data, not live vacancies.</li>
          {user && account.isError && <li role="alert">Could not load your saved skills. <Button variant="link" onClick={() => account.refetch()}>Try again</Button></li>}
          {jobs.map((j) => (
            <li key={j.id} className="rounded-2xl border border-border bg-card p-6 transition hover:shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{j.title}</h3>
                  <p className="text-xs font-medium text-accent">{j.isSample ? "Sample opportunity" : "Opportunity"}</p>
                  <p className="text-sm text-muted-foreground">{j.company} · {j.type}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{j.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl text-accent">{j.score}%</p>
                  <p className="text-xs text-muted-foreground">skills match</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{j.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">Experience: {j.experienceRequirements}</p>
              <div className="mt-3 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-accent transition-all" style={{ width: j.score + "%" }} /></div>
              <div className="mt-4 flex flex-wrap gap-2">
                {j.skills.map((s) => <span key={s} className={"rounded-full px-2.5 py-0.5 text-xs " + (have.includes(s) ? "bg-secondary text-secondary-foreground" : "border border-dashed border-warm")}>{verified.includes(s) ? "✓ Verified: " : have.includes(s) ? "Self-reported: " : "+ "}{s}</span>)}
              </div>
              {j.missing.length > 0 && <p className="mt-3 text-sm">Gap: <b>{j.missing.join(", ")}</b> — <Link to="/resources" className="text-accent underline">see learning paths</Link></p>}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                {j.credentialFlexible ? <span className="flex items-center gap-1 text-xs font-medium text-accent"><ShieldCheck className="h-4 w-4" />Recognises international experience</span> : <span className="text-xs text-muted-foreground">Local certification required</span>}
                <Button onClick={() => toast.info("Demonstration application", { description: "This is a sample listing. No application was sent and no profile was shared." })} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Apply with skills profile</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
