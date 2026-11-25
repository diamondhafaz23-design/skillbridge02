import { describe, expect, it } from "vitest";
import { combinedMatch, selfReportedSkills, verifiedSkills, EMPTY_EXPERIENCE } from "@/data/assessment";
import { JOBS } from "@/data/skillbridge";

const job = JOBS[0]!; // Accounting, Excel, Bookkeeping, English

describe("combined skills profile", () => {
  it("only quiz-correct skills are verified", () => {
    expect(verifiedSkills([1, 0, 0, 1, 0, 0])).toEqual(["Accounting", "Excel"]);
  });
  it("self-reported skills never include verified ones", () => {
    expect(selfReportedSkills({ ...EMPTY_EXPERIENCE, practical: ["Excel", "Bookkeeping"], languages: ["English"] }, ["Excel"])).toEqual(["Bookkeeping", "English"]);
  });
  it("verified skills weigh more than self-reported ones", () => {
    expect(combinedMatch(["Accounting", "Excel", "Bookkeeping", "English"], [], job).score).toBe(100);
    expect(combinedMatch([], ["Accounting", "Excel", "Bookkeeping", "English"], job).score).toBe(75);
    expect(combinedMatch(["Accounting"], ["Excel"], job)).toMatchObject({ score: 44, missing: ["Bookkeeping", "English"] });
  });
});
