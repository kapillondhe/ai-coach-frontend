"use client";

import { useAuth } from "@/lib/auth-context";
import { SkeletonCards } from "./SkeletonCards";
import { AnonymousEmptyState } from "./AnonymousEmptyState";
import { DashboardContent } from "./DashboardContent";

const DashboardPage = () => {
  const { session, loading } = useAuth();

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Dashboard</h1>

      {loading ? (
        <SkeletonCards />
      ) : session ? (
        <DashboardContent />
      ) : (
        <AnonymousEmptyState />
      )}
    </main>
  );
};

export default DashboardPage;
