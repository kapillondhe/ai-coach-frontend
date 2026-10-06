"use client";

import { useEffect, useState } from "react";
import { disconnectCoros, getCorosStatus, startCorosConnect } from "@/lib/api";

type ConnectionState =
  | "loading"
  | "not_connected"
  | "connecting"
  | "syncing"
  | "connected"
  | "error";

const SYNCING_DISPLAY_MS = 1500;

const consumeCorosReturnParam = (): "connected" | "error" | null => {
  const params = new URLSearchParams(window.location.search);
  const corosParam = params.get("coros");
  if (corosParam !== "connected" && corosParam !== "error") return null;

  params.delete("coros");
  const cleanUrl =
    window.location.pathname + (params.toString() ? `?${params}` : "");
  window.history.replaceState(null, "", cleanUrl);
  return corosParam;
};

export const CorosConnectionRow = () => {
  const [state, setState] = useState<ConnectionState>("loading");

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      const corosParam = consumeCorosReturnParam();

      if (corosParam === "error") {
        if (!cancelled) setState("error");
        return;
      }

      if (corosParam === "connected") {
        if (!cancelled) setState("syncing");
        await new Promise((resolve) =>
          window.setTimeout(resolve, SYNCING_DISPLAY_MS),
        );
        if (!cancelled) setState("connected");
        return;
      }

      try {
        const status = await getCorosStatus(controller.signal);
        if (!cancelled) {
          setState(
            !status.connected
              ? "not_connected"
              : status.syncing
                ? "syncing"
                : "connected",
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (!cancelled) setState("error");
      }
    };

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const handleConnect = async () => {
    setState("connecting");
    try {
      await startCorosConnect();
    } catch {
      setState("error");
    }
  };

  const handleDisconnect = async () => {
    const previous = state;
    setState("not_connected");
    try {
      await disconnectCoros();
    } catch {
      setState(previous);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-ink">COROS</p>
        <p
          className={`text-xs ${
            state === "error"
              ? "text-danger"
              : state === "connected" || state === "syncing"
                ? "text-accent"
                : "text-ink-muted"
          }`}
          aria-live="polite"
        >
          {state === "loading" && "Checking connection…"}
          {state === "not_connected" && "Not connected"}
          {state === "connecting" && "Connecting…"}
          {state === "syncing" && "Connected — syncing your recent activities…"}
          {state === "connected" && "Connected ✓"}
          {state === "error" && "Something went wrong — try again"}
        </p>
      </div>

      {(state === "not_connected" ||
        state === "connecting" ||
        state === "error") && (
        <button
          onClick={handleConnect}
          disabled={state === "connecting"}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink disabled:opacity-50"
        >
          {state === "connecting" ? "Connecting…" : "Connect"}
        </button>
      )}

      {(state === "syncing" || state === "connected") && (
        <button
          onClick={handleDisconnect}
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink-muted hover:bg-surface-2"
        >
          Disconnect
        </button>
      )}
    </div>
  );
};
