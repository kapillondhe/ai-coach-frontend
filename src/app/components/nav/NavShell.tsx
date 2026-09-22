"use client";

import { BottomNavBar } from "./BottomNavBar";
import { RailNav } from "./RailNav";
import { MobileSignInBar } from "./MobileSignInBar";

export const NavShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="hidden lg:block">
        <RailNav />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileSignInBar />
        <div className="min-h-0 flex-1">{children}</div>
        <div className="lg:hidden">
          <BottomNavBar />
        </div>
      </div>
    </div>
  );
};
