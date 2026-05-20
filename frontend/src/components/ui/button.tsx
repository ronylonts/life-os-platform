import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98] disabled:bg-emerald-900 disabled:text-emerald-300 disabled:hover:scale-100",
  secondary:
    "bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 hover:scale-[1.02] active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white active:scale-[0.98]",
  danger:
    "bg-red-600 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-900/30 hover:scale-[1.02] active:scale-[0.98]",
};

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ease-out disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Chargement..." : children}
    </button>
  );
}
