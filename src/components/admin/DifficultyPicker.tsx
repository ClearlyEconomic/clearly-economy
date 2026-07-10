"use client";

export function DifficultyPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          aria-label={`난이도 ${level}`}
          className={`text-lg leading-none ${
            level <= value ? "text-blue-950" : "text-slate-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
