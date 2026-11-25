import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, Compass, GraduationCap, HeartHandshake, Languages, ShieldCheck, Sparkles, Target, UserRound } from "lucide-react";
import { MENTORS } from "@/data/skillbridge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "SkillBridge — Your Skills Deserve an Opportunity" }, { name: "description", content: "A skills-first employment and mentorship platform for skilled refugees and displaced professionals." }, { property: "og:title", content: "SkillBridge — Your Skills Deserve an Opportunity" }, { property: "og:description", content: "A skills-first employment and mentorship platform for skilled refugees and displaced professionals." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Index,
});

const STEPS = [
  { icon: UserRound, title: "Showcase your skills", text: "Build a professional profile with your education, work experience and practical abilities. Certificates are optional.", to: "/profile", action: "Create your profile" },
  { icon: Target, title: "Get matched with opportunities", text: "Explore roles by the skills you already have, compare match scores and identify what you could learn next.", to: "/opportunities", action: "Explore opportunities" },
  { icon: HeartHandshake, title: "Connect with professional mentors", text: "Find guidance on recognition, interviews and career pathways from professionals in your field and language.", to: "/mentors", action: "Find a mentor" },
] as const;

const BARRIERS = [
  { icon: GraduationCap, title: "Qualifications that go unrecognised", text: "A degree or professional licence earned abroad may not be recognised locally. Missing documents and unfamiliar recognition processes can keep experienced professionals out of their field." },
  { icon: HeartHandshake, title: "Networks that must be rebuilt", text: "Displacement can mean starting again without colleagues, local references or industry connections. Finding trusted guidance and a first introduction becomes much harder." },
  { icon: Compass, title: "Transferable skills that get overlooked", text: "Employers may focus on local credentials or job titles and miss the practical abilities behind them — from managing projects to caring for patients or solving technical problems." },
];

const FEATURES = [
  { icon: UserRound, title: "Professional profiles", text: "Bring together your experience, education, languages and practical skills in a skills-first profile — with optional certificates.", to: "/profile", action: "Build your profile" },
  { icon: ClipboardCheck, title: "Skills assessment", text: "Try short knowledge checks to highlight strengths and areas to practise. Prototype results are not professional certification.", to: "/assessment", action: "Try an assessment" },
  { icon: Sparkles, title: "Skills-first opportunity matching", text: "Explore sample roles ranked by the skills you select, rather than relying exclusively on formal qualifications.", to: "/opportunities", action: "Explore matches" },
  { icon: HeartHandshake, title: "Professional mentorship", text: "Search sample mentors by profession, expertise and language, explore their profiles and try a mentorship request.", to: "/mentors", action: "Meet the mentors" },
  { icon: Compass, title: "Skills gap analysis", text: "Compare your skills with a role's requirements and see which abilities are missing, so your next learning goal is clearer.", to: "/opportunities", action: "Find your next skill" },
  { icon: ShieldCheck, title: "Credential-flexible opportunities", text: "Filter sample roles for employers open to experience gained abroad. Regulated professions may still require local recognition.", to: "/opportunities", action: "Browse flexible roles" },
  { icon: Languages, title: "Multilingual connections", text: "Find sample mentors who speak your language, including Arabic, Dari, French and Ukrainian.", to: "/mentors", action: "Find your language" },
  { icon: GraduationCap, title: "Learning & recognition", text: "Explore resources on qualification recognition, right to work, workplace language and practical skills.", to: "/resources", action: "Explore resources" },
  { icon: ShieldCheck, title: "Dignity & choice", text: "Start with what you can do. Choose the experience and skills you include in your prototype profile, without mandatory certificates.", to: "/profile", action: "Start with your strengths" },
] as const;

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
            <p className="text-sm text-muted-foreground">Sample matching results · Demonstration data</p>
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

      <section className="border-b border-border" aria-labelledby="problem">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase text-accent">The problem</p>
          <h2 id="problem" className="mt-3 max-w-3xl text-3xl font-semibold md:text-4xl">Displacement should not erase professional potential.</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">Skilled refugees bring education, work experience and valuable practical abilities. Too often, barriers to recognition and connection prevent that expertise from becoming meaningful employment.</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {BARRIERS.map((barrier) => <div key={barrier.title}><barrier.icon className="h-8 w-8 text-accent" aria-hidden="true" /><h3 className="mt-4 text-xl font-semibold">{barrier.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{barrier.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20" aria-labelledby="how">
        <h2 id="how" className="text-center text-3xl font-semibold md:text-4xl">How SkillBridge works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">A skills-first path from your experience to your next opportunity.</p>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <span className="text-sm font-semibold text-accent">Step {i + 1}</span>
              <s.icon className="mt-3 h-8 w-8 text-primary" aria-hidden />
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              <Button asChild variant="link" className="mt-4 h-auto justify-start whitespace-normal p-0 text-left"><Link to={s.to}>{s.action}<ArrowRight aria-hidden="true" /></Link></Button>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-secondary py-16 md:py-20" aria-labelledby="features">
        <div className="mx-auto max-w-6xl px-4">
          <h2 id="features" className="text-3xl font-semibold md:text-4xl">Our key features</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">One connected journey: make your experience visible, understand your options and find support for the next step.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col rounded-2xl bg-card p-6 shadow-soft transition motion-safe:hover:-translate-y-1">
                <f.icon className="h-7 w-7 text-accent" aria-hidden />
                <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                <Button asChild variant="link" className="mt-4 h-auto justify-start whitespace-normal p-0 text-left"><Link to={f.to}>{f.action}<ArrowRight aria-hidden="true" /></Link></Button>
              </div>
            ))}
          </div>
          <Link to="/assessment" className="mt-10 inline-flex items-center gap-2 font-semibold text-primary hover:text-accent">Try a skills assessment <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="border-b border-border" aria-labelledby="different">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-sm font-semibold uppercase text-accent">Why SkillBridge is different</p>
            <h2 id="different" className="mt-3 text-3xl font-semibold md:text-4xl">Not another job board. A bridge to recognition.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">A qualification is part of your story, not the whole story. SkillBridge puts practical abilities and transferable skills alongside education, so experience gained in another country can be understood in a new context.</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">We do not replace professional licensing or legal right-to-work requirements. We help make existing strengths visible and the steps towards a suitable role clearer.</p>
          </div>
          <dl className="divide-y divide-border">
            <div className="pb-6"><dt className="flex items-center gap-3 text-lg font-semibold"><Target className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />Ability before assumptions</dt><dd className="mt-2 text-sm leading-relaxed text-muted-foreground">Matching compares skills with role requirements, not just the origin of a diploma or the familiarity of a job title.</dd></div>
            <div className="py-6"><dt className="flex items-center gap-3 text-lg font-semibold"><Compass className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />A pathway, not a dead end</dt><dd className="mt-2 text-sm leading-relaxed text-muted-foreground">Skills gaps become specific next steps, supported by learning resources and guidance on qualification recognition.</dd></div>
            <div className="pt-6"><dt className="flex items-center gap-3 text-lg font-semibold"><HeartHandshake className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />Professional connection</dt><dd className="mt-2 text-sm leading-relaxed text-muted-foreground">Mentorship addresses the network barrier with guidance from people who understand career transitions and displacement.</dd></div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20" aria-labelledby="mentor">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 id="mentor" className="text-4xl font-semibold">Mentors who've walked your path</h2>
            <p className="mt-4 text-muted-foreground">Our mentorship approach connects displaced professionals with guidance on qualification recognition, interviews, CVs and professional networks — in a language they speak.</p>
            <p className="mt-3 text-sm text-muted-foreground">Sample mentor profiles shown for demonstration; names and employer affiliations are fictional.</p>
            <div className="mt-6 flex flex-wrap gap-3">
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

      <section className="bg-secondary" aria-labelledby="profile-cta">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-20">
          <p className="text-sm font-semibold uppercase text-primary">Your next chapter</p>
          <h2 id="profile-cta" className="mx-auto mt-3 max-w-3xl text-3xl font-semibold md:text-4xl">Bring your experience. Start with your skills.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">You have valuable expertise to offer. Create your professional profile and take the first step towards opportunities that recognise what you can do.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-auto rounded-full px-6 py-3"><Link to="/profile">Create your professional profile<ArrowRight aria-hidden="true" /></Link></Button>
            <Button asChild variant="outline" size="lg" className="h-auto rounded-full px-6 py-3"><Link to="/opportunities">Explore opportunities</Link></Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Hackathon prototype · Profiles and matching are demonstrations, not live recruitment services.</p>
        </div>
      </section>
    </>
  );
}
