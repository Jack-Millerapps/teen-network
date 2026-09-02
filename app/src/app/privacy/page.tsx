export const metadata = { title: "Privacy & student data — Trajectory" };

const sections = [
  {
    h: "Who this is for",
    p: "Trajectory is licensed by a school district and used by its students. Students are minors, so the rules below are stricter than a typical consumer product.",
  },
  {
    h: "What a student's record contains",
    p: "The experiences a student chooses to write down — job, volunteer, club and project entries — plus their name, school, date of birth, and any confirmations an employer or mentor has given.",
  },
  {
    h: "Private by default",
    p: "A student's record is visible only to that student and to staff at their school until the school records parent or guardian consent. There is no public directory, and one student cannot browse another's record.",
  },
  {
    h: "How consent works",
    p: "Trajectory does not contact parents or collect consent itself. The school obtains signed consent through its own process and records it here, stamped with the name of the staff member who recorded it and a reference to where the signed form is filed. Consent can be withdrawn at any time, which makes the record private again immediately.",
  },
  {
    h: "Confirmations",
    p: "An employer or mentor can only confirm an entry a student specifically asked them about. Trajectory does not email them on the student's behalf; the student asks them directly. If a student edits a confirmed entry, the confirmation is removed until it is confirmed again.",
  },
  {
    h: "Data a student controls",
    p: "A student can edit or delete any entry, and export their whole record at any time. Deleting an entry deletes its confirmations.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-primary">Privacy &amp; student data</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Plain-language summary of how student information is handled.
      </p>
      <div className="mt-8 flex flex-col gap-6">
        {sections.map((s) => (
          <section key={s.h} className="card p-6">
            <h2 className="font-display text-lg font-semibold text-primary">{s.h}</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{s.p}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 rounded-md border border-line bg-paper-raised p-4 text-[13px] leading-relaxed text-ink-soft">
        This is a plain-language summary for a demo build, not a completed legal policy. A district
        agreement and a lawyer-reviewed policy would need to be in place before real student data is
        collected.
      </p>
    </div>
  );
}
