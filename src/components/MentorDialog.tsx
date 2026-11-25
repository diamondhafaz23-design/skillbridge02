import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mentorshipRequestSchema, type Mentor } from "@/data/mentors";

type Props = {
  mentor: Mentor;
  mode: "profile" | "request";
  onClose: () => void;
  onRequest: () => void;
  onSubmitted: () => void;
};

export function MentorDialog({ mentor, mode, onClose, onRequest, onSubmitted }: Props) {
  const [fields, setFields] = useState({ name: "", email: "", language: mentor.langs[0] ?? "English", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = mentorshipRequestSchema.safeParse(fields);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") next[key] = issue.message;
      }
      setErrors(next);
      const first = result.error.issues[0]?.path[0];
      if (typeof first === "string") event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (!mentor.langs.includes(result.data.language)) {
      setErrors({ language: "Choose a language this mentor speaks." });
      return;
    }
    setErrors({});
    setFields({ name: "", email: "", language: mentor.langs[0] ?? "English", message: "" });
    setSubmitted(true);
    onSubmitted();
    toast.success("Demo mentorship request submitted", { description: `For ${mentor.name}. No request was sent to a real mentor.` });
  }
  const selectClass = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl">
        <DialogHeader className="pr-6 text-left">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Sample mentor profile</span>
          <DialogTitle className="text-2xl tracking-normal">{mode === "profile" ? mentor.name : submitted ? "Request confirmation" : "Request mentorship"}</DialogTitle>
          <DialogDescription>{mode === "profile" ? mentor.role : `Mentorship with ${mentor.name}`}</DialogDescription>
        </DialogHeader>
        {mode === "profile" ? (
          <>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Industry</dt><dd className="mt-1 font-medium">{mentor.industry}</dd></div>
              <div><dt className="text-muted-foreground">Experience</dt><dd className="mt-1 font-medium">{mentor.experience} years</dd></div>
              <div className="col-span-2"><dt className="text-muted-foreground">Languages</dt><dd className="mt-1">{mentor.langs.join(", ")}</dd></div>
            </dl>
            <div><h3 className="text-lg font-semibold">Biography</h3><p className="mt-2 text-sm leading-relaxed">{mentor.bio}</p></div>
            <div><h3 className="text-lg font-semibold">Mentoring expertise</h3><div className="mt-2 flex flex-wrap gap-2">{mentor.skills.map((skill) => <span key={skill} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{skill}</span>)}</div></div>
            <p className="text-xs text-muted-foreground">Fictional profile for demonstration. Employer affiliations and experience are sample data.</p>
            <Button className="rounded-full" onClick={onRequest}>Request Mentorship</Button>
          </>
        ) : submitted ? (
          <div className="space-y-4" role="status">
            <CheckCircle2 className="h-10 w-10 text-accent" aria-hidden="true" />
            <p className="font-semibold">Your demo mentorship request has been submitted.</p>
            <p className="text-sm text-muted-foreground">This is a sample interaction. Your details were not saved, no email was sent and {mentor.name} will not receive a request.</p>
            <Button className="w-full rounded-full" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <p className="text-sm text-muted-foreground">Demo request only — details are not saved or sent. All fields are required.</p>
            <div><label htmlFor="request-name" className="mb-1.5 block text-sm font-medium">Your name</label><Input id="request-name" name="name" autoComplete="name" maxLength={100} required value={fields.name} onChange={(e) => setFields({ ...fields, name: e.target.value })} aria-invalid={Boolean(errors['name'])} aria-describedby={errors['name'] ? "name-error" : undefined} />{errors['name'] && <p id="name-error" className="mt-1 text-sm text-destructive">{errors['name']}</p>}</div>
            <div><label htmlFor="request-email" className="mb-1.5 block text-sm font-medium">Email address</label><Input id="request-email" name="email" type="email" autoComplete="email" maxLength={255} required value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} aria-invalid={Boolean(errors['email'])} aria-describedby={errors['email'] ? "email-error" : undefined} />{errors['email'] && <p id="email-error" className="mt-1 text-sm text-destructive">{errors['email']}</p>}</div>
            <div><label htmlFor="request-language" className="mb-1.5 block text-sm font-medium">Preferred language</label><select id="request-language" name="language" className={selectClass} required value={fields.language} onChange={(e) => setFields({ ...fields, language: e.target.value })} aria-invalid={Boolean(errors['language'])} aria-describedby={errors['language'] ? "language-error" : undefined}>{mentor.langs.map((language) => <option key={language}>{language}</option>)}</select>{errors['language'] && <p id="language-error" className="mt-1 text-sm text-destructive">{errors['language']}</p>}</div>
            <div><label htmlFor="request-message" className="mb-1.5 block text-sm font-medium">What would you like help with?</label><Textarea id="request-message" name="message" rows={4} maxLength={1000} required value={fields.message} onChange={(e) => setFields({ ...fields, message: e.target.value })} aria-invalid={Boolean(errors['message'])} aria-describedby={errors['message'] ? "message-error" : undefined} />{errors['message'] && <p id="message-error" className="mt-1 text-sm text-destructive">{errors['message']}</p>}<p className="mt-1 text-right text-xs text-muted-foreground">{fields.message.length}/1,000</p></div>
            <Button type="submit" className="w-full rounded-full">Submit demo request</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}