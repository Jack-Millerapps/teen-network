"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  // Controlled fields on purpose: React resets uncontrolled inputs once a form
  // action settles, which would wipe what someone typed every failed attempt.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg card px-3 py-2 text-sm text-ink"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg card px-3 py-2 text-sm text-ink"
        />
      </div>
      {state?.error && (
        <p className="rounded-lg border border-pending-line bg-pending-soft px-3 py-2 text-sm text-pending">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
