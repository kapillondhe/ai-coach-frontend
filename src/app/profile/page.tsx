"use client";

import { useAuth } from "@/lib/auth-context";
import { useSignInModal } from "@/lib/sign-in-modal-context";
import { SignInControl } from "../components/SignInControl";
import { ProfileFields, ProfileFieldsSkeleton } from "./ProfileFields";
import { MemorySection, MemorySkeleton } from "./MemorySection";
import { ConnectionsSection, ConnectionsSkeleton } from "./ConnectionsSection";
import { AppearanceControl } from "./AppearanceControl";

const ProfilePage = () => {
  const { session, loading } = useAuth();
  const { openModal } = useSignInModal();

  return (
    <main className="mx-auto w-full max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Profile</h1>

      <div className="flex flex-col gap-8">
        {loading || session ? (
          <>
            <section>
              <h2 className="mb-2 text-sm font-semibold text-ink-muted">You</h2>
              {loading ? <ProfileFieldsSkeleton /> : <ProfileFields />}
            </section>

            <section>
              <h2 className="mb-1 text-sm font-semibold text-ink-muted">
                Memory
              </h2>
              <p className="mb-2 text-xs text-ink-muted">
                Facts the coach remembers about you across conversations.
              </p>
              {loading ? <MemorySkeleton /> : <MemorySection />}
            </section>

            <section>
              <h2 className="mb-1 text-sm font-semibold text-ink-muted">
                Connections
              </h2>
              <p className="mb-2 text-xs text-ink-muted">
                Connect a device for training-grounded coaching. Read-only,
                optional — the coach works fully without it.
              </p>
              {loading ? <ConnectionsSkeleton /> : <ConnectionsSection />}
            </section>
          </>
        ) : null}

        <section>
          <h2 className="mb-2 text-sm font-semibold text-ink-muted">
            Appearance
          </h2>
          <AppearanceControl />
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-ink-muted">Account</h2>
          {loading ? (
            <div
              aria-hidden="true"
              className="h-[54px] animate-pulse rounded-lg border border-border bg-surface-2 motion-safe-only"
            />
          ) : session ? (
            <div className="rounded-lg border border-border px-4 py-2">
              <SignInControl />
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface p-6 text-center">
              <p className="mb-3 text-[13px] text-ink-muted">
                You&apos;re browsing anonymously. Sign in to save your profile,
                connect a device, and keep your training context across
                sessions.
              </p>
              <button
                onClick={openModal}
                className="min-h-10 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-accent-ink"
              >
                Sign in
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
