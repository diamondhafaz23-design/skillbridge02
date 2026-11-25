import { describe, expect, it } from 'vitest';
import { assessmentSchema, profileSaveSchema, EMPTY_PROFILE } from '@/data/cloud-schemas';
import { EMPTY_EXPERIENCE, verifiedSkills } from '@/data/assessment';

describe('Cloud professional data validation', () => {
  it('preserves profile experience, languages and manually entered skills', () => {
    expect(profileSaveSchema.parse({ profile: { ...EMPTY_PROFILE, full_name: 'Alex', professional_title: 'Accountant', work_experience: 'Managed budgets', years_experience: 7, languages: ['Arabic'], professional_summary: 'Finance professional' }, skills: ['Tailoring'] })).toMatchObject({ profile: { years_experience: 7, languages: ['Arabic'], work_experience: 'Managed budgets' }, skills: ['Tailoring'] });
  });
  it('never accepts a caller-supplied owner ID', () => {
    const parsed = profileSaveSchema.parse({ user_id: 'someone-else', profile: { ...EMPTY_PROFILE, full_name: 'Alex', professional_title: 'Accountant', legal_status: 'private' }, skills: [] });
    expect(parsed).not.toHaveProperty('user_id');
    expect(parsed.profile).not.toHaveProperty('legal_status');
  });
  it('supports practical skills without requiring quiz answers', () => {
    const result = assessmentSchema.parse({ quizAnswers: [], experience: { ...EMPTY_EXPERIENCE, occupation: 'Tailor', practical: ['Tailoring'], informal: 'Family business' } });
    expect(result.experience.practical).toEqual(['Tailoring']);
    expect(verifiedSkills(result.quizAnswers)).toEqual([]);
  });
  it('does not accept claimed scores or verification as assessment input', () => {
    const result = assessmentSchema.parse({ quizAnswers: [0, 1, 0, 1, 0, 0], score: 100, verifiedSkills: ['React'], experience: { ...EMPTY_EXPERIENCE, occupation: 'Developer', practical: ['React'] } });
    expect(result).not.toHaveProperty('score');
    expect(result).not.toHaveProperty('verifiedSkills');
    expect(verifiedSkills(result.quizAnswers)).toEqual([]);
  });
});