"use client";

import { useEffect, useRef, useState } from "react";

interface EditFieldSheetProps {
  label: string;
  initialValue: string;
  inputType?: "text" | "number" | "date";
  placeholder?: string;
  options?: { value: string; label: string }[];
  onSave: (value: string) => Promise<void>;
  onClose: () => void;
}

export const EditFieldSheet = ({
  label,
  initialValue,
  inputType = "text",
  placeholder,
  options,
  onSave,
  onClose,
}: EditFieldSheetProps) => {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await onSave(value.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const isLongField = label === "Injury notes";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${label}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-base font-bold text-ink">{label}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="edit-field-input" className="sr-only">
            {label}
          </label>
          {options ? (
            <select
              id="edit-field-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={saving}
              className="min-h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none focus:border-accent"
            >
              <option value="">Not set</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : isLongField ? (
            <textarea
              id="edit-field-input"
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              rows={4}
              disabled={saving}
              className="min-h-24 w-full rounded-md border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none focus:border-accent"
            />
          ) : (
            <input
              id="edit-field-input"
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={inputType}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              disabled={saving}
              className="min-h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none focus:border-accent"
            />
          )}
          <button
            type="submit"
            disabled={saving}
            className="min-h-10 w-full rounded-md bg-accent px-3 py-2 text-[13px] font-semibold text-accent-ink disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};
