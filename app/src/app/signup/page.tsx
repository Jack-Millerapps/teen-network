import { prisma } from "@/lib/prisma";
import SignupForm from "@/components/SignupForm";

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const schools = await prisma.school.findMany({ orderBy: { name: "asc" } });
  const params = await searchParams;
  const initialRole = typeof params.role === "string" ? params.role : undefined;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Student profiles start private. Nothing is visible to anyone
        until your school records consent.
      </p>
      <div className="mt-8 rounded-2xl card p-6">
        <SignupForm schools={schools} initialRole={initialRole} />
      </div>
    </div>
  );
}
