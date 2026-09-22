"use client";

import { useAuth } from "@/lib/auth-context";
import { useSignInModal } from "@/lib/sign-in-modal-context";

interface SignInControlProps {
  compact?: boolean;
}

export const SignInControl = ({ compact = false }: SignInControlProps = {}) => {
  const { session, loading, signOut } = useAuth();
  const { openModal } = useSignInModal();

  const layout = compact
    ? "flex flex-col items-stretch gap-2"
    : "flex items-center gap-2";

  if (loading) return null;

  if (session) {
    return (
      <div className={layout}>
        <span
          className={`truncate text-[13px] text-ink-muted ${compact ? "" : "hidden sm:inline"}`}
        >
          {session.user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="min-h-9 rounded-md px-3 py-1.5 text-left text-[13px] font-semibold text-ink-muted hover:bg-surface-2"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={layout}>
      <button
        onClick={openModal}
        className="min-h-9 rounded-md bg-accent px-3 py-1.5 text-[13px] font-semibold text-accent-ink"
      >
        Sign in
      </button>
    </div>
  );
};
