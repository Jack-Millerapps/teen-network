import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const SECRET = process.env.AUTH_SECRET ?? "teen-network-dev-secret-change-me";
const COOKIE_NAME = "tn_session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = jwt.sign({ userId }, SECRET, { expiresIn: "30d" });
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SECRET) as { userId: string };
    return prisma.user.findUnique({
      where: { id: payload.userId },
      include: { studentProfile: true, orgProfile: true, school: true },
    });
  } catch {
    return null;
  }
}
