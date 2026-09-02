"use client";

import { useState } from "react";

export default function ShareProfile({ path, isPublic }: { path: string; isPublic: boolean }) {
  const [copied, setCopied] = useState(false);

  if (!isPublic) return null;

  async function copy() {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard can be blocked; fall back to a selectable prompt.
      window.prompt("Copy your profile link:", url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-primary px-4 py-2 text-[13px] font-semibold text-primary hover:bg-primary-soft"
    >
      {copied ? (
        "Link copied"
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L12 19" />
          </svg>
          Copy profile link
        </>
      )}
    </button>
  );
}
