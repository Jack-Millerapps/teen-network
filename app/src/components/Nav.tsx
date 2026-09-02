import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/lib/actions/auth";

export default async function Nav() {
  const user = await getCurrentUser();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
    : "";

  let pendingCount = 0;
  if (user && (user.role === "MENTOR" || user.role === "COMPANY")) {
    pendingCount = await prisma.endorsement.count({ where: { endorserId: user.id, status: "PENDING" } });
  }

  const links: { href: string; label: string }[] = user
    ? user.role === "STUDENT"
      ? [
          { href: "/home", label: "Overview" },
          { href: "/log", label: "My log" },
          { href: `/profile/${user.id}`, label: "My profile" },
          { href: "/export", label: "Export" },
        ]
      : user.role === "SCHOOL_ADMIN"
        ? [
            { href: "/home", label: "Overview" },
            { href: "/consent", label: "Student consent" },
          ]
        : [
            { href: "/home", label: "Overview" },
            { href: "/dashboard", label: "Requests" },
          ]
    : [];

  return (
    <header className="border-b-[3px] border-accent bg-primary">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6 sm:py-0" style={{ minHeight: 64 }}>
        <Link href={user ? "/home" : "/"} className="flex flex-none items-center gap-3">
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded border-2 border-paper-raised">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f4f1ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 17 9 11 13 15 21 7" />
              <polyline points="14 7 21 7 21 14" />
            </svg>
          </span>
          <span className="font-display text-[19px] font-semibold tracking-tight text-paper-raised">
            Trajectory
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13.5px] font-medium">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="flex items-center gap-1.5" style={{ color: "#d9d2c3" }}>
              {l.label}
              {l.href === "/dashboard" && pendingCount > 0 && (
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}

          {!user && (
            <>
              <Link href="/login" style={{ color: "#d9d2c3" }}>
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-strong"
              >
                Get started
              </Link>
            </>
          )}

          {user && (
            <>
              <div style={{ width: 1, height: 20, background: "#3a5378" }} />
              <div
                className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold text-paper-raised"
                style={{ background: "#3a5378", border: "1px solid #5a7396" }}
                title={user.name}
              >
                {initials}
              </div>
              <form action={logoutAction}>
                <button type="submit" style={{ color: "#d9d2c3" }}>
                  Log out
                </button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
