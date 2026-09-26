"use client";

import { SignInControl } from "../SignInControl";
import { useHeaderActions } from "@/lib/header-actions-context";

export const MobileSignInBar = () => {
  const { actions } = useHeaderActions();

  return (
    <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2 lg:hidden">
      <div className="flex items-center gap-1">{actions}</div>
      <SignInControl />
    </div>
  );
};
