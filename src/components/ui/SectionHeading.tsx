export function SectionHeading({
  eyebrow,
  eyebrowClassName = "text-blue-600",
  title,
  action,
}: {
  eyebrow?: string;
  eyebrowClassName?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className={`text-sm font-bold uppercase tracking-wider ${eyebrowClassName}`}>
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
