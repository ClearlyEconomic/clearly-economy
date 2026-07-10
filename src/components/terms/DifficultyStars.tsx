const MAX = 5;

export function DifficultyStars({ level }: { level: number }) {
  const filled = Math.max(0, Math.min(MAX, level));
  return (
    <span
      className="text-blue-950"
      aria-label={`난이도 ${filled} / ${MAX}`}
      title={`난이도 ${filled} / ${MAX}`}
    >
      {"★".repeat(filled)}
      <span className="text-slate-300">{"★".repeat(MAX - filled)}</span>
    </span>
  );
}
