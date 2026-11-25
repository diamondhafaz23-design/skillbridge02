import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { LovableMark } from '@lovable.dev/cloud-auth-js/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeading } from '@/components/PageHeading';
import { useAccount } from '@/components/AccountProvider';

export const Route = createFileRoute('/auth')({ head: () => ({ meta: [
  { title: 'Sign In & Registration — SkillBridge' }, { name: 'description', content: 'Create a private SkillBridge account to save your skills profile and assessment results.' },
  { property: 'og:title', content: 'Sign In & Registration — SkillBridge' }, { property: 'og:description', content: 'Save your professional skills and connect with career opportunities.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: Auth });
function Auth() {
  const { user } = useAccount();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { if (user) void navigate({ to: '/profile', replace: true }); }, [user, navigate]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      if (mode === 'forgot') {
        const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (result.error) throw result.error;
        setNotice('If an account exists, check your email for a password reset link.');
      } else if (mode === 'signup') {
        const result = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (result.error) throw result.error;
        if (!result.data.session) setNotice('Check your email to confirm your account, then sign in.');
      } else {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        await navigate({ to: '/profile' });
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not sign in. Please try again.'); }
    finally { setBusy(false); }
  }
  async function social(provider: 'google' | 'lovable') {
    setBusy(true); setError('');
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
      if (result.error) throw result.error;
      if (!result.redirected) await navigate({ to: '/profile' });
    } catch { setError('Sign-in was not completed. Please try again.'); }
    finally { setBusy(false); }
  }
  return <><PageHeading eyebrow="Your SkillBridge account" title={mode === 'signup' ? 'Create your account' : mode === 'forgot' ? 'Reset your password' : 'Welcome back'} text="Your skills, experience and professional journey — saved privately for you." />
    <div className="mx-auto max-w-md space-y-5 px-4 py-12">
      <div className="flex gap-2"><Button className="flex-1 rounded-full" variant={mode === 'signin' ? 'default' : 'outline'} onClick={() => { setMode('signin'); setError(''); setNotice(''); }}>Sign in</Button><Button className="flex-1 rounded-full" variant={mode === 'signup' ? 'default' : 'outline'} onClick={() => { setMode('signup'); setError(''); setNotice(''); }}>Create account</Button></div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium">Email address<Input className="mt-1" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        {mode !== 'forgot' && <label className="block text-sm font-medium">Password<Input className="mt-1" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={6} required value={password} onChange={e => setPassword(e.target.value)} /></label>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}{notice && <p role="status" className="rounded-lg bg-secondary p-3 text-sm">{notice}</p>}
        <Button disabled={busy} type="submit" className="w-full rounded-full">{busy ? 'Please wait…' : mode === 'signup' ? 'Register' : mode === 'forgot' ? 'Send reset link' : 'Sign in with email'}</Button>
      </form>
      {mode === 'signin' && <Button variant="link" className="px-0" onClick={() => setMode('forgot')}>Forgot password?</Button>}
      <div className="space-y-3 border-t border-border pt-5">
        <Button variant="outline" className="w-full rounded-full" disabled={busy} onClick={() => social('google')}><svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>Continue with Google</Button>
        <Button variant="outline" className="w-full rounded-full" disabled={busy} onClick={() => social('lovable')}><LovableMark />Continue with Lovable</Button>
      </div><Link to="/" className="block text-center text-sm text-muted-foreground underline">Back to SkillBridge</Link>
    </div></>;
}