import Link from "next/link";

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-400"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.href} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden>/</span>}
            {isLast ? (
              <span className="text-slate-500">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-slate-600">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
