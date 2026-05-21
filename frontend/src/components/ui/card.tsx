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
      className={`theme-card hover-lift rounded-xl border p-5 shadow-lg backdrop-blur-sm ${className}`}
    >
      {(title || description) && (
        <header className="mb-4">
          {title && <h2 className="theme-text text-lg font-semibold">{title}</h2>}
          {description && <p className="theme-muted mt-1 text-sm">{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
