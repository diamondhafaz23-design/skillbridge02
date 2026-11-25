import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/PageHeading";
import { SKILLS } from "@/data/skillbridge";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Create Your Profile — SkillBridge" }, { name: "description", content: "Build a skills-first professional profile showcasing your skills, education and experience." }, { property: "og:title", content: "Create Your Profile — SkillBridge" }, { property: "og:description", content: "Build a skills-first professional profile showcasing your skills, education and experience." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Profile,
});

const field = "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring";

function Profile() {
  const [step, setStep] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [name, setName] = useState("");
  const steps = ["About you", "Experience", "Skills", "Done"];
  return (
    <>
      <PageHeading eyebrow="Get started" title="Create your skills profile" text="Takes about 5 minutes. Documents are optional — your experience counts." />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <ol className="mb-8 flex gap-2">{steps.map((s, k) => <li key={s} className="flex-1"><div className={"h-1.5 rounded-full " + (k <= step ? "bg-accent" : "bg-muted")} /><p className="mt-1 text-xs text-muted-foreground">{s}</p></li>)}</ol>
        <form onSubmit={(e) => { e.preventDefault(); if (step === 2) toast.success("Profile created!"); setStep(step + 1); }} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          {step === 0 && (<div className="space-y-4">
            <label className="block text-sm font-medium">Full name<input required value={name} onChange={(e) => setName(e.target.value)} className={field} /></label>
            <label className="block text-sm font-medium">Current city<input className={field} placeholder="e.g. Berlin" /></label>
            <label className="block text-sm font-medium">Languages you speak<input className={field} placeholder="Arabic, English" /></label>
          </div>)}
          {step === 1 && (<div className="space-y-4">
            <label className="block text-sm font-medium">Profession / last role<input required className={field} placeholder="e.g. Civil Engineer" /></label>
            <label className="block text-sm font-medium">Years of experience<input type="number" min={0} className={field} /></label>
            <label className="block text-sm font-medium">Highest education (any country)<input className={field} placeholder="BSc Engineering, Damascus University" /></label>
            <p className="rounded-lg bg-secondary p-3 text-sm">Don't have your certificates? That's okay — assessments can verify your skills instead.</p>
          </div>)}
          {step === 2 && (<div>
            <p className="text-sm font-medium">Pick your skills</p>
            <div className="mt-3 flex flex-wrap gap-2">{SKILLS.map((s) => <button type="button" key={s} aria-pressed={skills.includes(s)} onClick={() => setSkills((h) => h.includes(s) ? h.filter((x) => x !== s) : [...h, s])} className={"rounded-full border px-3 py-1 text-sm " + (skills.includes(s) ? "border-accent bg-accent text-accent-foreground" : "border-border")}>{s}</button>)}</div>
          </div>)}
          {step === 3 ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Welcome, {name || "friend"}!</h2>
              <p className="mt-2 text-muted-foreground">{skills.length} skills added. Next, verify them to boost your match scores.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/assessment" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Take assessment</Link>
                <Link to="/opportunities" className="rounded-full border border-border px-6 py-3 font-semibold">Explore opportunities</Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex justify-between">
              <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-full px-5 py-2 font-medium disabled:opacity-30">Back</button>
              <button type="submit" className="rounded-full bg-primary px-6 py-2 font-semibold text-primary-foreground">{step === 2 ? "Create profile" : "Continue"}</button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
