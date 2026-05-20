interface AlertProps {
  variant?: "error" | "success" | "warning" | "info";
  children: React.ReactNode;
}

const styles = {
  error: "border-red-800 bg-red-950/50 text-red-200",
  success: "border-emerald-800 bg-emerald-950/50 text-emerald-200",
  warning: "border-amber-800 bg-amber-950/50 text-amber-200",
  info: "border-slate-700 bg-slate-900 text-slate-300",
};

export function Alert({ variant = "info", children }: AlertProps) {
  return (
    <div
      className={`animate-scale-in rounded-lg border px-4 py-3 text-sm transition-all duration-300 ${styles[variant]}`}
    >
      {children}
    </div>
  );
}
