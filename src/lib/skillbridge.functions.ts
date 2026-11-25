import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { setResponseHeader } from '@tanstack/react-start/server';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import { assessmentSchema, profileSaveSchema } from '@/data/cloud-schemas';
import { mentorshipRequestSchema } from '@/data/mentors';
import type { SavedAssessment } from '@/data/assessment';
import type { Job } from '@/data/skillbridge';
import type { Mentor } from '@/data/mentors';
import { z } from 'zod';

export const getDirectory = createServerFn({ method: 'GET' }).handler(async () => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('Listings are temporarily unavailable.');
  const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
    headers.set('apikey', key);
    return fetch(input, { ...init, headers });
  } } });
  const [jobs, mentors] = await Promise.all([client.from('opportunities').select('*').order('sample_key'), client.from('mentors').select('*').order('sample_key')]);
  if (jobs.error || mentors.error) throw new Error('Could not load the directory. Please try again.');
  return {
    jobs: (jobs.data ?? []).map((j): Job & { description: string; experienceRequirements: string; isSample: boolean } => ({ id: j.id, title: j.job_title, company: j.employer, location: j.location, type: j.employment_type, skills: j.required_skills, credentialFlexible: j.credential_flexible, languages: j.languages, description: j.description, experienceRequirements: j.experience_requirements, isSample: j.is_sample })),
    mentors: (mentors.data ?? []).map((m): Mentor & { isSample: boolean } => ({ id: m.id, name: m.name, role: m.profession, industry: m.professional_industry, expertise: m.expertise, skills: m.skills, langs: m.languages, bio: m.short_biography, story: m.story, experience: m.experience_years, isSample: m.is_sample })),
  };
});

export const getAccount = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  setResponseHeader('Cache-Control', 'no-store');
  const [profile, skills, assessment, requests] = await Promise.all([
    context.supabase.from('profiles').select('*').eq('user_id', context.userId).maybeSingle(),
    context.supabase.from('skills').select('*').eq('user_id', context.userId),
    context.supabase.from('assessments').select('*').eq('user_id', context.userId).eq('category', 'combined_professional').maybeSingle(),
    context.supabase.from('mentorship_requests').select('id,mentor_id,message,status,created_at').eq('user_id', context.userId).order('created_at', { ascending: false }),
  ]);
  if (profile.error || skills.error || assessment.error || requests.error) throw new Error('Could not load your saved information.');
  let saved: SavedAssessment | null = null;
  const a = assessment.data;
  if (a && a.results && typeof a.results === 'object' && !Array.isArray(a.results)) {
    const parsed = assessmentSchema.safeParse({ quizAnswers: a.questions_answered, experience: a.results['experience'] });
    if (parsed.success) saved = { ...parsed.data, savedAt: a.completed_at };
  }
  return { profile: profile.data, skills: skills.data ?? [], assessment: saved, requests: requests.data ?? [] };
});

export const saveProfile = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => profileSaveSchema.parse(input))
  .handler(async ({ data, context }) => {
    setResponseHeader('Cache-Control', 'no-store');
    const { error } = await context.supabase.rpc('save_skillbridge_profile', { p_profile: data.profile, p_skills: data.skills });
    if (error) throw new Error('Your profile could not be saved. Please try again.');
    return { saved: true };
  });

export const saveCloudAssessment = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => assessmentSchema.parse(input))
  .handler(async ({ data, context }) => {
    setResponseHeader('Cache-Control', 'no-store');
    const { data: stamp, error } = await context.supabase.rpc('save_skillbridge_assessment', { p_answers: data.quizAnswers, p_experience: data.experience });
    if (error) throw new Error('Your assessment could not be saved. Please try again.');
    return { savedAt: stamp };
  });

export const submitMentorshipRequest = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => mentorshipRequestSchema.extend({ mentorId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    setResponseHeader('Cache-Control', 'no-store');
    const { data: mentor, error: mentorError } = await context.supabase.from('mentors').select('id,languages,is_sample').eq('id', data.mentorId).single();
    if (mentorError || !mentor || !mentor.languages.includes(data.language)) throw new Error('Choose a supported mentor and language.');
    const { error } = await context.supabase.from('mentorship_requests').insert({ user_id: context.userId, mentor_id: mentor.id, requester_name: data.name, contact_email: data.email, preferred_language: data.language, message: data.message });
    if (error) throw new Error('Your request could not be saved. Please try again.');
    return { isSample: mentor.is_sample };
  });