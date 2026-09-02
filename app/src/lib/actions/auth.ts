"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, clearSession } from "@/lib/auth";
import { ROLES, type Role } from "@/lib/enums";

export type FormState = { error?: string; email?: string; name?: string } | undefined;

export async function signupAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const role = String(formData.get("role") ?? "") as Role;
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!ROLES.includes(role) || !name || !email || password.length < 8) {
    return { error: "Fill in every field — password needs at least 8 characters.", email, name };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists. Try logging in instead.", email, name };

  const passwordHash = await hashPassword(password);

  if (role === "STUDENT") {
    const schoolId = String(formData.get("schoolId") ?? "");
    const birthdate = String(formData.get("birthdate") ?? "");
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school || !birthdate) return { error: "Select a school and date of birth.", email, name };

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        schoolId,
        studentProfile: {
          create: {
            birthdate: new Date(birthdate),
            schoolId,
            isPublic: false,
          },
        },
      },
    });
    await createSession(user.id);
    redirect("/home");
  } else if (role === "MENTOR" || role === "COMPANY") {
    const orgName = String(formData.get("orgName") ?? "").trim();
    if (!orgName) return { error: "Enter the name of your organization.", email, name };

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        orgProfile: {
          create: {
            orgName,
            orgType: role === "MENTOR" ? "mentor" : "company",
          },
        },
      },
    });
    // Any request a student addressed to this email is now claimable by the
    // account that just signed up, so an invite doesn't dead-end at signup.
    await prisma.endorsement.updateMany({
      where: { inviteEmail: email, endorserId: null },
      data: { endorserId: user.id },
    });
    await createSession(user.id);
    redirect("/home");
  } else {
    const schoolId = String(formData.get("schoolId") ?? "");
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) return { error: "Select the school you administer.", email, name };

    const user = await prisma.user.create({
      data: { email, name, passwordHash, role, schoolId },
    });
    await createSession(user.id);
    redirect("/home");
  }
}

export async function loginAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "That email and password don't match an account.", email };
  }
  await createSession(user.id);

  redirect("/home");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
