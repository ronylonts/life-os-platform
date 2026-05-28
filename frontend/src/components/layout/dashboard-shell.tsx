"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getStoredUser, getToken } from "@/lib/auth/storage";
import { Sidebar } from "@/components/layout/sidebar";
import { PageTransition } from "@/components/layout/page-transition";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getToken()));
    setTokenChecked(true);
  }, []);

  useEffect(() => {
    if (!tokenChecked || loading) return;

    if (!getToken() && !user) {
      router.replace("/login");
    }
  }, [tokenChecked, loading, user, router]);

  const cachedUser = getStoredUser();
  const effectiveUser = user ?? cachedUser;

  if (!tokenChecked || (loading && hasToken && !effectiveUser)) {
    return <LoadingSpinner label="Chargement de votre espace..." />;
  }

  if (!hasToken && !effectiveUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Bouton hamburger mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-900/90 text-white backdrop-blur-md transition-colors hover:border-emerald-500/50 lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>

      {/* Overlay mobile avec animation de fondu */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          style={{ animation: "fade-in 0.2s ease-out both" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar : overlay mobile, statique desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:block ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-6 md:pt-6 lg:p-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
