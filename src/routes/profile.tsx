import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeading } from "@/components/PageHeading";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/components/AccountProvider";
import { SignInNotice } from "@/components/SignInNotice";
import { SKILLS } from "@/data/skillbridge";
import { splitList } from "@/data/assessment";
import { EMPTY_PROFILE, type ProfileFields } from "@/data/cloud-schemas";
import { accountOptions } from "@/lib/skillbridge-queries";
import { saveProfile } from "@/lib/skillbridge.functions";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Create Your Profile — SkillBridge" }, { name: "description", content: "Build a skills-first professional profile showcasing your skills, education and experience." }, { property: "og:title", content: "Create Your Profile — SkillBridge" }, { property: "og:description", content: "Build a skills-first professional profile showcasing your skills, education and experience." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Profile,
});

const field = "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring";
function Profile() {
  const { user, loading } = useAccount();
  const account = useQuery(accountOptions(user?.id));
  const queryClient = useQueryClient();
  const persist = useServerFn(saveProfile);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ProfileFields>(EMPTY_PROFILE);
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState("");
  const [extra, setExtra] = useState("");
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof ProfileFields>(key: K, value: ProfileFields[K]) => setProfile(p => ({ ...p, [key]: value }));
  useEffect(() => {
    if (!user) { setProfile(EMPTY_PROFILE); setSkills([]); setLanguages(""); setStep(0); return; }
    if (!account.data?.profile) return;
    const p = account.data.profile;
    setProfile({ full_name: p.full_name, professional_title: p.professional_title, work_experience: p.work_experience, years_experience: p.years_experience, education: p.education, languages: p.languages, location: p.location, professional_summary: p.professional_summary });
    setLanguages(p.languages.join(", "));
    setSkills(account.data.skills.filter(s => s.origin === 'profile').map(s => s.skill_name));
  }, [account.data, user]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (step < 2) { setStep(step + 1); return; }
    if (!user) { toast.error("Sign in to save your profile."); return; }
    setBusy(true);
    try { await persist({ data: { profile: { ...profile, languages: splitList(languages) }, skills } }); await queryClient.invalidateQueries({ queryKey: ['account', user.id] }); setStep(3); toast.success("Your private profile is saved"); }
    catch { toast.error("Your profile could not be saved. Please try again."); }
    finally { setBusy(false); }
  }
  const steps = ["About you", "Experience", "Skills", "Done"];
  return <>
    <PageHeading eyebrow="Get started" title="Create your skills profile" text="Your experience counts. No refugee documentation or legal status is collected." />
    <div className="mx-auto max-w-2xl px-4 py-12">
      {!user && !loading && <SignInNotice />}
      {(loading || (user && account.isPending)) ? <p role="status" className="py-6">Loading your profile…</p> : account.isError ? <div role="alert" className="py-6"><p>Could not load your saved profile.</p><Button onClick={() => account.refetch()}>Try again</Button></div> : <>
      <ol className="my-8 flex gap-2">{steps.map((s,k) => <li key={s} className="flex-1"><div className={"h-1.5 rounded-full " + (k <= step ? "bg-accent" : "bg-muted")} /><p className="mt-1 text-xs text-muted-foreground">{s}</p></li>)}</ol>
      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      {step === 0 && <div className="space-y-4">
        <label className="block text-sm font-medium">Full name<input required maxLength={100} value={profile.full_name} onChange={e => set('full_name',e.target.value)} className={field} /></label>
        <label className="block text-sm font-medium">Current city<input value={profile.location} onChange={e => set('location',e.target.value)} className={field} placeholder="e.g. Berlin" /></label>
        <label className="block text-sm font-medium">Languages you speak<input value={languages} onChange={e => setLanguages(e.target.value)} className={field} placeholder="Arabic, English" /></label>
        <label className="block text-sm font-medium">Professional summary<textarea rows={3} value={profile.professional_summary} onChange={e => set('professional_summary',e.target.value)} className={field} /></label>
      </div>}
      {step === 1 && <div className="space-y-4">
        <label className="block text-sm font-medium">Profession / last role<input required value={profile.professional_title} onChange={e => set('professional_title',e.target.value)} className={field} placeholder="e.g. Civil Engineer" /></label>
        <label className="block text-sm font-medium">Years of experience<input type="number" min={0} max={60} value={profile.years_experience} onChange={e => set('years_experience',Number(e.target.value))} className={field} /></label>
        <label className="block text-sm font-medium">Work experience<textarea rows={3} value={profile.work_experience} onChange={e => set('work_experience',e.target.value)} className={field} /></label>
        <label className="block text-sm font-medium">Highest education (any country)<input value={profile.education} onChange={e => set('education',e.target.value)} className={field} placeholder="BSc Engineering, Damascus University" /></label>
        <p className="rounded-lg bg-secondary p-3 text-sm">Don't have your certificates? That's okay — assessments can support your skills instead.</p>
      </div>}
      {step === 2 && <div><p className="text-sm font-medium">Pick your skills — self-reported</p><div className="mt-3 flex flex-wrap gap-2">{[...new Set([...SKILLS,...skills])].map(s => <Button type="button" key={s} variant={skills.includes(s) ? 'default' : 'outline'} size="sm" aria-pressed={skills.includes(s)} onClick={() => setSkills(h => h.includes(s) ? h.filter(x => x !== s) : [...h,s])} className="rounded-full">{s}</Button>)}</div><div className="mt-4 flex gap-2"><label className="sr-only" htmlFor="profile-extra">Add a skill</label><input id="profile-extra" className={field} value={extra} onChange={e => setExtra(e.target.value)} placeholder="Add your own skill" /><Button type="button" variant="outline" onClick={() => { setSkills(h => [...new Set([...h,...splitList(extra)])]); setExtra(''); }}>Add</Button></div></div>}
      {step === 3 ? <div className="text-center"><h2 className="text-2xl font-semibold">Welcome, {profile.full_name}!</h2><p className="mt-2 text-muted-foreground">Your private profile and {skills.length} self-reported skills are saved.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/assessment" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Take assessment</Link><Link to="/opportunities" className="rounded-full border border-border px-6 py-3 font-semibold">Explore opportunities</Link><Button variant="outline" onClick={() => setStep(0)}>Edit profile</Button></div></div> : <div className="mt-6 flex justify-between"><Button type="button" variant="ghost" disabled={step === 0 || busy} onClick={() => setStep(step-1)}>Back</Button><Button type="submit" disabled={busy || (step === 2 && !user)} className="rounded-full">{busy ? 'Saving…' : step === 2 ? 'Save profile' : 'Continue'}</Button></div>}
      </form></>}
    </div></>;
}
