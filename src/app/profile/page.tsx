import { CorosConnectionRow } from "./CorosConnectionRow";

const ProfilePage = () => {
  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Profile</h1>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-black/60 dark:text-white/60">
          Connections
        </h2>
        <p className="mb-2 text-xs text-black/40 dark:text-white/40">
          Connect a device for training-grounded coaching. Read-only,
          optional — the coach works fully without it.
        </p>
        <div className="divide-y divide-black/10 rounded-lg border border-black/10 px-4 dark:divide-white/10 dark:border-white/10">
          <CorosConnectionRow />
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
