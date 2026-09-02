import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Log in</h1>
      <div className="mt-8 rounded-2xl card p-6">
        <LoginForm />
      </div>
    </div>
  );
}
