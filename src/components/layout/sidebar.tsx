"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AppLogo } from "@/components/layout/app-logo";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: "🏠" },
  { href: "/dashboard/tasks", label: "Tâches", icon: "✅" },
  { href: "/dashboard/calendar", label: "Agenda", icon: "📅" },
  { href: "/dashboard/goals", label: "Objectifs", icon: "🎯" },
  { href: "/dashboard/mood", label: "Bien-être", icon: "💚" },
  { href: "/dashboard/focus", label: "Focus", icon: "⏱️" },
  { href: "/dashboard/ai", label: "IA", icon: "✨" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="animate-slide-in-left flex h-screen w-64 shrink-0 flex-col border-r border-slate-700/50 bg-slate-900/75 p-4 backdrop-blur-md">
      <div className="mb-8 flex justify-center px-2">
        <AppLogo size={52} />
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item, index) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ animationDelay: `${index * 0.05}s` }}
              className={`nav-link animate-list-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                active
                  ? "nav-link-active bg-emerald-600/20 text-emerald-300"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <p className="truncate px-2 text-sm font-medium text-white">{user?.name}</p>
        <p className="truncate px-2 text-xs text-slate-500">{user?.email}</p>
        <Button variant="ghost" className="mt-3 w-full" onClick={logout}>
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
