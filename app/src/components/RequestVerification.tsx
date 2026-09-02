"use client";

import { useState, useTransition } from "react";
import { requestVerificationAction } from "@/lib/actions/endorsement";

type Endorser = { id: string; name: string; orgName: string; orgType: string };
type Asked = { who: string; status: string; onPlatform: boolean };

export default function RequestVerification({
  entryId,
  entryTitle,
  entryOrg,
  endorsers,
  alreadyAsked,
}: {
  entryId: string;
  entryTitle: string;
  entryOrg: string;
  endorsers: Endorser[];
  alreadyAsked: Asked[];
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"invite" | "existing">("invite");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const verified = alreadyAsked.find((a) => a.status === "VERIFIED");
  const waiting = alreadyAsked.find((a) => a.status === "PENDING");
  const declined = alreadyAsked.find((a) => a.status === "DECLINED");

  if (verified) {
    return (
      <p className="text-xs text-verified">
        <strong>Confirmed by {verified.who}.</strong> This entry shows a confirmed badge on your profile.
      </p>
    );
  }

  if (waiting) {
    return (
      <p className="text-xs text-ink-soft">
        Waiting on <strong className="text-ink">{waiting.who}</strong>.{" "}
        {waiting.onPlatform
          ? "They'll see your request next time they sign in."
          : "Trajectory does not email them — you need to tell them yourself. Ask them to sign up at this site with that exact email address and your request will be waiting for them."}
      </p>
    );
  }

  if (!open) {
    return (
      <div>
        {declined ? (
          <p className="mb-2 text-xs text-ink-soft">
            <strong className="text-pending">{declined.who} couldn&rsquo;t confirm this.</strong> They may
            not have recognised the details. Ask someone else who saw the work.
          </p>
        ) : (
          <p className="mb-2 text-xs text-ink-soft">
            Nobody has confirmed this yet. A confirmation from the person you actually worked with is what
            makes it count for more than something you typed about yourself.
          </p>
        )}
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft"
        >
          {declined ? "Ask someone else" : "Ask someone to confirm this"}
        </button>
      </div>
    );
  }

  return (
    <form
      action={(formData: FormData) => {
        setError(null);
        formData.set("entryId", entryId);
        if (mode === "invite") formData.delete("endorserId");
        else {
          formData.delete("inviteName");
          formData.delete("inviteEmail");
        }
        startTransition(async () => {
          try {
            await requestVerificationAction(formData);
            setOpen(false);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong.");
          }
        });
      }}
      className="rounded-md border border-line bg-paper p-3"
    >
      <p className="mb-1 text-xs font-semibold text-ink">
        Who can confirm &ldquo;{entryTitle}&rdquo;?
      </p>
      <p className="mb-2.5 text-[11px] text-ink-soft">
        Ask the person who actually supervised you at {entryOrg} — not someone unrelated. A confirmation
        only means something if it comes from them.
      </p>

      <div className="mb-2.5 flex gap-2 border-b border-line">
        {(
          [
            ["invite", "My supervisor (by email)"],
            ["existing", `Already on Trajectory (${endorsers.length})`],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`-mb-px border-b-2 px-1 pb-1.5 text-[11px] font-semibold ${
              mode === m ? "border-primary text-primary" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "invite" ? (
        <div className="flex flex-col gap-2">
          <input
            name="inviteName"
            placeholder="Their name (e.g. the manager who scheduled you)"
            className="w-full rounded-md border border-line bg-paper-raised px-2 py-1.5 text-xs text-ink"
          />
          <input
            name="inviteEmail"
            type="email"
            placeholder="Their work email"
            className="w-full rounded-md border border-line bg-paper-raised px-2 py-1.5 text-xs text-ink"
          />
          <p className="text-[11px] leading-relaxed text-ink-soft">
            They don&rsquo;t need an account yet — your request waits for them. <strong>We don&rsquo;t
            email them,</strong> so tell them yourself and ask them to sign up with that exact address.
          </p>
        </div>
      ) : endorsers.length > 0 ? (
        <select
          name="endorserId"
          className="w-full rounded-md border border-line bg-paper-raised px-2 py-1.5 text-xs text-ink"
        >
          <option value="">Choose someone…</option>
          {endorsers.map((e) => (
            <option key={e.id} value={e.id}>
              {e.orgName} ({e.orgType === "company" ? "employer" : "mentor"})
            </option>
          ))}
        </select>
      ) : (
        <p className="text-[11px] text-ink-soft">
          Nobody from your school&rsquo;s network has joined yet — use the email tab instead.
        </p>
      )}

      <input
        name="note"
        placeholder="Optional: remind them who you are"
        className="mt-2 w-full rounded-md border border-line bg-paper-raised px-2 py-1.5 text-xs text-ink"
      />

      {error && <p className="mt-2 text-xs text-pending">{error}</p>}

      <div className="mt-2.5 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-strong disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send request"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
