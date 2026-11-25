import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Award } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { QUIZ } from "@/data/skillbridge";

export const Route = createFileRoute("/assessment")({
  head: () => ({ meta: [{ title: "Skills Assessment — SkillBridge" }, { name: "description", content: "Prove your practical skills with short interactive assessments and earn verified badges." }, { property: "og:title", content: "Skills Assessment — SkillBridge" }, { property: "og:description", content: "Prove your practical skills with short interactive assessments and earn verified badges." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Assessment,
});

function Assessment() {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const done = answers.length === QUIZ.length;
  const q = QUIZ[i];
  const next = () => { if (picked === null) return; setAnswers([...answers, picked]); setPicked(null); setI(i + 1); };
  const passed = QUIZ.filter((qq, k) => answers[k] === qq.answer);
  return (
    <>
      <PageHeading eyebrow="Interactive assessment" title="Show what you can do" text="Practical questions across common professions. Each correct answer earns a verified skill badge for your profile." />
      <div className="mx-auto max-w-2xl px-4 py-12">
        {!done && q ? (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex justify-between text-sm text-muted-foreground"><span>Question {i + 1} of {QUIZ.length}</span><span className="font-medium text-accent">{q.skill}</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-accent transition-all" style={{ width: (i / QUIZ.length) * 100 + "%" }} /></div>
            <h2 className="mt-6 text-2xl font-semibold">{q.q}</h2>
            <div role="radiogroup" className="mt-5 space-y-3">
              {q.options.map((o, k) => (
                <button key={o} role="radio" aria-checked={picked === k} onClick={() => setPicked(k)} className={"w-full rounded-xl border p-4 text-left transition " + (picked === k ? "border-accent bg-secondary" : "border-border hover:border-accent")}>{o}</button>
              ))}
            </div>
            <button disabled={picked === null} onClick={next} className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-40">{i === QUIZ.length - 1 ? "See results" : "Next"}</button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
            <Award className="mx-auto h-12 w-12 text-accent" />
            <h2 className="mt-3 text-3xl font-semibold">{passed.length} of {QUIZ.length} skills verified</h2>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {QUIZ.map((qq, k) => <span key={qq.skill} className={"rounded-full px-3 py-1 text-sm " + (answers[k] === qq.answer ? "bg-accent text-accent-foreground" : "border border-dashed border-warm")}>{answers[k] === qq.answer ? "✓ " : "Gap: "}{qq.skill}</span>)}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/opportunities" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">See matching jobs</Link>
              <button onClick={() => { setI(0); setAnswers([]); }} className="rounded-full border border-border px-6 py-3 font-semibold hover:bg-muted">Retake</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
