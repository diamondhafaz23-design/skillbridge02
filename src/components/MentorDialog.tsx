import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount } from "./AccountProvider";
import { SignInNotice } from "./SignInNotice";
import { submitMentorshipRequest } from "@/lib/skillbridge.functions";
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
  const { user } = useAccount();
  const persist = useServerFn(submitMentorshipRequest);
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [fields, setFields] = useState({ name: "", email: "", language: mentor.langs[0] ?? "English", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
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
    if (!user) { toast.error("Sign in to save your mentorship request."); return; }
    setBusy(true);
    try {
      await persist({ data: { ...result.data, mentorId: mentor.id } });
      await queryClient.invalidateQueries({ queryKey: ['account', user.id] });
    } catch { toast.error("Could not save your request. Please try again."); setBusy(false); return; }
    setBusy(false);
    setErrors({});
    setFields({ name: "", email: "", language: mentor.langs[0] ?? "English", message: "" });
    setSubmitted(true);
    onSubmitted();
    toast.success("Mentorship request saved privately", { description: `For sample mentor ${mentor.name}. No email was sent.` });
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
            <p className="font-semibold">Your mentorship request has been saved privately.</p>
            <p className="text-sm text-muted-foreground">Your request is saved to your account and appears under Your private requests. No email was sent: {mentor.name} is a fictional mentor and will not receive a request.</p>
            <Button className="w-full rounded-full" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            {!user && <SignInNotice />}
            <p className="text-sm text-muted-foreground">This request is saved privately to your account. This mentor is fictional and will not be contacted. All fields are required.</p>
            <div><label htmlFor="request-name" className="mb-1.5 block text-sm font-medium">Your name</label><Input id="request-name" name="name" autoComplete="name" maxLength={100} required value={fields.name} onChange={(e) => setFields({ ...fields, name: e.target.value })} aria-invalid={Boolean(errors['name'])} aria-describedby={errors['name'] ? "name-error" : undefined} />{errors['name'] && <p id="name-error" className="mt-1 text-sm text-destructive">{errors['name']}</p>}</div>
            <div><label htmlFor="request-email" className="mb-1.5 block text-sm font-medium">Email address</label><Input id="request-email" name="email" type="email" autoComplete="email" maxLength={255} required value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} aria-invalid={Boolean(errors['email'])} aria-describedby={errors['email'] ? "email-error" : undefined} />{errors['email'] && <p id="email-error" className="mt-1 text-sm text-destructive">{errors['email']}</p>}</div>
            <div><label htmlFor="request-language" className="mb-1.5 block text-sm font-medium">Preferred language</label><select id="request-language" name="language" className={selectClass} required value={fields.language} onChange={(e) => setFields({ ...fields, language: e.target.value })} aria-invalid={Boolean(errors['language'])} aria-describedby={errors['language'] ? "language-error" : undefined}>{mentor.langs.map((language) => <option key={language}>{language}</option>)}</select>{errors['language'] && <p id="language-error" className="mt-1 text-sm text-destructive">{errors['language']}</p>}</div>
            <div><label htmlFor="request-message" className="mb-1.5 block text-sm font-medium">What would you like help with?</label><Textarea id="request-message" name="message" rows={4} maxLength={1000} required value={fields.message} onChange={(e) => setFields({ ...fields, message: e.target.value })} aria-invalid={Boolean(errors['message'])} aria-describedby={errors['message'] ? "message-error" : undefined} />{errors['message'] && <p id="message-error" className="mt-1 text-sm text-destructive">{errors['message']}</p>}<p className="mt-1 text-right text-xs text-muted-foreground">{fields.message.length}/1,000</p></div>
            <Button disabled={busy || !user} type="submit" className="w-full rounded-full">{busy ? "Saving…" : "Save mentorship request"}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}