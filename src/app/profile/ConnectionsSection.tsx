import { CorosConnectionRow } from "./CorosConnectionRow";

export const ConnectionsSection = () => {
  return (
    <div className="divide-y divide-border rounded-lg border border-border px-4">
      <CorosConnectionRow />
      {/* Future device rows (Garmin, Strava, etc.) append here. */}
    </div>
  );
};
