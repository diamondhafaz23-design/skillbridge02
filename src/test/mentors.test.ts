import { describe, expect, it } from "vitest";
import { DIRECTORY_MENTORS, filterMentors, mentorshipRequestSchema } from "@/data/mentors";

describe("Mentor directory filters", () => {
  it("searches names without case sensitivity", () => {
    expect(filterMentors(DIRECTORY_MENTORS, "  AMIRA  ", "All", "All").map((m) => m.name)).toEqual(["Dr. Amira Haddad"]);
  });
  it("searches professions", () => {
    expect(filterMentors(DIRECTORY_MENTORS, "Software Engineer", "All", "All").map((m) => m.name)).toEqual(["Lina Okafor"]);
  });
  it("searches skills", () => {
    expect(filterMentors(DIRECTORY_MENTORS, "Excel", "All", "All").map((m) => m.name)).toEqual(["Farah Rahimi"]);
  });
  it("combines search, language and professional industry", () => {
    expect(filterMentors(DIRECTORY_MENTORS, "", "Tech", "French").map((m) => m.name)).toEqual(["Lina Okafor"]);
    expect(filterMentors(DIRECTORY_MENTORS, "Mariya", "Tech", "French")).toEqual([]);
  });
  it("preserves the Trades category", () => {
    expect(filterMentors(DIRECTORY_MENTORS, "", "Trades", "All").map((m) => m.name)).toEqual(["Joseph Mugisha"]);
  });
  it("resets to all six sample mentors", () => {
    expect(filterMentors(DIRECTORY_MENTORS, "", "All", "All")).toHaveLength(6);
  });
});

describe("Demo request validation", () => {
  const valid = { name: "Alex", email: "alex@example.com", language: "English", message: "Help with nursing qualification recognition." };
  it("accepts a valid request and trims text", () => {
    expect(mentorshipRequestSchema.parse({ ...valid, name: " Alex " }).name).toBe("Alex");
  });
  it("rejects empty required fields", () => {
    expect(mentorshipRequestSchema.safeParse({ ...valid, name: " " }).success).toBe(false);
    expect(mentorshipRequestSchema.safeParse({ ...valid, message: " " }).success).toBe(false);
  });
  it("rejects invalid email addresses", () => {
    expect(mentorshipRequestSchema.safeParse({ ...valid, email: "not-email" }).success).toBe(false);
  });
  it("rejects unsupported languages", () => {
    expect(mentorshipRequestSchema.safeParse({ ...valid, language: "unsupported" }).success).toBe(false);
  });
  it("enforces input length limits", () => {
    expect(mentorshipRequestSchema.safeParse({ ...valid, name: "a".repeat(101) }).success).toBe(false);
    expect(mentorshipRequestSchema.safeParse({ ...valid, message: "a".repeat(1001) }).success).toBe(false);
    expect(mentorshipRequestSchema.safeParse({ ...valid, email: `${"a".repeat(250)}@example.com` }).success).toBe(false);
  });
});