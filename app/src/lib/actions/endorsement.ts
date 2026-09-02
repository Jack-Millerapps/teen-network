"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * Students ask a mentor/employer to confirm an entry they logged. This is the
 * half of the loop that makes the product work at all: without it an entry can
 * never move from "logged" to "verified" unless an org happens to find the
 * profile on its own.
 */
export async function requestVerificationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user?.studentProfile) throw new Error("Only students can request verification.");

  const entryId = String(formData.get("entryId") ?? "");
  const endorserId = String(formData.get("endorserId") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const inviteName = String(formData.get("inviteName") ?? "").trim();
  const inviteEmail = String(formData.get("inviteEmail") ?? "").trim().toLowerCase();

  const entry = await prisma.experienceEntry.findFirst({
    where: { id: entryId, studentId: user.studentProfile.id },
  });
  if (!entry) throw new Error("That experience entry isn't yours.");

  // Path A: someone already on Trajectory.
  if (endorserId) {
    const endorser = await prisma.user.findFirst({
      where: { id: endorserId, role: { in: ["MENTOR", "COMPANY"] } },
    });
    if (!endorser) throw new Error("Choose a mentor or employer to ask.");

    const existing = await prisma.endorsement.findFirst({
      where: { entryId, endorserId, status: { in: ["PENDING", "VERIFIED"] } },
    });
    if (existing) throw new Error("You've already asked them about this entry.");

    await prisma.endorsement.create({
      data: { entryId, endorserId, requestNote: note || null, status: "PENDING" },
    });
  } else {
    // Path B: the real supervisor, who almost certainly has no account yet.
    if (!inviteName || !inviteEmail) {
      throw new Error("Enter your supervisor's name and email, or pick someone from the list.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      throw new Error("That doesn't look like an email address.");
    }

    const alreadyOnPlatform = await prisma.user.findUnique({ where: { email: inviteEmail } });

    const existing = await prisma.endorsement.findFirst({
      where: { entryId, inviteEmail, status: { in: ["PENDING", "VERIFIED"] } },
    });
    if (existing) throw new Error("You've already asked that person about this entry.");

    await prisma.endorsement.create({
      data: {
        entryId,
        // If they happen to already have an account, wire it straight up.
        endorserId: alreadyOnPlatform?.id ?? null,
        inviteName,
        inviteEmail,
        requestNote: note || null,
        status: "PENDING",
      },
    });
  }

  revalidatePath("/log");
  revalidatePath("/home");
  revalidatePath(`/profile/${user.id}`);
}

async function requireOrgUser() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "MENTOR" && user.role !== "COMPANY")) {
    throw new Error("Only mentor or employer accounts can respond to requests.");
  }
  return user;
}

/**
 * Deliberately removed: an org used to be able to confirm ANY entry it happened
 * to be looking at, with no check that it had anything to do with the work. That
 * is the same "coffee shop verifies library tutoring" hole as the old fixed
 * dropdown, just from the endorser's side. Confirmations now only ever answer a
 * request the student sent, so the student controls who speaks for them.
 */

export async function setEndorsementStatusAction(formData: FormData) {
  const user = await requireOrgUser();
  const endorsementId = String(formData.get("endorsementId") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (status !== "VERIFIED" && status !== "DECLINED") throw new Error("Invalid status.");

  await prisma.endorsement.updateMany({
    where: { id: endorsementId, endorserId: user.id },
    data: note ? { status, note } : { status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/home");
}
