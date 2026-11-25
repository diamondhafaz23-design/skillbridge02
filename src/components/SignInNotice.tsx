import { Link } from '@tanstack/react-router';
export function SignInNotice() {
  return <p className="rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">Your profile stays private. <Link to="/auth" className="font-semibold underline">Sign in or create an account</Link> to save your information across devices.</p>;
}