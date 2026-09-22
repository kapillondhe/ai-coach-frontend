"use client";

import { useMediaQuery } from "./use-media-query";

export const usePrefersReducedMotion = (): boolean =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
