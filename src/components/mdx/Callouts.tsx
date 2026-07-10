import type { ReactNode } from "react";

type CalloutProps = { children: ReactNode };

function Callout({
  icon,
  label,
  className,
  labelClassName = "text-slate-900",
  bodyClassName = "text-slate-700",
  children,
}: {
  icon: string;
  label: string;
  className: string;
  labelClassName?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={`not-prose my-6 flex gap-3 rounded-lg p-4 ${className}`}>
      <span className="text-lg leading-none" aria-hidden="true">
        {icon}
      </span>
      <div className="flex-1 text-sm leading-relaxed">
        <p className={`mb-1 font-bold ${labelClassName}`}>{label}</p>
        <div className={bodyClassName}>{children}</div>
      </div>
    </div>
  );
}

/** ✔ 핵심 암기 — 시험 전 반드시 기억해야 할 핵심 문장 */
export function MemoryTip({ children }: CalloutProps) {
  return (
    <Callout icon="✔" label="핵심 암기" className="border-2 border-blue-950 bg-white">
      {children}
    </Callout>
  );
}

/** ⚠ 시험에서 자주 출제 — 기출 빈도가 높은 포인트 강조 */
export function ExamAlert({ children }: CalloutProps) {
  return (
    <Callout
      icon="⚠"
      label="시험에서 자주 출제"
      className="bg-blue-950"
      labelClassName="text-white"
      bodyClassName="text-blue-100"
    >
      {children}
    </Callout>
  );
}

/** 📐 설계기준 — 본문 중간에 삽입하는 기준 수치·규정 보충 설명 */
export function DesignStandard({ children }: CalloutProps) {
  return (
    <Callout icon="📐" label="설계기준" className="border border-slate-200 bg-slate-50">
      {children}
    </Callout>
  );
}

/** 💡 실무 포인트 — 현장/실무 관점의 참고 사항 */
export function PracticeTip({ children }: CalloutProps) {
  return (
    <Callout
      icon="💡"
      label="실무 포인트"
      className="border border-dashed border-slate-300 bg-white"
    >
      {children}
    </Callout>
  );
}
