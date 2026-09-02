"use client";

import { useRef, useTransition } from "react";
import { addExperienceAction } from "@/lib/actions/experience";
import { EXPERIENCE_TYPES, EXPERIENCE_TYPE_LABELS, type ExperienceType } from "@/lib/enums";

export default function AddExperienceForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData: FormData) => {
        startTransition(async () => {
          await addExperienceAction(formData);
          formRef.current?.reset();
        });
      }}
      className="space-y-4 rounded-2xl card p-6"
    >
      <h2 className="font-display text-lg font-bold text-ink">Log new experience</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Type</label>
          <select name="type" required className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink">
            {EXPERIENCE_TYPES.map((t: ExperienceType) => (
              <option key={t} value={t}>
                {EXPERIENCE_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Organization</label>
          <input name="org" required className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink" placeholder="e.g. Riverbend Coffee Roasters" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Title / role</label>
        <input name="title" required className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink" placeholder="e.g. Counter Lead" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">What did you do?</label>
        <textarea name="description" rows={3} className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink" placeholder="A sentence or two — this is what the person you worked with will see when deciding whether to confirm it." />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Start date</label>
          <input name="startDate" type="date" required className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">End date (leave blank if ongoing)</label>
          <input name="endDate" type="date" className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink" />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Saving…" : "Add to my log"}
      </button>
    </form>
  );
}
