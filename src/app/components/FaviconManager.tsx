"use client";

import { useEffect, useRef, useState } from "react";
import { useFaviconState } from "@/lib/favicon-context";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const BASE_ICON_SRC = "/icon.png";
const CANVAS_SIZE = 64;

interface IconLinkSnapshot {
  link: HTMLLinkElement;
  originalHref: string;
  originalType: string;
}

const getIconLinks = (): HTMLLinkElement[] =>
  Array.from(document.querySelectorAll<HTMLLinkElement>("link[rel='icon']"));

/**
 * Renders no DOM of its own. Instead it repaints the document's <link
 * rel="icon"> tag(s) onto a canvas so the browser tab favicon can reflect
 * live app state: a spinning badge while the assistant is replying, and a
 * static unread dot if a reply finished while the tab was in the background.
 */
export const FaviconManager = () => {
  const { state, setFaviconState } = useFaviconState();
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
  const snapshotsRef = useRef<IconLinkSnapshot[] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.src = BASE_ICON_SRC;
    image.onload = () => {
      if (!cancelled) setBaseImage(image);
    };
    image.onerror = () => {
      // Base icon failed to load: leave baseImage null so the
      // loading/unread overlay is skipped and the static favicon stays.
    };

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    canvasRef.current = canvas;

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!snapshotsRef.current) {
      snapshotsRef.current = getIconLinks().map((link) => ({
        link,
        originalHref: link.href,
        originalType: link.type,
      }));
    }
    const snapshots = snapshotsRef.current;

    const applyToAll = (href: string, type: string) => {
      for (const snapshot of snapshots) {
        snapshot.link.href = href;
        snapshot.link.type = type;
      }
    };

    if (state === "idle") {
      for (const snapshot of snapshots) {
        snapshot.link.href = snapshot.originalHref;
        snapshot.link.type = snapshot.originalType;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !baseImage) return;

    const drawBase = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.drawImage(baseImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    };

    if (state === "unread") {
      drawBase();
      ctx.beginPath();
      ctx.fillStyle = "#ef4444";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.arc(CANVAS_SIZE - 11, 11, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      applyToAll(canvas.toDataURL("image/png"), "image/png");
      return;
    }

    // state === "loading"
    const cx = CANVAS_SIZE - 12;
    const cy = CANVAS_SIZE - 12;

    if (prefersReducedMotion) {
      drawBase();
      ctx.beginPath();
      ctx.fillStyle = "rgba(17,24,39,0.9)";
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#60a5fa";
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
      applyToAll(canvas.toDataURL("image/png"), "image/png");
      return;
    }

    let angle = 0;
    let lastDraw = 0;
    let rafId: number;
    const tick = (ts: number) => {
      if (ts - lastDraw > 90) {
        lastDraw = ts;
        angle = (angle + 28) % 360;
        drawBase();
        ctx.beginPath();
        ctx.fillStyle = "rgba(17,24,39,0.9)";
        ctx.arc(cx, cy, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        const start = (angle * Math.PI) / 180;
        ctx.arc(cx, cy, 7, start, start + Math.PI * 1.3);
        ctx.stroke();
        applyToAll(canvas.toDataURL("image/png"), "image/png");
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [state, baseImage, prefersReducedMotion]);

  useEffect(() => {
    const handler = () => {
      if (!document.hidden && state === "unread") setFaviconState("idle");
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [state, setFaviconState]);

  return null;
};
