"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

async function requireSchoolAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "SCHOOL_ADMIN" || !user.schoolId) {
    throw new Error("Only school administrators can manage consent.");
  }
  return user;
}

export async function requestConsentAction(formData: FormData) {
  const admin = await requireSchoolAdmin();
  const studentProfileId = String(formData.get("studentProfileId") ?? "");
  const parentName = String(formData.get("parentName") ?? "").trim();
  const parentEmail = String(formData.get("parentEmail") ?? "").trim().toLowerCase();

  const student = await prisma.studentProfile.findFirst({
    where: { id: studentProfileId, schoolId: admin.schoolId! },
  });
  if (!student) throw new Error("Student not found at your school.");
  if (!parentName || !parentEmail) throw new Error("Enter the parent or guardian's name and email.");

  await prisma.consent.upsert({
    where: { studentId: student.id },
    create: {
      studentId: student.id,
      parentName,
      parentEmail,
      status: "PENDING",
      method: "school-recorded",
    },
    update: { parentName, parentEmail, status: "PENDING", grantedAt: null, recordedBy: null, evidence: null },
  });

  revalidatePath("/consent");
  revalidatePath("/home");
}

/**
 * A school staff member RECORDS consent they obtained offline; the app does not
 * collect it from the parent directly. That distinction is why this stores who
 * recorded it and what evidence they cited — without that, publishing a minor's
 * record rests on an unattributed click.
 */
export async function recordConsentAction(formData: FormData) {
  const admin = await requireSchoolAdmin();
  const consentId = String(formData.get("consentId") ?? "");
  const evidence = String(formData.get("evidence") ?? "").trim();
  const attested = String(formData.get("attested") ?? "") === "on";

  if (!attested) throw new Error("You must confirm you have the signed consent form on file.");
  if (evidence.length < 3) {
    throw new Error("Describe where the signed consent is filed (e.g. 'Signed form, 2026-03-04, student file').");
  }

  const consent = await prisma.consent.findUnique({ include: { student: true }, where: { id: consentId } });
  if (!consent || consent.student.schoolId !== admin.schoolId) throw new Error("Consent record not found.");

  await prisma.consent.update({
    where: { id: consentId },
    data: {
      status: "GRANTED",
      grantedAt: new Date(),
      recordedBy: admin.name,
      evidence,
    },
  });
  await prisma.studentProfile.update({
    where: { id: consent.studentId },
    data: { isPublic: true },
  });

  revalidatePath("/consent");
  revalidatePath("/home");
  revalidatePath(`/profile/${consent.student.userId}`);
}

export async function revokeConsentAction(formData: FormData) {
  const admin = await requireSchoolAdmin();
  const consentId = String(formData.get("consentId") ?? "");

  const consent = await prisma.consent.findUnique({ include: { student: true }, where: { id: consentId } });
  if (!consent || consent.student.schoolId !== admin.schoolId) throw new Error("Consent record not found.");

  await prisma.consent.update({
    where: { id: consentId },
    data: { status: "REVOKED", recordedBy: admin.name },
  });
  await prisma.studentProfile.update({ where: { id: consent.studentId }, data: { isPublic: false } });

  revalidatePath("/consent");
  revalidatePath("/home");
  revalidatePath(`/profile/${consent.student.userId}`);
}
