import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRange } from "@/lib/dates";
import { EXPERIENCE_TYPE_LABELS, type ExperienceType } from "@/lib/enums";
import { setEndorsementStatusAction } from "@/lib/actions/endorsement";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "MENTOR" && user.role !== "COMPANY")) redirect("/login");

  const endorsements = await prisma.endorsement.findMany({
    where: { endorserId: user.id },
    include: { entry: { include: { student: { include: { user: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  // An individual mentor is a person; only a company is an organisation.
  const displayName =
    user.role === "MENTOR" ? user.name : (user.orgProfile?.orgName ?? user.name);

  const pending = endorsements.filter((e) => e.status === "PENDING");
  const decided = endorsements.filter((e) => e.status !== "PENDING");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-primary">Confirmation requests</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
        These are students saying they worked with {displayName}. Confirming means you can
        say that what they wrote is accurate — it then shows as confirmed on their record. If you
        don&rsquo;t recognise someone, decline. Either way the student is told your answer, so they
        can correct the entry or ask someone else.
      </p>

      <h2 className="mt-9 font-display text-xl font-semibold text-primary">
        Waiting on you ({pending.length})
      </h2>

      {pending.length === 0 ? (
        <div className="card mt-4 p-8 text-center">
          <p className="text-sm font-semibold text-ink">Nothing to review right now.</p>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-ink-soft">
            When a student adds an experience and names {displayName} as the place they did
            it, their request lands here. You&rsquo;ll see what they wrote before deciding.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {pending.map((e) => (
            <div key={e.id} className="card p-5">
              <p className="text-[13px] text-ink-soft">
                <strong className="text-ink">{e.entry.student.user.name}</strong> says they did this with you:{" "}
                <Link
                  href={`/profile/${e.entry.student.userId}`}
                  className="font-semibold text-primary underline"
                >
                  see their record
                </Link>
              </p>
              <div className="mt-3 rounded-md border border-line bg-paper p-4">
                <p className="text-[15px] font-bold text-ink">{e.entry.title}</p>
                <p className="mt-0.5 text-[13px] text-ink-soft">
                  {e.entry.org} · {EXPERIENCE_TYPE_LABELS[e.entry.type as ExperienceType]} ·{" "}
                  {formatRange(e.entry.startDate, e.entry.endDate)}
                </p>
                {e.entry.description && (
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink">{e.entry.description}</p>
                )}
              </div>
              {e.requestNote && (
                <p className="mt-3 border-l-2 border-line pl-3 text-[13px] text-ink-soft">
                  Note from {e.entry.student.user.name.split(" ")[0]}: &ldquo;{e.requestNote}&rdquo;
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <form action={setEndorsementStatusAction} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="endorsementId" value={e.id} />
                  <input type="hidden" name="status" value="VERIFIED" />
                  <input
                    name="note"
                    placeholder="Optional: add a line about their work"
                    className="w-64 rounded-md border border-line bg-paper px-2.5 py-2 text-xs text-ink"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-verified px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Yes, I can confirm this
                  </button>
                </form>
                <form action={setEndorsementStatusAction}>
                  <input type="hidden" name="endorsementId" value={e.id} />
                  <input type="hidden" name="status" value="DECLINED" />
                  <button
                    type="submit"
                    className="rounded-md border border-line px-3.5 py-2 text-xs font-semibold text-ink-soft hover:border-pending hover:text-pending"
                  >
                    I can&rsquo;t confirm this
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {decided.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-xl font-semibold text-primary">Already answered</h2>
          <div className="mt-4 flex flex-col gap-2">
            {decided.map((e) => (
              <div key={e.id} className="card flex items-center justify-between gap-4 px-5 py-3.5">
                <div>
                  <p className="text-sm text-ink">{e.entry.title}</p>
                  <p className="text-xs text-ink-soft">{e.entry.student.user.name}</p>
                </div>
                <span className={`tag ${e.status === "VERIFIED" ? "tag-verified" : "tag-pending"}`}>
                  {e.status === "VERIFIED" ? "Confirmed" : "Declined"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="mt-8 text-xs text-ink-soft">
        <Link href="/home" className="font-semibold text-primary underline">
          Back to overview
        </Link>
      </p>
    </div>
  );
}
