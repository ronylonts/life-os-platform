"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
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

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="theme-sidebar flex h-screen w-64 shrink-0 flex-col border-r p-4 backdrop-blur-md">
      <div className="mb-8 flex items-center justify-between px-2">
        <AppLogo size={52} />
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Fermer"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l10 10M14 4L4 14" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item, index) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{ animationDelay: `${index * 0.05}s` }}
              className={`nav-link animate-list-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                active
                  ? "nav-link-active bg-emerald-600/20 text-emerald-500"
                  : "theme-muted hover:bg-emerald-600/10 hover:theme-text"
              }`}
            >
              <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="theme-sidebar-footer mt-4 border-t pt-4">
        <Button variant="ghost" className="mb-2 w-full" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Mode clair" : "🌙 Mode sombre"}
        </Button>
        <p className="truncate px-2 text-sm font-medium theme-text">{user?.name}</p>
        <p className="truncate px-2 text-xs theme-muted">{user?.email}</p>
        <Button variant="ghost" className="mt-3 w-full" onClick={logout}>
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
