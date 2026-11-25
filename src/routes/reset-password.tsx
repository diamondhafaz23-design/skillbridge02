import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeading } from '@/components/PageHeading';
export const Route = createFileRoute('/reset-password')({ head: () => ({ meta: [{ title: 'Reset Password — SkillBridge' }, { name: 'description', content: 'Securely reset your SkillBridge account password.' }, { property: 'og:title', content: 'Reset Password — SkillBridge' }, { property: 'og:description', content: 'Restore access to your private professional profile.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }), component: ResetPassword });
function ResetPassword() {
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { setValid(new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery'); }, []);
  async function submit(e: FormEvent) {
    e.preventDefault(); if (password !== confirmation) { setMessage('Passwords do not match.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? 'Could not reset your password. Request a new reset link.' : 'Your password has been updated.'); setBusy(false);
  }
  return <><PageHeading eyebrow="Account recovery" title="Choose a new password" text="Keep your professional information secure." /><div className="mx-auto max-w-md px-4 py-12">{valid ? <form onSubmit={submit} className="space-y-4"><label className="block">New password<Input type="password" autoComplete="new-password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} /></label><label className="block">Confirm password<Input type="password" autoComplete="new-password" required value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label><Button disabled={busy} type="submit">Update password</Button></form> : <p>Open the password reset link from your email to continue.</p>}{message && <p role="status" className="mt-4 text-sm">{message}</p>}<Link to="/auth" className="mt-4 block text-accent underline">Back to sign in</Link></div></>;
}