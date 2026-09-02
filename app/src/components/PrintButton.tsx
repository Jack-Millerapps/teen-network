"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:bg-primary-strong"
    >
      Print or save as PDF
    </button>
  );
}
