"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile, type ProfileData } from "@/lib/api";
import { EditFieldSheet } from "./EditFieldSheet";

interface FieldConfig {
  key: keyof Pick<ProfileData, "name" | "weight_kg" | "injury_notes">;
  label: string;
  inputType?: "text" | "number" | "date";
  placeholder?: string;
  options?: { value: string; label: string }[];
  format?: (value: string) => string;
}

const FIELDS: FieldConfig[] = [
  { key: "name", label: "Name", placeholder: "Your name" },
  {
    key: "weight_kg",
    label: "Weight (kg)",
    inputType: "number",
    placeholder: "e.g. 70",
  },
  {
    key: "injury_notes",
    label: "Injury notes",
    placeholder: "Anything the coach should know",
  },
];

export const ProfileFields = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (field: FieldConfig, value: string) => {
    const payload =
      field.key === "weight_kg"
        ? { weight_kg: value === "" ? null : Number(value) }
        : { [field.key]: value === "" ? null : value };
    const updated = await updateProfile(payload);
    setProfile(updated);
  };

  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="divide-y divide-border rounded-lg border border-border px-4"
      >
        {FIELDS.map((field) => (
          <div
            key={field.key}
            className="flex min-h-11 items-center justify-between gap-4 py-3"
          >
            <span className="text-[13px] font-medium text-ink-muted/40">
              {field.label}
            </span>
            <span className="h-4 w-16 animate-pulse rounded bg-surface-2 motion-safe-only" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !profile) {
    return (
      <p className="py-3 text-[13px] text-danger">
        Couldn&apos;t load your profile — try reloading.
      </p>
    );
  }

  return (
    <>
      <div className="divide-y divide-border rounded-lg border border-border px-4">
        {FIELDS.map((field) => {
          const rawValue = profile[field.key];
          const displayValue =
            rawValue === null || rawValue === undefined
              ? "Not set"
              : field.format
                ? field.format(String(rawValue))
                : String(rawValue);
          const fromChat = profile.field_sources[field.key] === "chat";

          return (
            <button
              key={field.key}
              onClick={() => setEditingField(field)}
              className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left"
            >
              <span className="text-[13px] font-medium text-ink">
                {field.label}
              </span>
              <span className="flex items-center gap-2 text-[13px] text-ink-muted">
                {fromChat && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                    set from chat
                  </span>
                )}
                <span className="truncate">{displayValue}</span>
              </span>
            </button>
          );
        })}
      </div>

      {editingField && (
        <EditFieldSheet
          label={editingField.label}
          initialValue={
            profile[editingField.key] === null ||
            profile[editingField.key] === undefined
              ? ""
              : String(profile[editingField.key])
          }
          inputType={editingField.inputType}
          placeholder={editingField.placeholder}
          options={editingField.options}
          onSave={(value) => handleSave(editingField, value)}
          onClose={() => setEditingField(null)}
        />
      )}
    </>
  );
};
