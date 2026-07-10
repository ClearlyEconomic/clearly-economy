export function ExamPointBox({ points }: { points: string[] }) {
  if (points.length === 0) return null;

  return (
    <div className="mb-10 rounded-xl border-2 border-blue-950 bg-white p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-950">
        {"\u{1F4CC}"} 기술사 기출 포인트
      </p>
      <ul className="mt-3 space-y-2">
        {points.map((point) => (
          <li key={point} className="flex gap-2 text-sm text-slate-700">
            <span className="mt-0.5 text-blue-950">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
