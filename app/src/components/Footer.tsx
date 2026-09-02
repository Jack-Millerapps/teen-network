import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-paper-raised">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs text-ink-soft sm:px-6">
        <p>© {new Date().getFullYear()} Trajectory · Provided to students through their school district.</p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/privacy" className="underline hover:text-primary">
            Privacy &amp; student data
          </Link>
          <Link href="/terms" className="underline hover:text-primary">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
