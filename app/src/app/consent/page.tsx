import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatFullDate } from "@/lib/dates";
import { requestConsentAction, recordConsentAction, revokeConsentAction } from "@/lib/actions/consent";
import ConfirmSubmit from "@/components/ConfirmSubmit";

export default async function ConsentPage({ searchParams }: PageProps<"/consent">) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "SCHOOL_ADMIN" || !admin.schoolId) redirect("/login");

  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";

  const students = await prisma.studentProfile.findMany({
    where: {
      schoolId: admin.schoolId,
      ...(q
        ? { user: { OR: [{ name: { contains: q } }, { email: { contains: q } }] } }
        : {}),
    },
    include: { user: true, consent: true },
    orderBy: { createdAt: "desc" },
  });

  const all = await prisma.studentProfile.findMany({
    where: { schoolId: admin.schoolId },
    include: { consent: true },
  });
  const granted = all.filter((s) => s.consent?.status === "GRANTED").length;
  const pending = all.filter((s) => s.consent?.status === "PENDING").length;
  const none = all.filter((s) => !s.consent).length;
  const school = await prisma.school.findUnique({ where: { id: admin.schoolId } });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-primary">Student consent</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
        {school?.name}. A student&rsquo;s record is visible only to them and to you until consent is
        recorded here.
      </p>

      <div className="card mt-5 border-l-4 border-l-accent p-4">
        <p className="text-[13px] font-semibold text-ink">How this works</p>
        <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-ink-soft">
          Trajectory does <strong>not</strong> contact parents or collect consent for you. Your school
          obtains signed consent through its own process. This page is the register where you{" "}
          <strong>record consent you already hold</strong> — which is what makes a student&rsquo;s
          record shareable. Every entry is stamped with your name and the file reference you give.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-2xl font-bold text-verified">{granted}</p>
          <p className="text-xs text-ink-soft">consent recorded</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-pending">{pending}</p>
          <p className="text-xs text-ink-soft">form sent, not yet returned</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-ink">{none}</p>
          <p className="text-xs text-ink-soft">not started</p>
        </div>
      </div>

      <form className="mt-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search students by name or email"
          className="w-full max-w-sm rounded-md border border-line bg-paper-raised px-3 py-2 text-sm text-ink"
        />
        <button className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-soft">
          Search
        </button>
        {q && (
          <Link href="/consent" className="self-center text-sm text-ink-soft underline">
            Clear
          </Link>
        )}
      </form>

      <p className="mt-4 text-xs text-ink-soft">
        Showing {students.length} of {all.length} students
      </p>

      <div className="card mt-2 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Parent / guardian</th>
              <th className="px-4 py-3">Recorded</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-line-soft last:border-0 align-top">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{s.user.name}</p>
                  <p className="text-xs text-ink-soft">{s.user.email}</p>
                  <Link
                    href={`/profile/${s.userId}`}
                    className="mt-1 inline-block text-xs font-semibold text-primary underline"
                  >
                    Preview record
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.consent?.status ?? "NONE"} />
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft">
                  {s.consent ? (
                    <>
                      {s.consent.parentName}
                      <br />
                      {s.consent.parentEmail}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft">
                  {s.consent?.status === "GRANTED" && s.consent.grantedAt ? (
                    <>
                      {formatFullDate(s.consent.grantedAt)}
                      <br />
                      by {s.consent.recordedBy ?? "—"}
                      {s.consent.evidence && (
                        <>
                          <br />
                          <span className="italic">{s.consent.evidence}</span>
                        </>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  {!s.consent && <RequestConsentForm studentProfileId={s.id} />}
                  {s.consent?.status === "PENDING" && (
                    <RecordConsentForm consentId={s.consent.id} studentName={s.user.name} />
                  )}
                  {s.consent?.status === "GRANTED" && (
                    <ConfirmSubmit
                      action={revokeConsentAction}
                      consentId={s.consent.id}
                      confirmText={`Withdraw consent for ${s.user.name}? Their record becomes private again immediately.`}
                      label="Withdraw"
                      className="rounded-md border border-pending px-3 py-1.5 text-xs font-semibold text-pending hover:bg-pending-soft"
                    />
                  )}
                  {s.consent?.status === "REVOKED" && (
                    <RecordConsentForm consentId={s.consent.id} studentName={s.user.name} relabel="Re-record" />
                  )}
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-ink-soft">
                  No students match &ldquo;{q}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    NONE: "tag border-line bg-paper text-ink-soft",
    PENDING: "tag tag-pending",
    GRANTED: "tag tag-verified",
    REVOKED: "tag tag-pending",
  };
  const label: Record<string, string> = {
    NONE: "Not started",
    PENDING: "Form sent",
    GRANTED: "Consent recorded",
    REVOKED: "Withdrawn",
  };
  return <span className={map[status]}>{label[status]}</span>;
}

function RequestConsentForm({ studentProfileId }: { studentProfileId: string }) {
  return (
    <details>
      <summary className="inline-flex cursor-pointer list-none items-center rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft">
        Log a sent form
      </summary>
      <form action={requestConsentAction} className="mt-2 flex w-52 flex-col gap-1.5">
        <input type="hidden" name="studentProfileId" value={studentProfileId} />
        <input name="parentName" placeholder="Parent / guardian name" required className="rounded-md border border-line bg-paper px-2 py-1 text-xs" />
        <input name="parentEmail" type="email" placeholder="Their email" required className="rounded-md border border-line bg-paper px-2 py-1 text-xs" />
        <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-strong">
          Mark form as sent
        </button>
      </form>
    </details>
  );
}

function RecordConsentForm({
  consentId,
  studentName,
  relabel,
}: {
  consentId: string;
  studentName: string;
  relabel?: string;
}) {
  return (
    <details>
      <summary className="inline-flex cursor-pointer list-none items-center rounded-md bg-verified px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
        {relabel ?? "Record consent"}
      </summary>
      <form action={recordConsentAction} className="mt-2 flex w-64 flex-col gap-2 rounded-md border border-line bg-paper p-2.5">
        <input type="hidden" name="consentId" value={consentId} />
        <p className="text-[11px] leading-relaxed text-ink-soft">
          This makes {studentName.split(" ")[0]}&rsquo;s record shareable outside the school.
        </p>
        <input
          name="evidence"
          required
          placeholder="Where is the signed form filed?"
          className="rounded-md border border-line bg-paper-raised px-2 py-1 text-xs"
        />
        <label className="flex items-start gap-2 text-[11px] leading-snug text-ink">
          <input type="checkbox" name="attested" required className="mt-0.5" />
          <span>I have signed parent/guardian consent on file for this student.</span>
        </label>
        <button type="submit" className="rounded-md bg-verified px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
          Record consent
        </button>
      </form>
    </details>
  );
}
