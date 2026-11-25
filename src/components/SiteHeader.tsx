import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/opportunities", label: "Opportunities" },
  { to: "/assessment", label: "Skills Assessment" },
  { to: "/mentors", label: "Mentors" },
  { to: "/resources", label: "Resources" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
      <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">⟋</span>
      SkillBridge
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-sm font-medium text-accent" }}>{n.label}</Link>
          ))}
          <Link to="/profile" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Get Started</Link>
        </nav>
        <button className="md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
          {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-muted">{n.label}</Link>)}
          <Link to="/profile" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-primary px-4 py-2 text-center font-semibold text-primary-foreground">Get Started</Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">SkillBridge</p>
          <p className="mt-2 max-w-sm text-sm opacity-75">Your Skills Deserve an Opportunity. A skills-first platform for refugees and displaced professionals.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Platform</p>
          {NAV.map((n) => <Link key={n.to} to={n.to} className="block opacity-75 hover:opacity-100">{n.label}</Link>)}
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Get involved</p>
          <Link to="/mentors" className="block opacity-75 hover:opacity-100">Become a mentor</Link>
          <Link to="/opportunities" className="block opacity-75 hover:opacity-100">Hire skills-first</Link>
          <Link to="/profile" className="block opacity-75 hover:opacity-100">Create profile</Link>
        </div>
      </div>
      <p className="border-t border-primary-foreground/15 py-4 text-center text-xs opacity-60">© 2026 SkillBridge. Built with dignity and privacy in mind.</p>
    </footer>
  );
}
