export type Job = { id: string; title: string; company: string; location: string; type: string; skills: string[]; credentialFlexible: boolean; languages: string[] };

export const SKILLS = ["Accounting","Bookkeeping","Excel","Nursing","Patient Care","First Aid","Electrical Wiring","Plumbing","Carpentry","JavaScript","React","Data Analysis","Teaching","Arabic","English","French","Customer Service","Project Management","Welding","Translation"];

export const JOBS: Job[] = [
  { id: "1", title: "Junior Accountant", company: "Northwind Finance", location: "Remote", type: "Full-time", skills: ["Accounting","Excel","Bookkeeping","English"], credentialFlexible: true, languages: ["English"] },
  { id: "2", title: "Healthcare Assistant", company: "CareFirst Clinics", location: "Manchester, UK", type: "Full-time", skills: ["Patient Care","First Aid","English"], credentialFlexible: true, languages: ["English","Arabic"] },
  { id: "3", title: "Electrician (Supervised Path)", company: "BrightGrid Services", location: "Berlin, DE", type: "Apprenticeship+", skills: ["Electrical Wiring","Project Management"], credentialFlexible: true, languages: ["English","German"] },
  { id: "4", title: "Frontend Developer", company: "OpenRoute Tech", location: "Remote", type: "Contract", skills: ["JavaScript","React","English"], credentialFlexible: true, languages: ["English"] },
  { id: "5", title: "Community Interpreter", company: "Welcome Hub", location: "Toronto, CA", type: "Part-time", skills: ["Translation","Arabic","English","French"], credentialFlexible: true, languages: ["Arabic","French","English"] },
  { id: "6", title: "Data Analyst", company: "Civic Insights", location: "Amsterdam, NL", type: "Full-time", skills: ["Data Analysis","Excel","English"], credentialFlexible: false, languages: ["English"] },
  { id: "7", title: "Teaching Assistant", company: "Bridges Academy", location: "Lyon, FR", type: "Full-time", skills: ["Teaching","French","Customer Service"], credentialFlexible: true, languages: ["French"] },
  { id: "8", title: "Construction Carpenter", company: "Solid Build Co.", location: "Oslo, NO", type: "Full-time", skills: ["Carpentry","Welding","First Aid"], credentialFlexible: true, languages: ["English"] },
];

export function matchScore(have: string[], job: Job) {
  const hit = job.skills.filter((s) => have.includes(s));
  return { score: Math.round((hit.length / job.skills.length) * 100), missing: job.skills.filter((s) => !have.includes(s)) };
}

export const MENTORS = [
  { name: "Dr. Amira Haddad", role: "Senior Nurse, NHS", story: "Requalified in the UK after leaving Syria.", expertise: ["Healthcare","Licensing"], langs: ["Arabic","English"] },
  { name: "Joseph Mugisha", role: "Engineering Lead, Siemens", story: "Rebuilt his engineering career in Germany.", expertise: ["Engineering","Trades"], langs: ["Kinyarwanda","English","German"] },
  { name: "Farah Rahimi", role: "Finance Manager, Deloitte", story: "Turned Afghan accounting experience into a CPA path.", expertise: ["Finance","Interviews"], langs: ["Dari","English"] },
  { name: "Lina Okafor", role: "Software Engineer, Shopify", story: "Self-taught developer and bootcamp coach.", expertise: ["Tech","Portfolios"], langs: ["English","French"] },
  { name: "Omar Nasser", role: "Head Teacher", story: "Helps educators navigate teaching accreditation.", expertise: ["Education","CV review"], langs: ["Arabic","French"] },
  { name: "Mariya Kovalenko", role: "Product Manager, Booking", story: "Mentors displaced Ukrainian professionals.", expertise: ["Tech","Networking"], langs: ["Ukrainian","English"] },
];

export const QUIZ = [
  { skill: "Accounting", q: "A business buys equipment with cash. Which is true?", options: ["Assets decrease overall","Total assets stay the same","Liabilities increase"], answer: 1 },
  { skill: "Excel", q: "Which function adds a range of cells?", options: ["=SUM(A1:A5)","=ADD(A1:A5)","=TOTAL(A1,A5)"], answer: 0 },
  { skill: "First Aid", q: "First step when you find an unresponsive person?", options: ["Give water","Check for danger and response","Move them immediately"], answer: 1 },
  { skill: "JavaScript", q: "What does `[1,2,3].map(x => x*2)` return?", options: ["[2,4,6]","6","[1,2,3,2]"], answer: 0 },
  { skill: "Electrical Wiring", q: "Before working on a circuit you should…", options: ["Wear gloves only","Isolate and test it is dead","Work quickly"], answer: 1 },
  { skill: "Customer Service", q: "A customer is upset about a delay. Best first response?", options: ["Explain it's not your fault","Acknowledge and listen","Offer a refund immediately"], answer: 1 },
];

export const RESOURCES = [
  { title: "Getting your qualifications recognised", tag: "Credentials", time: "10 min read" },
  { title: "Writing a skills-first CV", tag: "Career", time: "15 min" },
  { title: "Workplace English for interviews", tag: "Language", time: "6 lessons" },
  { title: "Excel essentials", tag: "Skills", time: "2 hours" },
  { title: "Your right to work: a plain guide", tag: "Legal", time: "8 min read" },
  { title: "Intro to React", tag: "Skills", time: "4 hours" },
];
