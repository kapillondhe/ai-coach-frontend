"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const SignInControl = () => {
  const { session, loading, signInWithOtp, signInWithGoogle, signOut } =
    useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  if (loading) return null;

  if (session) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="hidden text-black/50 sm:inline dark:text-white/50">
          {session.user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="rounded-md px-3 py-1.5 font-medium text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleGoogleClick}
          className="rounded-md border border-black/10 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
        >
          Continue with Google
        </button>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          Sign in
        </button>
        {status === "error" && (
          <span className="text-xs text-red-600" aria-live="polite">
            {errorMessage}
          </span>
        )}
      </div>
    );
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-black/60 dark:text-white/60">
        Check {email} for a sign-in link.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          aria-describedby={status === "error" ? "signin-error" : undefined}
          disabled={status === "sending"}
          className="w-40 rounded-md border border-black/10 px-2 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-white/10 sm:w-56"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send link"}
        </button>
      </form>
      <button
        onClick={handleGoogleClick}
        className="rounded-md border border-black/10 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
      >
        Continue with Google
      </button>
      {status === "error" && (
        <span
          id="signin-error"
          className="text-xs text-red-600"
          aria-live="polite"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};
