"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RandomTermButton({ slugs }: { slugs: string[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleClick() {
    if (slugs.length === 0) return;
    setLoading(true);
    const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];
    router.push(`/terms/${randomSlug}`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || slugs.length === 0}
      className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 disabled:opacity-50"
    >
      🎲 오늘의 용어
    </button>
  );
}
