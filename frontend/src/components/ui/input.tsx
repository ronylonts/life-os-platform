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
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-300 transition-colors duration-200"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 transition-all duration-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:scale-[1.01] ${className}`}
        {...props}
      />
      {error && <p className="animate-shake text-sm text-red-400">{error}</p>}
    </div>
  );
}
