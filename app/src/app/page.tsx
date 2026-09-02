import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Log experience as it happens",
    body: "Jobs, volunteering, clubs, and projects — recorded the week it happens, not reconstructed from memory senior year.",
  },
  {
    n: "02",
    title: "Get it confirmed, not just written",
    body: "The employer or mentor they actually worked with confirms it, so an entry carries more weight than a self-written resume line.",
  },
  {
    n: "03",
    title: "Carry it forward at 16",
    body: "A formatted export a student takes with them into a real LinkedIn profile when they're old enough to make one.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center rounded-md bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Built for schools, not families
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
              The professional record students start building at 13,
              not 22.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              Trajectory is a private-by-default experience log for
              students — confirmed by the mentors and local employers they actually worked with,
              provided by their school district, exported into LinkedIn
              the day they&rsquo;re old enough for one.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="rounded-md bg-accent px-6 py-3 font-semibold text-white shadow-sm shadow-accent/30 hover:bg-accent-strong"
              >
                Create an account
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-line px-6 py-3 font-semibold text-ink hover:border-primary hover:text-primary"
              >
                I already have one
              </Link>
            </div>
            <p className="mt-6 text-sm text-ink-soft">
              Profiles are private until a school records parent/guardian
              consent. Nothing is public by default.
            </p>
          </div>

          <div className="rounded-2xl card p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <div className="h-12 w-12 rounded-md bg-primary-soft" />
              <div>
                <p className="font-display font-semibold text-ink">Ava Thompson</p>
                <p className="text-sm text-ink-soft">Junior · Maple Ridge High School</p>
              </div>
              <span className="ml-auto rounded-md bg-verified-soft px-2 py-1 text-xs font-semibold text-verified">
                Public · consent on file
              </span>
            </div>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-none rounded-md bg-accent" />
                <div>
                  <p className="text-sm font-semibold text-ink">Counter Lead — Riverbend Coffee Roasters</p>
                  <p className="text-xs text-ink-soft">Jul 2025 – Present · Confirmed by employer</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-none rounded-md bg-accent" />
                <div>
                  <p className="text-sm font-semibold text-ink">Volunteer Handler — Maple Ridge Animal Shelter</p>
                  <p className="text-xs text-ink-soft">Jan 2025 – Present · Confirmed by mentor</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-none rounded-md bg-line" />
                <div>
                  <p className="text-sm font-semibold text-ink">Lead Builder — FRC Robotics Team 4118</p>
                  <p className="text-xs text-ink-soft">Sep 2024 – Present · Awaiting confirmation</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-raised">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-ink">Who uses it</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Each kind of account has one job.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              {
                who: "Students",
                does: "Write down each job, volunteer shift, club and project — then ask the employer or mentor they worked with to confirm it.",
              },
              {
                who: "Employers & mentors",
                does: "Get a short request saying a student worked with you. One click confirms it. That's the whole commitment.",
              },
              {
                who: "Schools",
                does: "Record parent consent for each student. Nothing a student writes is visible outside the school until that consent is on file.",
              },
            ].map((r) => (
              <div key={r.who} className="rounded-md border border-line bg-paper p-5">
                <p className="font-display text-base font-semibold text-primary">{r.who}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{r.does}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-ink">How it works</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n}>
                <p className="font-display text-3xl font-bold text-primary-soft">{step.n}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="card p-7">
            <h2 className="font-display text-xl font-semibold text-primary">
              Were you asked to confirm a student&rsquo;s experience?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
              A student you worked with listed you as the person who can confirm what they did. Create a
              free account with the email they used and the request will be waiting — reviewing it takes
              about a minute, and you&rsquo;re never asked for anything else.
            </p>
            <Link
              href="/signup?role=COMPANY"
              className="mt-4 inline-flex rounded-md border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft"
            >
              Set up an employer or mentor account
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl bg-primary px-8 py-10 text-white">
          <h2 className="font-display text-2xl font-bold">$8 per student, per year — billed to the district</h2>
          <p className="mt-2 max-w-2xl text-primary-soft">
            Students and families never see a bill. It&rsquo;s part of what
            the school already provides, like Naviance or Clever.
          </p>
        </div>
      </section>
    </div>
  );
}
