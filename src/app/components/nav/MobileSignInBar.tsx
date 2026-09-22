"use client";

import { SignInControl } from "../SignInControl";

export const MobileSignInBar = () => (
  <div className="flex items-center justify-end border-b border-border px-4 py-2 lg:hidden">
    <SignInControl />
  </div>
);
