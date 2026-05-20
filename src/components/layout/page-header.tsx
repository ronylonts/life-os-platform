interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="animate-page-enter mb-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {description && (
        <p className="mt-1 text-slate-400 transition-opacity duration-300">{description}</p>
      )}
    </header>
  );
}
