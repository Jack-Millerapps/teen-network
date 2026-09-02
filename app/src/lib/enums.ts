export const ROLES = ["STUDENT", "MENTOR", "COMPANY", "SCHOOL_ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const EXPERIENCE_TYPES = ["JOB", "VOLUNTEER", "PROJECT", "EXTRACURRICULAR"] as const;
export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];

export const EXPERIENCE_TYPE_LABELS: Record<ExperienceType, string> = {
  JOB: "Job",
  VOLUNTEER: "Volunteering",
  PROJECT: "Project",
  EXTRACURRICULAR: "Extracurricular",
};

export const ENDORSEMENT_STATUSES = ["PENDING", "VERIFIED", "DECLINED"] as const;
export type EndorsementStatus = (typeof ENDORSEMENT_STATUSES)[number];

export const CONSENT_STATUSES = ["PENDING", "GRANTED", "REVOKED"] as const;
export type ConsentStatus = (typeof CONSENT_STATUSES)[number];
