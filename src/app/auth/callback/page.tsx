"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

// supabase-js exchanges the `?code=` param for a session automatically; we just watch for it.
const REDIRECT_TIMEOUT_MS = 5000;

const readErrorDescription = (): string | null => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("error_description");
};

const AuthCallbackPage = () => {
  const router = useRouter();
  const { session } = useAuth();
  const [errorMessage] = useState<string | null>(readErrorDescription);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (errorMessage) return;

    if (session) {
      router.replace("/");
      return;
    }

    const timeout = window.setTimeout(
      () => setTimedOut(true),
      REDIRECT_TIMEOUT_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [router, errorMessage, session]);

  const failed = Boolean(errorMessage) || timedOut;
  const message =
    errorMessage ??
    (timedOut
      ? "Sign-in is taking longer than expected — the link may be invalid or expired."
      : null);

  return (
    <main className="mx-auto flex h-screen max-w-2xl flex-col items-center justify-center p-4 text-center">
      {!failed && (
        <p className="text-sm text-black/60 dark:text-white/60">
          Signing you in…
        </p>
      )}
      {failed && (
        <>
          <p className="mb-3 text-sm text-red-600">
            {message ?? "Sign-in failed."}
          </p>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 underline"
          >
            Back to AI Coach
          </Link>
        </>
      )}
    </main>
  );
};

export default AuthCallbackPage;
