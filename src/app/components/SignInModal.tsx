"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSignInModal } from "@/lib/sign-in-modal-context";

export const SignInModal = () => {
  const { open, closeModal } = useSignInModal();
  const { signInWithOtp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    closeModal();
    setEmail("");
    setStatus("idle");
    setErrorMessage(null);
  }, [closeModal]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  const handleGoogleClick = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setStatus("error");
      setErrorMessage(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;
    setStatus("sending");
    setErrorMessage(null);
    const { error } = await signInWithOtp(email.trim());
    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }
    setStatus("sent");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-base font-bold text-ink">Sign in</h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-2"
          >
            ✕
          </button>
        </div>

        {status === "sent" ? (
          <p className="text-[13px] text-ink-muted">
            Check {email} for a sign-in link.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleClick}
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-[13px] font-semibold text-ink hover:bg-surface-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size brand mark, not a content image */}
              <img
                src="/icons/google.svg"
                alt=""
                className="h-4 w-4 flex-shrink-0"
                aria-hidden="true"
              />
              Continue with Google
            </button>

            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-ink-muted">
              <div className="h-px flex-1 bg-border" />
              or
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                aria-describedby={
                  status === "error" ? "signin-error" : undefined
                }
                disabled={status === "sending"}
                className="min-h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="min-h-10 w-full rounded-md bg-accent px-3 py-2 text-[13px] font-semibold text-accent-ink disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send link"}
              </button>
            </form>

            {status === "error" && (
              <span
                id="signin-error"
                className="text-xs text-danger"
                aria-live="polite"
              >
                {errorMessage}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
