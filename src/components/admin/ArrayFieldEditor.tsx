"use client";

export function ArrayFieldEditor({
  label,
  items,
  onChange,
  placeholder,
  helperText,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  helperText?: string;
}) {
  function updateItem(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {helperText && <p className="mt-0.5 text-xs text-slate-400">{helperText}</p>}
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-slate-400"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              aria-label="항목 삭제"
              className="rounded-md border border-slate-200 px-2.5 text-slate-400 hover:border-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="self-start rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-slate-400"
        >
          + 항목 추가
        </button>
      </div>
    </div>
  );
}
