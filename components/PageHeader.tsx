type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="space-y-2">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-wide text-court-600">{eyebrow}</p> : null}
      <h1 className="max-w-3xl text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{title}</h1>
      {description ? <p className="max-w-2xl text-base leading-7 text-slate-600">{description}</p> : null}
    </header>
  );
}
