import { CSSProperties, ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Card({ title, description, children, className = "", style }: CardProps) {
  return (
    <section
      style={style}
      className={`hover-lift rounded-xl border border-slate-700/50 bg-slate-900/75 p-5 shadow-lg shadow-black/20 backdrop-blur-sm ${className}`}
    >
      {(title || description) && (
        <header className="mb-4">
          {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
