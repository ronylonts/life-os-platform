"use client";

export function LoadingSpinner({ label = "Chargement..." }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-400">
      <div className="loading-spinner" aria-hidden />
      <p className="animate-pulse-text text-sm">{label}</p>
    </div>
  );
}
