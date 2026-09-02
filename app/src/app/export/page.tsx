import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRange } from "@/lib/dates";
import { EXPERIENCE_TYPE_LABELS, type ExperienceType } from "@/lib/enums";
import PrintButton from "@/components/PrintButton";

export default async function ExportPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  // Export is a student artifact; anyone else signed in belongs on their own
  // overview, not on a login screen they're already past.
  if (!user.studentProfile) redirect("/home");

  const entries = await prisma.experienceEntry.findMany({
    where: { studentId: user.studentProfile.id },
    orderBy: { startDate: "desc" },
    include: { endorsements: { include: { endorser: { include: { orgProfile: true } } } } },
  });

  const confirmed = entries.filter((e) => e.endorsements.some((n) => n.status === "VERIFIED"));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="print:hidden">
        <h1 className="font-display text-3xl font-semibold text-primary">Export your record</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          This is your experience formatted as a resume section you can paste into LinkedIn, a college
          application, or a job application. {confirmed.length} of {entries.length} entries have been
          confirmed by the person you worked with — confirmed entries are marked below.
        </p>
        <p className="mt-3 max-w-2xl rounded-md border border-line bg-paper-raised p-3 text-[13px] leading-relaxed text-ink-soft">
          You copy this across yourself. Trajectory doesn&rsquo;t post to LinkedIn for you — their terms
          don&rsquo;t allow it, and it&rsquo;s your record to place where you want.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <PrintButton />
          <Link
            href="/log"
            className="rounded-md border border-line px-4 py-2 text-[13px] font-semibold text-ink-soft hover:border-primary hover:text-primary"
          >
            Back to my log
          </Link>
        </div>
      </div>

      <div className="card mt-6 p-8 print:border-0 print:shadow-none">
        <h2 className="font-display text-2xl font-semibold text-primary">{user.name}</h2>
        <p className="text-sm text-ink-soft">
          {user.studentProfile.headline ?? "Student"} · {user.school?.name}
        </p>

        <h3 className="mt-7 border-b border-line pb-1.5 font-display text-sm font-bold uppercase tracking-wide text-ink">
          Experience
        </h3>

        {entries.length === 0 && (
          <p className="mt-4 text-sm text-ink-soft">
            Nothing to export yet — <Link href="/log" className="text-primary underline">log an experience</Link> first.
          </p>
        )}

        <div className="mt-4 flex flex-col gap-5">
          {entries.map((entry) => {
            const conf = entry.endorsements.find((n) => n.status === "VERIFIED");
            const waiting = !conf && entry.endorsements.some((n) => n.status === "PENDING");
            const refused = !conf && !waiting && entry.endorsements.some((n) => n.status === "DECLINED");
            const who = conf?.endorser?.orgProfile?.orgName ?? conf?.endorser?.name ?? conf?.inviteName;
            return (
              <div key={entry.id}>
                <p className="text-[15px] font-bold text-ink">
                  {entry.title} — {entry.org}
                </p>
                <p className="text-[13px] text-ink-soft">
                  {EXPERIENCE_TYPE_LABELS[entry.type as ExperienceType]} ·{" "}
                  {formatRange(entry.startDate, entry.endDate)}
                </p>
                {entry.description && (
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">{entry.description}</p>
                )}
                {/* Every entry states its status. A refused or unconfirmed entry
                    printed silently next to confirmed ones is how a declined
                    claim ends up on a college-facing document. */}
                {conf ? (
                  <p className="mt-1 text-xs text-verified">
                    ✓ Confirmed by {who}
                    {conf.note ? ` — “${conf.note}”` : ""}
                  </p>
                ) : waiting ? (
                  <p className="mt-1 text-xs text-ink-soft">Awaiting confirmation</p>
                ) : refused ? (
                  <p className="mt-1 text-xs text-ink-soft">Not confirmed — self-reported</p>
                ) : (
                  <p className="mt-1 text-xs text-ink-soft">Self-reported, not yet confirmed</p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 border-t border-line pt-3 text-[11px] text-ink-soft">
          Record kept on Trajectory. Entries marked &ldquo;Confirmed&rdquo; were verified by the
          organization named beneath them. Entries not marked confirmed are the student&rsquo;s own
          account and have not been verified by anyone.
        </p>
      </div>
    </div>
  );
}
