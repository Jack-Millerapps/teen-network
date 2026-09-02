"use client";

import { useState, useTransition } from "react";
import { updateExperienceAction } from "@/lib/actions/experience";
import { EXPERIENCE_TYPES, EXPERIENCE_TYPE_LABELS, type ExperienceType } from "@/lib/enums";

function toInput(d: Date | null) {
  return d ? d.toISOString().slice(0, 10) : "";
}

export default function EditExperience({
  entry,
  isConfirmed,
}: {
  isConfirmed?: boolean;
  entry: {
    id: string;
    type: string;
    title: string;
    org: string;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-ink-soft underline hover:text-primary"
      >
        Edit
      </button>
    );
  }

  return (
    <form
      action={(fd: FormData) => {
        setError(null);
        fd.set("entryId", entry.id);
        startTransition(async () => {
          try {
            await updateExperienceAction(fd);
            setOpen(false);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Couldn't save that.");
          }
        });
      }}
      className="mt-3 flex flex-col gap-2 rounded-md border border-line bg-paper p-3"
    >
      <p className="text-xs font-semibold text-ink">Edit this entry</p>
      {isConfirmed && (
        <p className="rounded-md border border-pending-line bg-pending-soft px-2 py-1.5 text-[11px] leading-relaxed text-pending">
          This entry has been confirmed. Changing the job, dates or description sends it back for
          re-confirmation — the badge is removed until they confirm the new version.
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <select name="type" defaultValue={entry.type} className="rounded-md border border-line bg-paper-raised px-2 py-1.5 text-xs">
          {EXPERIENCE_TYPES.map((t: ExperienceType) => (
            <option key={t} value={t}>
              {EXPERIENCE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <input name="org" defaultValue={entry.org} required className="rounded-md border border-line bg-paper-raised px-2 py-1.5 text-xs" />
      </div>
      <input name="title" defaultValue={entry.title} required className="rounded-md border border-line bg-paper-raised px-2 py-1.5 text-xs" />
      <textarea
        name="description"
        defaultValue={entry.description ?? ""}
        rows={2}
        className="rounded-md border border-line bg-paper-raised px-2 py-1.5 text-xs"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-[11px] text-ink-soft">
          Start
          <input type="date" name="startDate" defaultValue={toInput(entry.startDate)} required className="mt-0.5 w-full rounded-md border border-line bg-paper-raised px-2 py-1.5 text-xs" />
        </label>
        <label className="text-[11px] text-ink-soft">
          End (blank if ongoing)
          <input type="date" name="endDate" defaultValue={toInput(entry.endDate)} className="mt-0.5 w-full rounded-md border border-line bg-paper-raised px-2 py-1.5 text-xs" />
        </label>
      </div>
      {error && <p className="text-xs text-pending">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-strong disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft">
          Cancel
        </button>
      </div>
    </form>
  );
}
