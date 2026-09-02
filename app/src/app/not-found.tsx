import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function NotFound() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <p className="font-display text-5xl font-semibold text-primary-soft">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-primary">
        That page doesn&rsquo;t exist
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        The link may be out of date, or the profile you&rsquo;re looking for may be private.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={user ? "/home" : "/"}
          className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong"
        >
          {user ? "Back to overview" : "Back to home"}
        </Link>
        {!user && (
          <Link
            href="/login"
            className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-primary hover:text-primary"
          >
            Log in
          </Link>
        )}
      </div>
    </div>
  );
}
