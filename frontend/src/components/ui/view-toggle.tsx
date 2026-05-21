"use client";

export type ViewMode = "list" | "kanban" | "grid";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  modes: { id: ViewMode; label: string }[];
}

export function ViewToggle({ value, onChange, modes }: ViewToggleProps) {
  return (
    <div className="theme-toggle-group inline-flex rounded-lg border p-1">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
            value === mode.id
              ? "bg-emerald-600 text-white shadow-sm"
              : "theme-muted hover:theme-text"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
