import { QUIZ, type Job } from "@/data/skillbridge";

export type Experience = {
  occupation: string; years: number; practical: string[]; projects: string;
  informal: string; transferable: string[]; languages: string[]; interests: string;
};
export type SavedAssessment = { quizAnswers: number[]; experience: Experience; savedAt: string };

export const EMPTY_EXPERIENCE: Experience = { occupation: "", years: 0, practical: [], projects: "", informal: "", transferable: [], languages: [], interests: "" };
export const TRANSFERABLE = ["Communication","Problem Solving","Leadership","Teamwork","Adaptability","Time Management","Resilience","Cross-cultural Awareness","Training Others","Attention to Detail"];
const KEY = "skillbridge.assessment.v1";

/** Skills proven by correct quiz answers — the only ones called "verified". */
export function verifiedSkills(answers: number[]) {
  return QUIZ.filter((q, k) => answers[k] === q.answer).map((q) => q.skill);
}

/** Self-reported skills: practical skills and languages typed or picked by the user. Never verified. */
export function selfReportedSkills(exp: Experience, verified: string[]) {
  return [...new Set([...exp.practical, ...exp.languages])].filter((s) => !verified.includes(s));
}

export const SELF_REPORTED_WEIGHT = 0.75;

/** Verified skills count fully; self-reported skills count at 75% so demonstrated knowledge ranks higher. */
export function combinedMatch(verified: string[], selfReported: string[], job: Job) {
  const v = job.skills.filter((s) => verified.includes(s));
  const r = job.skills.filter((s) => !verified.includes(s) && selfReported.includes(s));
  const missing = job.skills.filter((s) => !v.includes(s) && !r.includes(s));
  return { score: Math.round(((v.length + r.length * SELF_REPORTED_WEIGHT) / job.skills.length) * 100), verifiedHits: v, selfHits: r, missing };
}

export function splitList(s: string) {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

export function loadAssessment(): SavedAssessment | null {
  try { const raw = localStorage.getItem(KEY); return raw ? (JSON.parse(raw) as SavedAssessment) : null; } catch { return null; }
}
export function saveAssessment(a: Omit<SavedAssessment, "savedAt">) {
  const full = { ...a, savedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(full));
  return full;
}
export function clearAssessment() { localStorage.removeItem(KEY); }
