"use client";

import { useState } from "react";
import { startCorosConnect } from "@/lib/api";

export const NoDeviceEmptyState = () => {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await startCorosConnect();
    } catch {
      setConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-10 text-center">
      <p className="text-[13px] text-ink-muted">
        Connect a device to see your training trends here.
      </p>
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="min-h-10 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-accent-ink disabled:opacity-50"
      >
        {connecting ? "Connecting…" : "Connect a device"}
      </button>
    </div>
  );
};
