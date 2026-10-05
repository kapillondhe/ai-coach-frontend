"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type FaviconState = "idle" | "loading" | "unread";

interface FaviconContextValue {
  state: FaviconState;
  setFaviconState: (state: FaviconState) => void;
}

const FaviconContext = createContext<FaviconContextValue | null>(null);

export const FaviconProvider = ({ children }: { children: ReactNode }) => {
  const [state, setFaviconState] = useState<FaviconState>("idle");
  return (
    <FaviconContext.Provider value={{ state, setFaviconState }}>
      {children}
    </FaviconContext.Provider>
  );
};

export const useFaviconState = (): FaviconContextValue => {
  const ctx = useContext(FaviconContext);
  if (!ctx)
    throw new Error("useFaviconState must be used within a FaviconProvider");
  return ctx;
};
