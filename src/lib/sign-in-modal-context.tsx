"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SignInModalContextValue {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SignInModalContext = createContext<SignInModalContextValue | null>(
  null,
);

export const SignInModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <SignInModalContext.Provider
      value={{
        open,
        openModal: () => setOpen(true),
        closeModal: () => setOpen(false),
      }}
    >
      {children}
    </SignInModalContext.Provider>
  );
};

export const useSignInModal = (): SignInModalContextValue => {
  const ctx = useContext(SignInModalContext);
  if (!ctx)
    throw new Error("useSignInModal must be used within a SignInModalProvider");
  return ctx;
};
