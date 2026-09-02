"use client";

/**
 * A one-click destructive action (un-publishing a student's record, deleting a
 * confirmed entry) deserves a deliberate second step.
 */
export default function ConfirmSubmit({
  action,
  consentId,
  entryId,
  confirmText,
  label,
  className,
}: {
  action: (formData: FormData) => Promise<void>;
  consentId?: string;
  entryId?: string;
  confirmText: string;
  label: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {consentId && <input type="hidden" name="consentId" value={consentId} />}
      {entryId && <input type="hidden" name="entryId" value={entryId} />}
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
