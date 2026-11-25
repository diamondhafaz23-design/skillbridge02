import { z } from "zod";
import { MENTORS } from "@/data/skillbridge";

const DETAILS = [
  { industry: "Healthcare", experience: 14, skills: ["Nursing", "Patient Care", "Licensing"], bio: "Amira supports internationally trained healthcare professionals with qualification recognition, supervised practice and interview preparation. Having requalified in the UK, she understands the challenges of rebuilding a clinical career." },
  { industry: "Engineering", experience: 16, skills: ["Engineering", "Trades", "Project Management"], bio: "Joseph helps engineers and skilled tradespeople translate their previous experience into local opportunities. His mentoring focuses on technical portfolios, professional networks and pathways into supervised work." },
  { industry: "Finance", experience: 12, skills: ["Accounting", "Bookkeeping", "Excel", "Interviews"], bio: "Farah mentors professionals with accounting and finance experience gained abroad. She offers guidance on credential recognition, skills-first CVs and preparing for finance interviews." },
  { industry: "Tech", experience: 8, skills: ["JavaScript", "React", "Portfolios"], bio: "Lina supports aspiring and experienced developers as they build portfolios and prepare for technical interviews. She brings a self-taught perspective and practical experience coaching career changers." },
  { industry: "Education", experience: 18, skills: ["Teaching", "CV review", "Accreditation"], bio: "Omar helps educators explore teaching accreditation and classroom support roles. His mentoring centres on recognising prior teaching experience and building confidence in a new education system." },
  { industry: "Tech", experience: 10, skills: ["Product Management", "Networking", "Project Management"], bio: "Mariya supports displaced professionals transitioning into product and technology roles. She helps mentees articulate transferable skills, build professional connections and prepare for interviews." },
];

export const DIRECTORY_MENTORS = MENTORS.map((mentor, index) => {
  const detail = DETAILS[index];
  if (!detail) throw new Error("Missing sample mentor details");
  return { ...mentor, ...detail, id: `mentor-${index + 1}` };
});

export type Mentor = (typeof DIRECTORY_MENTORS)[number];
export const INDUSTRIES = ["All", "Healthcare", "Engineering", "Finance", "Tech", "Education", "Trades"];
export const LANGUAGES = [...new Set(DIRECTORY_MENTORS.flatMap((mentor) => mentor.langs))].sort();

export function filterMentors(mentors: Mentor[], query: string, industry: string, language: string) {
  const search = query.trim().toLocaleLowerCase();
  return mentors.filter((mentor) =>
    (industry === "All" || mentor.industry === industry || mentor.expertise.includes(industry)) &&
    (language === "All" || mentor.langs.includes(language)) &&
    [mentor.name, mentor.role, ...mentor.skills, ...mentor.expertise].some((value) => value.toLocaleLowerCase().includes(search)),
  );
}

// Demo-only: validated inputs stay in memory and are never sent to a service.
export const mentorshipRequestSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Use 100 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(255, "Use 255 characters or fewer."),
  language: z.string().refine((value) => LANGUAGES.includes(value), "Choose a supported language."),
  message: z.string().trim().min(1, "Tell your mentor what you would like help with.").max(1000, "Use 1,000 characters or fewer."),
});