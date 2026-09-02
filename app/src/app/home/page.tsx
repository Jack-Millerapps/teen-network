import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function Step({
  n,
  title,
  body,
  done,
  action,
}: {
  n: number;
  title: string;
  body: string;
  done: boolean;
  action?: { href: string; label: string };
}) {
  return (
    <li className="flex gap-4 border-b border-line-soft py-5 last:border-0">
      <div
        className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold ${
          done ? "bg-verified text-white" : "border border-line bg-paper text-ink-soft"
        }`}
      >
        {done ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          n
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold ${done ? "text-ink-soft line-through" : "text-ink"}`}>{title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{body}</p>
        {action && !done && (
          <Link
            href={action.href}
            className="mt-2.5 inline-flex rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-strong"
          >
            {action.label}
          </Link>
        )}
      </div>
    </li>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <div className="border-b border-line px-6 py-4">
        <h2 className="font-display text-lg font-semibold text-primary">{title}</h2>
      </div>
      <div className="px-6">{children}</div>
    </section>
  );
}

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // ---------- STUDENT ----------
  if (user.studentProfile) {
    const entries = await prisma.experienceEntry.findMany({
      where: { studentId: user.studentProfile.id },
      include: { endorsements: true },
    });
    const consent = await prisma.consent.findUnique({ where: { studentId: user.studentProfile.id } });

    const hasEntry = entries.length > 0;
    const hasRequested = entries.some((e) => e.endorsements.length > 0);
    const hasVerified = entries.some((e) => e.endorsements.some((n) => n.status === "VERIFIED"));
    const isPublic = user.studentProfile.isPublic;

    // What actually needs attention right now — the checklist alone goes all-green
    // and then stops being useful, so surface live state above it.
    const waiting = entries.filter(
      (e) => !e.endorsements.some((n) => n.status === "VERIFIED") && e.endorsements.some((n) => n.status === "PENDING")
    ).length;
    const declined = entries.filter(
      (e) => !e.endorsements.some((n) => n.status === "VERIFIED") && e.endorsements.some((n) => n.status === "DECLINED")
    ).length;
    const unasked = entries.filter((e) => e.endorsements.length === 0).length;
    const allDone = hasEntry && hasRequested && hasVerified && isPublic;

    const checklist = (
      <ol>
        <Step
          n={1}
          done={hasEntry}
          title="Log something you've done"
          body="A job, a volunteer shift, a club, a project. Write it down while you remember the details — that's the whole habit this is built around."
          action={{ href: "/log", label: "Log an experience" }}
        />
        <Step
          n={2}
          done={hasRequested}
          title="Ask someone to confirm it"
          body="Pick the employer or mentor you actually worked with. Their confirmation is what makes an entry count for more than something you typed about yourself."
          action={{ href: "/log", label: "Request a confirmation" }}
        />
        <Step
          n={3}
          done={hasVerified}
          title="Get your first confirmed entry"
          body="Once they confirm, a green Confirmed badge shows on your profile next to that entry."
        />
        <Step
          n={4}
          done={isPublic}
          title="Make your profile shareable"
          body={
            isPublic
              ? "Done — your school has consent on file, so you can share your profile link with a mentor, employer or college."
              : consent?.status === "PENDING"
                ? "Your school has sent a consent form to your parent or guardian. Once they respond, your profile can be shared outside the school."
                : "Your profile is private right now. Your school handles this — ask your counselor to send a consent request to your parent or guardian."
          }
        />
      </ol>
    );

    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-primary">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Trajectory is where you keep a running record of the work you actually do — jobs, volunteering,
          clubs, projects — and get the people you did it with to confirm it. When you turn 16 you can
          export the whole thing into LinkedIn.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="card p-4">
            <p className="text-2xl font-bold text-verified">
              {entries.filter((e) => e.endorsements.some((n) => n.status === "VERIFIED")).length}
            </p>
            <p className="text-xs text-ink-soft">confirmed</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-bold text-pending">{waiting}</p>
            <p className="text-xs text-ink-soft">waiting on someone</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-bold text-ink">{unasked + declined}</p>
            <p className="text-xs text-ink-soft">
              {declined > 0 ? `need attention (${declined} declined)` : "not asked yet"}
            </p>
          </div>
        </div>

        {(unasked > 0 || declined > 0) && (
          <div className="card mt-4 border-l-4 border-l-accent p-4">
            <p className="text-sm font-semibold text-ink">
              {declined > 0
                ? `${declined} ${declined === 1 ? "entry was" : "entries were"} declined`
                : `${unasked} ${unasked === 1 ? "entry has" : "entries have"} nobody confirming ${unasked === 1 ? "it" : "them"}`}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
              {declined > 0
                ? "Check the details are right, then ask someone else who saw the work."
                : "An entry counts for more once the person you worked with confirms it."}
            </p>
            <Link
              href="/log"
              className="mt-2.5 inline-flex rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-strong"
            >
              Go to my log
            </Link>
          </div>
        )}

        {/* Once every step is done the checklist has nothing left to say, so it
            collapses instead of sitting on the page announcing "You're set up"
            directly above an alert about something needing attention. */}
        {allDone ? (
          <details className="mt-5">
            <summary className="cursor-pointer list-none text-[13px] font-semibold text-primary underline">
              Show setup checklist (all 4 done)
            </summary>
            <div className="mt-3">
              <Panel title="Setup checklist">{checklist}</Panel>
            </div>
          </details>
        ) : (
          <div className="mt-5">
            <Panel title="Your next steps">{checklist}</Panel>
          </div>
        )}

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Link href="/log" className="card block p-5 hover:border-primary">
            <p className="font-display text-base font-semibold text-primary">My experience log</p>
            <p className="mt-1 text-[13px] text-ink-soft">
              Add new entries and request confirmations. {entries.length} logged so far.
            </p>
          </Link>
          <Link href={`/profile/${user.id}`} className="card block p-5 hover:border-primary">
            <p className="font-display text-base font-semibold text-primary">My profile</p>
            <p className="mt-1 text-[13px] text-ink-soft">
              What a mentor or employer sees. Currently {isPublic ? "shareable" : "private"}.
            </p>
          </Link>
          <Link href="/export" className="card block p-5 hover:border-primary">
            <p className="font-display text-base font-semibold text-primary">Export my record</p>
            <p className="mt-1 text-[13px] text-ink-soft">
              Your experience as a resume section to paste into LinkedIn or an application.
            </p>
          </Link>
        </div>
      </div>
    );
  }

  // ---------- MENTOR / EMPLOYER ----------
  if (user.role === "MENTOR" || user.role === "COMPANY") {
    const pending = await prisma.endorsement.count({ where: { endorserId: user.id, status: "PENDING" } });
    const done = await prisma.endorsement.count({ where: { endorserId: user.id, status: "VERIFIED" } });

    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-primary">
          {user.role === "MENTOR" ? user.name : user.orgProfile?.orgName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Students in your area log the work they do here — shifts, volunteering, projects. When a
          student says they worked with you, they send you a request. Confirming it takes one click and
          gives that student a record they can show a college or a future employer.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="card p-5">
            <p className="text-3xl font-bold text-pending">{pending}</p>
            <p className="mt-1 text-[13px] text-ink-soft">
              {pending === 1 ? "request waiting" : "requests waiting"} on you
            </p>
          </div>
          <div className="card p-5">
            <p className="text-3xl font-bold text-verified">{done}</p>
            <p className="mt-1 text-[13px] text-ink-soft">
              {done === 1 ? "entry you've confirmed" : "entries you've confirmed"}
            </p>
          </div>
        </div>

        {pending === 0 && done === 0 && (
          <div className="card mt-6 border-l-4 border-l-accent p-4">
            <p className="text-sm font-semibold text-ink">Nothing has come in yet — that&rsquo;s normal.</p>
            <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-soft">
              You don&rsquo;t need to search for students; they come to you. Tell any student who has
              worked with you to add the experience to Trajectory and put{" "}
              <strong className="text-ink">{user.email}</strong> as the person who can confirm it.
              Their request will appear here.
            </p>
          </div>
        )}

        <div className="mt-5">
          <Link
            href="/dashboard"
            className="inline-flex rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong"
          >
            {pending > 0 ? `Review ${pending} request${pending === 1 ? "" : "s"}` : "Open requests"}
          </Link>
        </div>
      </div>
    );
  }

  // ---------- SCHOOL ADMIN ----------
  const total = await prisma.studentProfile.count({ where: { schoolId: user.schoolId ?? "" } });
  const granted = await prisma.consent.count({
    where: { status: "GRANTED", student: { schoolId: user.schoolId ?? "" } },
  });
  const awaiting = await prisma.consent.count({
    where: { status: "PENDING", student: { schoolId: user.schoolId ?? "" } },
  });
  // The number an admin actually needs: students with no consent record at all.
  const notStarted = total - granted - awaiting;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-primary">{user.school?.name}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Students at your school build a record of their jobs, volunteering and projects here. A
        student&rsquo;s record stays private to them and to you until a parent or guardian gives
        consent — you record that consent below. Nothing is ever public by default.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <p className="text-3xl font-bold text-primary">{total}</p>
          <p className="mt-1 text-[13px] text-ink-soft">student accounts</p>
        </div>
        <div className="card p-5">
          <p className="text-3xl font-bold text-verified">{granted}</p>
          <p className="mt-1 text-[13px] text-ink-soft">consent on file</p>
        </div>
        <div className="card p-5">
          <p className="text-3xl font-bold text-pending">{awaiting}</p>
          <p className="mt-1 text-[13px] text-ink-soft">form sent, not returned</p>
        </div>
        <div className="card p-5">
          <p className="text-3xl font-bold text-ink">{notStarted}</p>
          <p className="mt-1 text-[13px] text-ink-soft">not started</p>
        </div>
      </div>

      <div className="mt-5">
        <Link
          href="/consent"
          className="inline-flex rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong"
        >
          Manage student consent
        </Link>
      </div>
    </div>
  );
}
