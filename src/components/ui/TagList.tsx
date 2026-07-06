export function TagList({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
