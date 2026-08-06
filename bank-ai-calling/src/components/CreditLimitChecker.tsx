"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function CreditLimitChecker({ exhausted }: { exhausted: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (exhausted && !shown.current) {
      shown.current = true;
      setOpen(true);
    }
  }, [exhausted]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[#BA9B5F]/30 bg-[#F5F0E6] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="credit-limit-dialog-title"
      >
        <h2 id="credit-limit-dialog-title" className="text-lg font-semibold text-[#132B23]">
          Free calls used up
        </h2>
        <p className="mt-2 text-sm text-[#5E775E]">
          You've used all 10 free calls on this account. Upgrade to a paid plan to keep making calls without interruption.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border border-[#BA9B5F]/40 px-4 py-2 text-sm font-medium text-[#132B23] transition-colors hover:bg-[#BA9B5F]/10"
          >
            Dismiss
          </button>
          <button
            onClick={() => router.push("/billing")}
            className="rounded-md bg-[#132B23] px-4 py-2 text-sm font-medium text-[#E9E0CF] transition-colors hover:bg-[#5E775E]"
          >
            View Billing
          </button>
        </div>
      </div>
    </div>
  );
}