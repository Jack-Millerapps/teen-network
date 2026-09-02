import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRange } from "@/lib/dates";
import { EXPERIENCE_TYPE_LABELS, type ExperienceType } from "@/lib/enums";
import AddExperienceForm from "@/components/AddExperienceForm";
import RequestVerification from "@/components/RequestVerification";
import EditExperience from "@/components/EditExperience";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import { deleteExperienceAction } from "@/lib/actions/experience";

export default async function LogPage() {
  const user = await getCurrentUser();
  if (!user?.studentProfile) redirect("/login");

  const entries = await prisma.experienceEntry.findMany({
    where: { studentId: user.studentProfile.id },
    orderBy: { startDate: "desc" },
    include: { endorsements: { include: { endorser: { include: { orgProfile: true } } } } },
  });

  const orgs = await prisma.user.findMany({
    where: { role: { in: ["MENTOR", "COMPANY"] } },
    include: { orgProfile: true },
    orderBy: { name: "asc" },
  });
  const endorsers = orgs
    .filter((o) => o.orgProfile)
    .map((o) => ({
      id: o.id,
      name: o.name,
      orgName: o.role === "MENTOR" ? `${o.name} — ${o.orgProfile!.orgName}` : o.orgProfile!.orgName,
      orgType: o.orgProfile!.orgType,
    }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-primary">My experience log</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Every job, volunteer shift, club and project you add here becomes part of your record. Add it
        while the details are fresh, then ask the employer or mentor you worked with to confirm it.
      </p>

      <div className="mt-7">
        <AddExperienceForm />
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold text-primary">
        {entries.length === 0 ? "Nothing logged yet" : `${entries.length} logged`}
      </h2>

      {entries.length === 0 ? (
        <div className="card mt-4 p-8 text-center">
          <p className="text-sm font-semibold text-ink">Your log is empty.</p>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-ink-soft">
            Start with anything you&rsquo;ve done in the last year — a summer job, a volunteer shift, a
            club you&rsquo;re in, something you built. It doesn&rsquo;t have to sound impressive; the
            point is to write it down now so you still have the details later.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {entries.map((entry) => (
            <div key={entry.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[15px] font-bold text-ink">{entry.title}</p>
                  <p className="mt-0.5 text-[13px] text-ink-soft">
                    {entry.org} · {EXPERIENCE_TYPE_LABELS[entry.type as ExperienceType]} ·{" "}
                    {formatRange(entry.startDate, entry.endDate)}
                  </p>
                </div>
                <div className="flex flex-none items-center gap-3">
                  <EditExperience
                    entry={entry}
                    isConfirmed={entry.endorsements.some((n) => n.status === "VERIFIED")}
                  />
                  <ConfirmSubmit
                    action={deleteExperienceAction}
                    entryId={entry.id}
                    confirmText={`Delete "${entry.title}"? Any confirmation it has is deleted too. This can't be undone.`}
                    label="Remove"
                    className="text-xs font-medium text-ink-soft underline hover:text-pending"
                  />
                </div>
              </div>

              {entry.description && (
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink">{entry.description}</p>
              )}

              <div className="mt-4 border-t border-line-soft pt-4">
                <RequestVerification
                  entryId={entry.id}
                  entryTitle={entry.title}
                  entryOrg={entry.org}
                  endorsers={endorsers}
                  alreadyAsked={entry.endorsements.map((e) => ({
                    who: e.endorser?.orgProfile?.orgName ?? e.endorser?.name ?? e.inviteName ?? "someone",
                    status: e.status,
                    onPlatform: Boolean(e.endorserId),
                  }))}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
