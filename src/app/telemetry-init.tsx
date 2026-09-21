"use client";

import { useEffect } from "react";
import { initTelemetry } from "@/lib/telemetry";

export const TelemetryInit = () => {
  useEffect(() => {
    initTelemetry();
  }, []);

  return null;
};
