"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { EXPERIENCE_TYPES, type ExperienceType } from "@/lib/enums";
import { parseDateInput } from "@/lib/dates";

export async function addExperienceAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user?.studentProfile) throw new Error("Only students can log experience.");

  const type = String(formData.get("type") ?? "") as ExperienceType;
  const title = String(formData.get("title") ?? "").trim();
  const org = String(formData.get("org") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "");
  const endDateRaw = String(formData.get("endDate") ?? "");

  if (!EXPERIENCE_TYPES.includes(type) || !title || !org || !startDate) {
    throw new Error("Fill in type, title, organization, and start date.");
  }

  await prisma.experienceEntry.create({
    data: {
      studentId: user.studentProfile.id,
      type,
      title,
      org,
      description: description || null,
      startDate: parseDateInput(startDate),
      endDate: endDateRaw ? parseDateInput(endDateRaw) : null,
    },
  });

  revalidatePath("/log");
  revalidatePath(`/profile/${user.id}`);
}

export async function deleteExperienceAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user?.studentProfile) throw new Error("Only students can edit their log.");
  const entryId = String(formData.get("entryId") ?? "");

  await prisma.experienceEntry.deleteMany({
    where: { id: entryId, studentId: user.studentProfile.id },
  });

  revalidatePath("/log");
  revalidatePath(`/profile/${user.id}`);
}

export async function updateExperienceAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user?.studentProfile) throw new Error("Only students can edit their log.");

  const entryId = String(formData.get("entryId") ?? "");
  const type = String(formData.get("type") ?? "") as ExperienceType;
  const title = String(formData.get("title") ?? "").trim();
  const org = String(formData.get("org") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "");
  const endDateRaw = String(formData.get("endDate") ?? "");

  if (!EXPERIENCE_TYPES.includes(type) || !title || !org || !startDate) {
    throw new Error("Fill in type, title, organization, and start date.");
  }

  const owned = await prisma.experienceEntry.findFirst({
    where: { id: entryId, studentId: user.studentProfile.id },
    include: { endorsements: true },
  });
  if (!owned) throw new Error("That entry isn't yours.");

  const newStart = parseDateInput(startDate);
  const newEnd = endDateRaw ? parseDateInput(endDateRaw) : null;

  // Did anything a confirmer actually vouched for change? Punctuation-level
  // edits shouldn't nag; the facts of the job must not move silently.
  const materiallyChanged =
    owned.title !== title ||
    owned.org !== org ||
    owned.type !== type ||
    (owned.description ?? "") !== (description || "") ||
    owned.startDate.getTime() !== newStart.getTime() ||
    (owned.endDate?.getTime() ?? null) !== (newEnd?.getTime() ?? null);

  await prisma.experienceEntry.update({
    where: { id: entryId },
    data: {
      type,
      title,
      org,
      description: description || null,
      startDate: newStart,
      endDate: newEnd,
    },
  });

  // A confirmation vouches for specific wording. If the student rewrites the
  // entry afterwards, the old confirmation must not carry over — otherwise a
  // "Counter Lead" confirmed by an employer can be edited into "Regional
  // Operations Manager" and keep the employer's badge and quote. Send it back
  // for re-confirmation and drop the endorser's comment, which described the
  // previous version.
  if (materiallyChanged) {
    const settled = owned.endorsements.filter((e) => e.status === "VERIFIED");
    if (settled.length > 0) {
      await prisma.endorsement.updateMany({
        where: { entryId, status: "VERIFIED" },
        data: { status: "PENDING", note: null },
      });
    }
  }

  revalidatePath("/log");
  revalidatePath("/home");
  revalidatePath(`/profile/${user.id}`);
}
