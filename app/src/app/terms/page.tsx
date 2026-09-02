export const metadata = { title: "Terms — Trajectory" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-primary">Terms</h1>
      <div className="mt-8 flex flex-col gap-6">
        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-primary">Accounts</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
            Student accounts are provided through a participating school. Employer and mentor accounts
            are free and exist only to answer confirmation requests students send them.
          </p>
        </section>
        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-primary">Honest records</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
            Students are responsible for the accuracy of what they log. Confirmations are statements by
            the organization that gave them. Confirming an experience you did not supervise, or logging
            work you did not do, is grounds for removal.
          </p>
        </section>
        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-primary">Exports</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
            A student may export their record at any time and use it wherever they like. Trajectory does
            not post to LinkedIn or any other platform on a student&rsquo;s behalf.
          </p>
        </section>
      </div>
      <p className="mt-8 rounded-md border border-line bg-paper-raised p-4 text-[13px] leading-relaxed text-ink-soft">
        Placeholder terms for a demo build — not a completed legal agreement.
      </p>
    </div>
  );
}
