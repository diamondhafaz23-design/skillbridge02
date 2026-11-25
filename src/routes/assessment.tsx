import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Award, BadgeCheck, Briefcase, Pencil, Save, Sparkles, User } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { QUIZ, SKILLS } from "@/data/skillbridge";
import { EMPTY_EXPERIENCE, TRANSFERABLE, loadAssessment, saveAssessment, selfReportedSkills, splitList, verifiedSkills, type Experience } from "@/data/assessment";

export const Route = createFileRoute("/assessment")({
  head: () => ({ meta: [{ title: "Skills Assessment — SkillBridge" }, { name: "description", content: "Prove your knowledge, record your professional experience and build a combined skills profile." }, { property: "og:title", content: "Skills Assessment — SkillBridge" }, { property: "og:description", content: "Prove your knowledge, record your professional experience and build a combined skills profile." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Assessment,
});

type Stage = "quiz" | "experience" | "results";
const field = "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-ring";
const chip = (on: boolean) => "rounded-full border px-3 py-1 text-xs font-medium transition " + (on ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent");

function Assessment() {
  const [stage, setStage] = useState<Stage>("quiz");
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [exp, setExp] = useState<Experience>(EMPTY_EXPERIENCE);
  const [extraSkill, setExtraSkill] = useState("");
  const [langText, setLangText] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const s = loadAssessment();
    if (s) { setAnswers(s.quizAnswers); setI(s.quizAnswers.length); setExp(s.experience); setLangText(s.experience.languages.join(", ")); setSavedAt(s.savedAt); setStage("results"); }
  }, []);

  const q = QUIZ[i];
  const quizDone = answers.length === QUIZ.length;
  const next = () => { if (picked === null) return; const a = [...answers, picked]; setAnswers(a); setPicked(null); setI(i + 1); if (a.length === QUIZ.length) setStage("experience"); };
  const skipQuiz = () => { setStage("experience"); };
  const retakeQuiz = () => { setI(0); setAnswers([]); setPicked(null); setStage("quiz"); };
  const set = <K extends keyof Experience>(k: K, v: Experience[K]) => setExp((e) => ({ ...e, [k]: v }));
  const toggleIn = (k: "practical" | "transferable", s: string) => set(k, exp[k].includes(s) ? exp[k].filter((x) => x !== s) : [...exp[k], s]);
  const addSkill = () => { const items = splitList(extraSkill).filter((s) => !exp.practical.includes(s)); if (items.length) set("practical", [...exp.practical, ...items]); setExtraSkill(""); };

  const verified = verifiedSkills(answers);
  const selfReported = selfReportedSkills(exp, verified);
  const save = () => { const s = saveAssessment({ quizAnswers: answers, experience: exp }); setSavedAt(s.savedAt); toast.success("Assessment saved on this device", { description: "Your matches now use this profile." }); };

  return (
    <>
      <PageHeading eyebrow="Interactive assessment" title="Show what you can do" text="Two parts: a short knowledge check, then your real-world experience. Skip the quiz if you prefer — your experience still counts." />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ol className="mb-8 grid grid-cols-3 gap-2 text-xs" aria-label="Assessment progress">
          {(["Knowledge assessment", "Experience & practical skills", "Your skills profile"] as const).map((l, k) => {
            const active = ["quiz", "experience", "results"].indexOf(stage) >= k;
            return <li key={l} aria-current={["quiz", "experience", "results"][k] === stage ? "step" : undefined}><div className={"h-1.5 rounded-full " + (active ? "bg-accent" : "bg-muted")} /><p className="mt-1 text-muted-foreground">{k + 1}. {l}</p></li>;
          })}
        </ol>

        {stage === "quiz" && (q && !quizDone ? (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="sr-only">Section 1: Knowledge assessment</h2>
            <div className="flex justify-between text-sm text-muted-foreground"><span>Question {i + 1} of {QUIZ.length}</span><span className="font-medium text-accent">{q.skill}</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-accent transition-all" style={{ width: (i / QUIZ.length) * 100 + "%" }} /></div>
            <h3 className="mt-6 text-2xl font-semibold">{q.q}</h3>
            <div role="radiogroup" className="mt-5 space-y-3">
              {q.options.map((o, k) => (
                <button key={o} role="radio" aria-checked={picked === k} onClick={() => setPicked(k)} className={"w-full rounded-xl border p-4 text-left transition " + (picked === k ? "border-accent bg-secondary" : "border-border hover:border-accent")}>{o}</button>
              ))}
            </div>
            <button disabled={picked === null} onClick={next} className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-40">{i === QUIZ.length - 1 ? "Continue to experience" : "Next"}</button>
            <button onClick={skipQuiz} className="mt-3 w-full text-sm text-muted-foreground underline hover:text-foreground">Skip the quiz and add my experience</button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
            <p>Knowledge assessment complete.</p>
            <div className="mt-4 flex justify-center gap-3"><button onClick={() => setStage("experience")} className="rounded-full bg-primary px-6 py-2 font-semibold text-primary-foreground">Continue</button><button onClick={retakeQuiz} className="rounded-full border border-border px-6 py-2 font-semibold">Retake</button></div>
          </div>
        ))}

        {stage === "experience" && (
          <form onSubmit={(e) => { e.preventDefault(); setExp((x) => ({ ...x, languages: splitList(langText) })); setStage("results"); }} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div>
              <h2 className="text-2xl font-semibold">Professional Experience & Practical Skills</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tell us what you've done. This is self-reported — we'll show it separately from quiz results and never label it as verified.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
              <label className="block text-sm font-medium">Previous occupation<input required value={exp.occupation} onChange={(e) => set("occupation", e.target.value)} className={field} placeholder="e.g. Civil Engineer" /></label>
              <label className="block text-sm font-medium">Years of experience<input type="number" min={0} max={60} value={exp.years} onChange={(e) => set("years", Math.max(0, Number(e.target.value) || 0))} className={field} /></label>
            </div>
            <fieldset>
              <legend className="text-sm font-medium">Practical skills</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {[...new Set([...SKILLS, ...exp.practical])].map((s) => <button type="button" key={s} aria-pressed={exp.practical.includes(s)} onClick={() => toggleIn("practical", s)} className={chip(exp.practical.includes(s))}>{s}</button>)}
              </div>
              <div className="mt-3 flex gap-2">
                <label className="sr-only" htmlFor="extra-skill">Add your own skill</label>
                <input id="extra-skill" value={extraSkill} onChange={(e) => setExtraSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} className={field + " mt-0"} placeholder="Add your own, e.g. AutoCAD, Tailoring" />
                <button type="button" onClick={addSkill} className="shrink-0 rounded-full border border-border px-4 text-sm font-semibold hover:bg-muted">Add</button>
              </div>
            </fieldset>
            <label className="block text-sm font-medium">Previous projects & achievements<textarea rows={3} value={exp.projects} onChange={(e) => set("projects", e.target.value)} className={field} placeholder="e.g. Managed construction of a 40-unit housing block" /></label>
            <label className="block text-sm font-medium">Informal work experience<textarea rows={2} value={exp.informal} onChange={(e) => set("informal", e.target.value)} className={field} placeholder="Family business, volunteering, community roles, work in camps…" /></label>
            <fieldset>
              <legend className="text-sm font-medium">Transferable skills</legend>
              <div className="mt-2 flex flex-wrap gap-2">{TRANSFERABLE.map((s) => <button type="button" key={s} aria-pressed={exp.transferable.includes(s)} onClick={() => toggleIn("transferable", s)} className={chip(exp.transferable.includes(s))}>{s}</button>)}</div>
            </fieldset>
            <label className="block text-sm font-medium">Languages spoken (comma separated)<input value={langText} onChange={(e) => setLangText(e.target.value)} className={field} placeholder="Arabic, English, French" /></label>
            <label className="block text-sm font-medium">Professional interests<input value={exp.interests} onChange={(e) => set("interests", e.target.value)} className={field} placeholder="e.g. Healthcare administration, renewable energy" /></label>
            <div className="flex flex-wrap justify-between gap-3">
              <button type="button" onClick={() => setStage("quiz")} className="rounded-full px-5 py-2 font-medium hover:bg-muted">Back to quiz</button>
              <button type="submit" className="rounded-full bg-primary px-6 py-2 font-semibold text-primary-foreground">See my skills profile</button>
            </div>
          </form>
        )}

        {stage === "results" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-sm text-muted-foreground">Combined skills profile</p><h2 className="text-3xl font-semibold">{exp.occupation || "Your profile"}{exp.years ? ` · ${exp.years} yrs` : ""}</h2></div>
                <p className="text-xs text-muted-foreground" aria-live="polite">{savedAt ? "Saved " + new Date(savedAt).toLocaleString() : "Not saved yet"}</p>
              </div>
            </div>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold"><BadgeCheck className="h-5 w-5 text-accent" />Knowledge assessment results</h3>
              {answers.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Quiz skipped. <button onClick={retakeQuiz} className="text-accent underline">Take it</button> to earn verified badges.</p> : (<>
                <p className="mt-1 text-sm text-muted-foreground">{verified.length} of {QUIZ.length} skills verified by your answers.</p>
                <div className="mt-3 flex flex-wrap gap-2">{QUIZ.map((qq, k) => answers[k] === undefined ? null : <span key={qq.skill} className={"rounded-full px-3 py-1 text-sm " + (answers[k] === qq.answer ? "bg-accent text-accent-foreground" : "border border-dashed border-warm")}>{answers[k] === qq.answer ? "✓ Verified: " : "Gap: "}{qq.skill}</span>)}</div>
              </>)}
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold"><User className="h-5 w-5 text-accent" />Self-reported professional experience</h3>
              <p className="mt-1 text-xs text-muted-foreground">Provided by you — not verified.</p>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                {([["Previous projects & achievements", exp.projects], ["Informal work experience", exp.informal], ["Languages", exp.languages.join(", ")], ["Professional interests", exp.interests]] as const).map(([k, v]) => <div key={k}><dt className="font-medium">{k}</dt><dd className="text-muted-foreground">{v || "—"}</dd></div>)}
              </dl>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold"><Briefcase className="h-5 w-5 text-accent" />Practical skills & transferable abilities</h3>
              <p className="mt-1 text-xs text-muted-foreground">Self-reported — take related assessments to verify them.</p>
              <p className="mt-3 text-sm font-medium">Practical skills</p>
              <div className="mt-2 flex flex-wrap gap-2">{exp.practical.length ? exp.practical.map((s) => <span key={s} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">{verified.includes(s) ? "✓ " : ""}{s}{verified.includes(s) ? " (verified)" : " (self-reported)"}</span>) : <span className="text-sm text-muted-foreground">None added</span>}</div>
              <p className="mt-4 text-sm font-medium">Transferable abilities</p>
              <div className="mt-2 flex flex-wrap gap-2">{exp.transferable.length ? exp.transferable.map((s) => <span key={s} className="rounded-full border border-border px-3 py-1 text-sm">{s}</span>) : <span className="text-sm text-muted-foreground">None added</span>}</div>
            </section>

            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={save} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"><Save className="h-4 w-4" />Save results</button>
              <button onClick={() => setStage("experience")} className="flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:bg-muted"><Pencil className="h-4 w-4" />Edit experience</button>
              <button onClick={retakeQuiz} className="flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:bg-muted"><Award className="h-4 w-4" />Retake quiz</button>
              <Link to="/opportunities" onClick={save} className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground"><Sparkles className="h-4 w-4" />Save & see matching jobs</Link>
            </div>
            <p className="text-center text-xs text-muted-foreground">Saved in this browser only ({selfReported.length} self-reported and {verified.length} verified skills used for matching).</p>
          </div>
        )}
      </div>
    </>
  );
}
