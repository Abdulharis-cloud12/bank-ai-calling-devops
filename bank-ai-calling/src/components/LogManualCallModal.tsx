"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogManualCallModal({ customerId, customerName }: { customerId: string; customerName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  async function handleSave() {
    if (!notes.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/customers/${customerId}/manual-call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to save call log.");
      return;
    }

    toast.success("Manual call logged.");
    setNotes("");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-[#5E775E]/40 px-2.5 py-1 text-xs font-medium text-[#5E775E] transition-colors hover:bg-[#5E775E]/10"
      >
        Log Manual Call
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => !saving && setOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#BA9B5F]/30 bg-[#F5F0E6] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manual-call-dialog-title"
          >
            <h2 id="manual-call-dialog-title" className="text-lg font-semibold text-[#132B23]">
              Log call with {customerName}
            </h2>
            <p className="mt-1 text-sm text-[#5E775E]">
              Describe what was discussed, in your own words. The system will extract the outcome, next action, and follow-up date automatically.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="e.g. Spoke with the customer. He is interested but wants to discuss pricing with his partner. Asked me to call again on Friday."
              className="mt-3 w-full rounded-md border border-[#BA9B5F]/40 bg-white px-3 py-2 text-sm text-[#132B23] outline-none focus:border-[#5E775E] focus:ring-2 focus:ring-[#5E775E]/30"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={saving}
                className="rounded-md border border-[#BA9B5F]/40 px-4 py-2 text-sm font-medium text-[#132B23] transition-colors hover:bg-[#BA9B5F]/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !notes.trim()}
                className="rounded-md bg-[#132B23] px-4 py-2 text-sm font-medium text-[#E9E0CF] transition-colors hover:bg-[#5E775E] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save & Extract"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}