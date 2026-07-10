"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string };

export function TableOfContents({ containerId }: { containerId: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>(".section-card")
    );
    const list = sections
      .map((section) => ({
        id: section.id,
        text:
          section.querySelector(".section-card-title")?.textContent?.trim() ??
          "",
      }))
      .filter((item) => item.id && item.text);

    setItems(list);
    if (list.length > 0) setActiveId(list[0].id);
  }, [containerId]);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    // 마지막 섹션은 rootMargin의 하단 컷오프 때문에 관찰 대상에서
    // 벗어난 채로 페이지 끝에 도달할 수 있어, 스크롤이 바닥에 닿으면
    // 마지막 항목을 강제로 활성화합니다.
    function handleScrollEnd() {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (scrolledToBottom) setActiveId(items[items.length - 1].id);
    }
    window.addEventListener("scroll", handleScrollEnd, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollEnd);
    };
  }, [items]);

  if (items.length < 2) return null;

  function handleClick(event: React.MouseEvent, id: string) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const list = (
    <ul className="flex flex-col gap-1 text-sm">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={(event) => handleClick(event, item.id)}
            className={`block rounded-md px-3 py-1.5 transition-colors ${
              activeId === item.id
                ? "bg-slate-100 font-semibold text-blue-950"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <nav
        aria-label="목차"
        className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          목차
        </p>
        {list}
      </nav>

      <details className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-bold text-slate-900">
          목차
        </summary>
        <div className="mt-3">{list}</div>
      </details>
    </div>
  );
}
