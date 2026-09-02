import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatRange } from "@/lib/dates";
import { getCurrentUser } from "@/lib/auth";
import { EXPERIENCE_TYPE_LABELS, type ExperienceType } from "@/lib/enums";
import ShareProfile from "@/components/ShareProfile";

function TypeIcon({ type }: { type: ExperienceType }) {
  const paths: Record<ExperienceType, React.ReactNode> = {
    JOB: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="1.5" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    VOLUNTEER: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />,
    PROJECT: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
    EXTRACURRICULAR: <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.7 7.1-.6z" />,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-strong)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
}

export default async function ProfilePage({ params }: PageProps<"/profile/[id]">) {
  const { id } = await params;
  const viewer = await getCurrentUser();

  const profileUser = await prisma.user.findUnique({
    where: { id },
    include: {
      school: true,
      studentProfile: {
        include: {
          consent: true,
          entries: {
            orderBy: { startDate: "desc" },
            include: { endorsements: { include: { endorser: { include: { orgProfile: true } } } } },
          },
        },
      },
    },
  });

  if (!profileUser?.studentProfile) notFound();

  const student = profileUser.studentProfile;
  const isOwner = viewer?.id === profileUser.id;
  const isSchoolStaff = viewer?.role === "SCHOOL_ADMIN" && viewer.schoolId === profileUser.schoolId;
  const canView = student.isPublic || isOwner || isSchoolStaff;

  if (!canView) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl font-bold text-ink">This profile is private</p>
        <p className="mt-2 text-sm text-ink-soft">
          It becomes visible once {profileUser.name.split(" ")[0]}&rsquo;s school records
          parent/guardian consent.
        </p>
      </div>
    );
  }

  const isViewerOrg = viewer?.role === "MENTOR" || viewer?.role === "COMPANY";

  const verifiedCount = student.entries.filter((e) => e.endorsements.some((en) => en.status === "VERIFIED")).length;
  const pendingCount = student.entries.filter(
    (e) => !e.endorsements.some((en) => en.status === "VERIFIED") && e.endorsements.some((en) => en.status === "PENDING")
  ).length;
  const unconfirmedCount = student.entries.length - verifiedCount - pendingCount;
  const areas = Array.from(new Set(student.entries.map((e) => EXPERIENCE_TYPE_LABELS[e.type as ExperienceType])));
  const schoolStudentCount = await prisma.studentProfile.count({ where: { schoolId: student.schoolId } });

  return (
    <div>
      <div className="border-b border-line bg-paper-raised px-4 py-3 text-xs text-ink-soft sm:px-6">
        <div className="mx-auto max-w-5xl">
          <span className="font-semibold uppercase tracking-wide text-ink-faint">Student record</span>
          <span className="mx-2">·</span>
          {profileUser.school?.name}, {profileUser.school?.district}
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <div className="card p-8">
            <div className="flex flex-wrap items-start gap-6">
              <div className="flex h-[88px] w-[88px] flex-none items-center justify-center overflow-hidden rounded-md border border-line bg-primary-soft">
                {student.avatarUrl ? (
                  <Image src={student.avatarUrl} alt={profileUser.name} width={88} height={88} className="h-full w-full object-cover" />
                ) : (
                  <svg width="88" height="88" viewBox="0 0 88 88">
                    <rect width="88" height="88" fill="var(--navy-soft)" />
                    <circle cx="44" cy="33" r="15" fill="#9fb4c7" />
                    <path d="M14 82 C14 62 27 55 44 55 C61 55 74 62 74 82 Z" fill="#9fb4c7" />
                  </svg>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display text-[27px] font-semibold text-primary">{profileUser.name}</h1>
                    {student.headline && <p className="mt-1.5 text-[14.5px] text-ink-soft">{student.headline}</p>}
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                      {profileUser.school?.name}
                    </p>
                  </div>
                  <span
                    className={`tag whitespace-nowrap ${student.isPublic ? "tag-verified" : "tag-pending"}`}
                  >
                    {student.isPublic ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Consent on file
                      </>
                    ) : (
                      "Private"
                    )}
                  </span>
                </div>

                {student.bio && <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink">{student.bio}</p>}

                {isOwner && (
                  <>
                    <p className="mt-4 max-w-xl rounded-md border border-line bg-paper p-3 text-[13px] leading-relaxed text-ink-soft">
                      {student.isPublic ? (
                        <>
                          <strong className="text-ink">This is what other people see.</strong> Your school
                          has consent on file, so you can share this page with a mentor, employer or
                          college.
                        </>
                      ) : (
                        <>
                          <strong className="text-ink">Only you and your school can see this page.</strong>{" "}
                          It stays private until a parent or guardian gives consent — your school
                          counselor sends that request, so ask them if you want it shareable.
                        </>
                      )}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href="/log"
                        className="inline-flex rounded-md border border-primary px-4 py-2 text-[13px] font-semibold text-primary hover:bg-primary-soft"
                      >
                        Add or edit experience
                      </a>
                      <ShareProfile path={`/profile/${profileUser.id}`} isPublic={student.isPublic} />
                      <a
                        href="/export"
                        className="inline-flex rounded-md border border-line px-4 py-2 text-[13px] font-semibold text-ink-soft hover:border-primary hover:text-primary"
                      >
                        Export
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <section className="card mt-5">
            <div className="border-b border-line px-8 py-[22px]">
              <h2 className="font-display text-lg font-semibold text-primary">Experience</h2>
              {!isOwner && !isViewerOrg && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                  A <span className="tag tag-verified align-middle">Confirmed</span> entry was verified by
                  the organization named under it — not by the student. Unconfirmed entries are the
                  student&rsquo;s own account of their work.
                </p>
              )}
              {isViewerOrg && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                  You can only confirm entries a student has asked you about — those arrive in your{" "}
                  <a href="/dashboard" className="font-semibold text-primary underline">
                    requests
                  </a>
                  . That way a confirmation always comes from someone the student actually worked with.
                </p>
              )}
            </div>
            {student.entries.length === 0 && (
              <div className="px-8 py-10 text-center">
                <p className="text-sm font-semibold text-ink">Nothing here yet.</p>
                <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-ink-soft">
                  {isOwner
                    ? "Once you log a job, volunteer shift, club or project, it appears here for anyone you share this page with."
                    : `${profileUser.name.split(" ")[0]} hasn't logged any experience yet.`}
                </p>
                {isOwner && (
                  <a
                    href="/log"
                    className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:bg-primary-strong"
                  >
                    Log your first experience
                  </a>
                )}
              </div>
            )}
            <div className="px-8">
              {student.entries.map((entry, i) => {
                const verified = entry.endorsements.some((e) => e.status === "VERIFIED");
                const pendingEndorsement = entry.endorsements.find((e) => e.status === "PENDING");
                const declinedEndorsement = entry.endorsements.find((e) => e.status === "DECLINED");
                return (
                  <div
                    key={entry.id}
                    className={`flex gap-[18px] py-[26px] ${i < student.entries.length - 1 ? "border-b border-line-soft" : ""}`}
                  >
                    <div className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-md border border-line bg-paper">
                      <TypeIcon type={entry.type as ExperienceType} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <p className="text-[15px] font-bold text-ink">{entry.title}</p>
                        {verified && <span className="tag tag-verified">Confirmed</span>}
                        {!verified && pendingEndorsement && <span className="tag tag-pending">Awaiting confirmation</span>}
                        {!verified && !pendingEndorsement && declinedEndorsement && (
                          <span className="tag border-line bg-paper text-ink-soft">Not confirmed</span>
                        )}
                        {!verified && !pendingEndorsement && !declinedEndorsement && (
                          <span className="tag border-line bg-paper text-ink-soft">Self-reported</span>
                        )}
                      </div>
                      <p className="mt-1 text-[13.5px] text-ink-soft">
                        {entry.org} · {EXPERIENCE_TYPE_LABELS[entry.type as ExperienceType]} · {formatRange(entry.startDate, entry.endDate)}
                      </p>
                      {entry.description && <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink">{entry.description}</p>}

                      {/* Only an endorser's OWN words are ever quoted here; the
                          student's request message lives on requestNote and must
                          never render as third-party testimony. */}
                      {entry.endorsements
                        .filter((e) => e.status === "VERIFIED")
                        .map((e) => {
                          const who = e.endorser?.orgProfile?.orgName ?? e.endorser?.name ?? e.inviteName ?? "a verifier";
                          return (
                            <p key={e.id} className="mt-2.5 border-l-2 border-verified-line pl-2.5 text-xs text-ink-soft">
                              {e.note ? (
                                <>
                                  &ldquo;{e.note}&rdquo; — <span className="font-semibold text-ink">{who}</span>
                                </>
                              ) : (
                                <>
                                  Confirmed by <span className="font-semibold text-ink">{who}</span>
                                </>
                              )}
                            </p>
                          );
                        })}

                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-20">
          <div className="card p-5">
            <p className="mb-3 text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">Confirmations</p>
            <dl className="text-sm">
              <div className="flex items-center justify-between border-b border-line-soft py-2">
                <dt className="text-ink-soft">Confirmed entries</dt>
                <dd className="font-bold text-verified">{verifiedCount}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-line-soft py-2">
                <dt className="text-ink-soft">Awaiting confirmation</dt>
                <dd className="font-bold text-pending">{pendingCount}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-line-soft py-2">
                <dt className="text-ink-soft">Not confirmed</dt>
                <dd className="font-bold text-ink">{unconfirmedCount}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-line-soft py-2">
                <dt className="text-ink-soft">Total entries</dt>
                <dd className="font-bold text-ink">{student.entries.length}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-ink-soft">District consent</dt>
                <dd className="font-bold text-primary">{student.consent?.status === "GRANTED" ? "On file" : "Not on file"}</dd>
              </div>
            </dl>
          </div>

          {areas.length > 0 && (
            <div className="card p-5">
              <p className="mb-3 text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">Experience areas</p>
              <div className="flex flex-wrap gap-2">
                {areas.map((a) => (
                  <span key={a} className="rounded-md border border-line bg-primary-soft px-2.5 py-1.5 text-xs font-semibold text-primary">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="card p-5">
            <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">School</p>
            <p className="font-display text-[15px] font-semibold text-primary">{profileUser.school?.name}</p>
            <p className="text-xs text-ink-soft">{profileUser.school?.district}</p>
            {schoolStudentCount > 1 && (
              <p className="mt-3 border-t border-line-soft pt-3 text-xs leading-relaxed text-ink-soft">
                {schoolStudentCount} students at this school are building a log on Trajectory. Individual
                records stay private until each student&rsquo;s own consent makes them public — there&rsquo;s
                no public directory to browse.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
