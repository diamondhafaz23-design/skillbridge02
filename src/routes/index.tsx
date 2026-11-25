import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, Compass, GraduationCap, HeartHandshake, Languages, ShieldCheck, Sparkles, Target, UserRound } from "lucide-react";
import { MENTORS } from "@/data/skillbridge";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "SkillBridge — Your Skills Deserve an Opportunity" }, { name: "description", content: "A skills-first employment and mentorship platform for skilled refugees and displaced professionals." }, { property: "og:title", content: "SkillBridge — Your Skills Deserve an Opportunity" }, { property: "og:description", content: "A skills-first employment and mentorship platform for skilled refugees and displaced professionals." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Index,
});

const STEPS = [
  { icon: UserRound, title: "Build your skills profile", text: "Show what you can do — education, experience and practical skills, even without paperwork." },
  { icon: ClipboardCheck, title: "Prove it with assessments", text: "Short, practical challenges verify your skills and earn badges employers trust." },
  { icon: Target, title: "Get matched", text: "Our Skills-First Matching Engine connects you to roles based on ability, not certificates." },
  { icon: HeartHandshake, title: "Grow with a mentor", text: "Professionals who've walked your path help you close gaps and get hired." },
];

const FEATURES = [
  { icon: Sparkles, title: "Skills-First Matching", text: "Match scores based on verified ability — credentials are optional, not gatekeepers." },
  { icon: Compass, title: "Skills Gap Analysis", text: "See exactly which skills stand between you and a role, with learning paths to close them." },
  { icon: ShieldCheck, title: "Credential-flexible employers", text: "Every employer commits to recognising experience gained anywhere in the world." },
  { icon: Languages, title: "Multilingual by design", text: "Find mentors and roles in the languages you speak — Arabic, Dari, French, Ukrainian and more." },
  { icon: GraduationCap, title: "Learning & recognition", text: "Guides on qualification recognition, right to work and workplace language." },
  { icon: HeartHandshake, title: "Dignity & privacy", text: "You control what you share. Your status is never shown without your consent." },
];

function Index() {
  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="inline-flex rounded-full border border-primary-foreground/20 px-3 py-1 text-xs font-medium">For refugees & displaced professionals</p>
            <h1 className="mt-5 text-5xl font-semibold leading-tight md:text-6xl">Your Skills Deserve an <span className="text-accent">Opportunity.</span></h1>
            <p className="mt-5 max-w-lg text-lg opacity-80">You bring years of expertise. SkillBridge makes sure employers see it — matching you to work by what you can do, not where your diploma came from.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/profile" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90">Get Started <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/opportunities" className="rounded-full border border-primary-foreground/30 px-6 py-3 font-semibold hover:bg-primary-foreground/10">Explore Opportunities</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-soft">
            <p className="text-sm text-muted-foreground">Live match preview</p>
            <p className="mt-1 font-display text-2xl">Amal, Civil Engineer</p>
            <p className="text-sm text-muted-foreground">12 years experience · Arabic, English</p>
            {[["Site Supervisor", 92], ["Project Coordinator", 84], ["CAD Technician", 71]].map(([t, s]) => (
              <div key={t} className="mt-4">
                <div className="flex justify-between text-sm"><span className="font-medium">{t}</span><span className="text-accent font-semibold">{s}% match</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-accent" style={{ width: s + "%" }} /></div>
              </div>
            ))}
            <p className="mt-5 rounded-lg bg-secondary p-3 text-sm">Gap found: <b>Local building codes</b> — free 3-week course suggested.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20" aria-labelledby="how">
        <h2 id="how" className="text-center text-4xl font-semibold">How it works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">Four steps from where you are to where your skills belong.</p>
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="text-sm font-semibold text-accent">Step {i + 1}</span>
              <s.icon className="mt-3 h-8 w-8 text-primary" aria-hidden />
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-secondary py-20" aria-labelledby="features">
        <div className="mx-auto max-w-6xl px-4">
          <h2 id="features" className="text-4xl font-semibold">Not another job board.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Ordinary job sites filter you out by credentials. SkillBridge is built around the barriers displaced professionals actually face.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl bg-card p-6 shadow-soft transition hover:-translate-y-1">
                <f.icon className="h-7 w-7 text-accent" aria-hidden />
                <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
          <Link to="/assessment" className="mt-10 inline-flex items-center gap-2 font-semibold text-primary hover:text-accent">Try a skills assessment <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20" aria-labelledby="mentor">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 id="mentor" className="text-4xl font-semibold">Mentors who've walked your path</h2>
            <p className="mt-4 text-muted-foreground">Many of our mentors rebuilt their own careers after displacement. They help with qualification recognition, interviews, CVs and introductions — in your language.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/mentors" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Find a mentor</Link>
              <Link to="/mentors" className="rounded-full border border-border px-6 py-3 font-semibold hover:bg-muted">Become a mentor</Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {MENTORS.slice(0, 4).map((m) => (
              <div key={m.name} className="rounded-2xl border border-border bg-card p-5">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-accent font-semibold text-accent-foreground">{m.name.split(" ").slice(-2).map((w) => w[0]).join("")}</div>
                <p className="mt-3 font-semibold">{m.name}</p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
                <p className="mt-2 text-xs text-accent">{m.langs.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
