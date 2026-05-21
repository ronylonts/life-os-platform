import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5 transition-all duration-300">
      {label && (
        <label htmlFor={inputId} className="theme-text block text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`theme-input w-full rounded-lg border px-3 py-2 text-sm placeholder:opacity-50 transition-all duration-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${className}`}
        {...props}
      />
      {error && <p className="animate-shake text-sm text-red-400">{error}</p>}
    </div>
  );
}
