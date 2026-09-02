"use client";

import { useActionState, useState } from "react";
import { signupAction } from "@/lib/actions/auth";

type School = { id: string; name: string; district: string };

const ROLE_OPTIONS = [
  { value: "STUDENT", label: "Student", blurb: "Log what you do and get it confirmed." },
  { value: "MENTOR", label: "Mentor", blurb: "Confirm experience for students you mentor." },
  { value: "COMPANY", label: "Company", blurb: "Confirm experience for students who worked for you." },
  { value: "SCHOOL_ADMIN", label: "School admin", blurb: "Record parent consent for your students." },
] as const;

export default function SignupForm({
  schools,
  initialRole,
}: {
  schools: School[];
  initialRole?: string;
}) {
  const valid = ROLE_OPTIONS.some((o) => o.value === initialRole);
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]["value"]>(
    valid ? (initialRole as (typeof ROLE_OPTIONS)[number]["value"]) : "STUDENT"
  );
  const [state, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-ink">I am a…</label>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setRole(opt.value)}
              className={`rounded-xl border p-3 text-left transition ${
                role === opt.value
                  ? "border-primary bg-primary-soft"
                  : "border-line bg-paper-raised hover:border-primary"
              }`}
            >
              <p className="text-sm font-semibold text-ink">{opt.label}</p>
              <p className="text-xs text-ink-soft">{opt.blurb}</p>
            </button>
          ))}
        </div>
        <input type="hidden" name="role" value={role} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" type="text" required defaultValue={state?.name} />
        <Field label="Email" name="email" type="email" required defaultValue={state?.email} />
      </div>
      <Field label="Password" name="password" type="password" required minLength={8} hint="At least 8 characters." />

      {role === "STUDENT" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">School</label>
            <select
              name="schoolId"
              required
              className="w-full rounded-lg card px-3 py-2 text-sm text-ink"
            >
              <option value="">Select your school</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.district}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-ink-soft">
              School not listed? Trajectory is provided by your district — ask your counselor whether
              your school has it yet.
            </p>
          </div>
          <Field label="Date of birth" name="birthdate" type="date" required />
        </div>
      )}

      {(role === "MENTOR" || role === "COMPANY") && (
        <Field
          label={role === "MENTOR" ? "Organization you volunteer with" : "Company name"}
          name="orgName"
          type="text"
          required
        />
      )}

      {role === "SCHOOL_ADMIN" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">School you administer</label>
          <select
            name="schoolId"
            required
            className="w-full rounded-lg card px-3 py-2 text-sm text-ink"
          >
            <option value="">Select a school</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.district}
              </option>
            ))}
          </select>
        </div>
      )}

      {state?.error && <p className="rounded-lg bg-pending-soft px-3 py-2 text-sm text-pending">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  minLength,
  hint,
  defaultValue,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  minLength?: number;
  hint?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-lg card px-3 py-2 text-sm text-ink"
      />
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
