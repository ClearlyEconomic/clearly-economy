"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrayFieldEditor } from "./ArrayFieldEditor";
import { DifficultyPicker } from "./DifficultyPicker";
import { Toast, type ToastState } from "./Toast";
import { LivePreview } from "./LivePreview";
import { AIDraftButton } from "./AIDraftButton";
import { slugify, isValidSlugFormat } from "@/lib/admin/slugify";
import { getBodyTemplate } from "@/lib/admin/templates";
import { CATEGORY_LABELS, RAIL_TOPICS } from "@/lib/site";
import { CATEGORIES, type Category } from "@/lib/types";
import type { AdminSavePayload } from "@/lib/content-repository";
import type { DraftContext } from "@/lib/ai-draft";

type SaveApiResult = {
  path: string;
  sizeBytes: number;
  savedAt: string;
  revision: number;
  status: string;
};

type SaveApiError = {
  code: string;
  message: string;
  issues: string[];
};

const EXAM_FREQUENCY_OPTIONS = ["낮음", "보통", "높음"] as const;
const EXAM_IMPORTANCE_OPTIONS = ["낮음", "보통", "높음", "필수"] as const;

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function Field({
  label,
  required,
  children,
  helperText,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  helperText?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-slate-400">*</span>}
      </label>
      {helperText && <p className="mt-0.5 text-xs text-slate-400">{helperText}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400";

export function AdminEditor({ initialCategory }: { initialCategory: Category }) {
  const [category, setCategory] = useState<Category>(initialCategory);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [tags, setTags] = useState<string[]>([""]);
  const [difficulty, setDifficulty] = useState(2);
  const [examFrequency, setExamFrequency] =
    useState<(typeof EXAM_FREQUENCY_OPTIONS)[number]>("보통");
  const [examImportance, setExamImportance] =
    useState<(typeof EXAM_IMPORTANCE_OPTIONS)[number]>("보통");
  const [date, setDate] = useState(todayDate());
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string[]>([""]);
  const [examPoints, setExamPoints] = useState<string[]>([""]);
  const [body, setBody] = useState(() => getBodyTemplate(initialCategory));
  const [bodyTouched, setBodyTouched] = useState(false);

  // terms 전용 필드
  const [english, setEnglish] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [field, setField] = useState("");
  const [relatedTerms, setRelatedTerms] = useState<string[]>([""]);
  const [designStandard, setDesignStandard] = useState("");
  const [examRelevant, setExamRelevant] = useState(false);

  // study 전용 필드
  const [topic, setTopic] = useState("");

  const [existingSlugs, setExistingSlugs] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [serverIssues, setServerIssues] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const refreshExistingSlugs = () => {
    fetch("/api/admin/existing-slugs")
      .then((res) => res.json())
      .then(setExistingSlugs)
      .catch(() => {});
  };

  useEffect(refreshExistingSlugs, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  useEffect(() => {
    if (!bodyTouched) setBody(getBodyTemplate(category));
    // 카테고리를 바꾸면 topic/field 선택도 초기화합니다.
    setTopic("");
    setField("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const slugConflict = slug.length > 0 && (existingSlugs[category] ?? []).includes(slug);

  const errors = useMemo(() => {
    const list: string[] = [];
    if (!title.trim()) list.push("제목을 입력하세요.");
    if (!slug.trim()) list.push("Slug를 입력하세요.");
    else if (!isValidSlugFormat(slug)) list.push("Slug는 영문/숫자/한글과 하이픈만 사용할 수 있습니다.");
    if (slugConflict) list.push(`이미 "${CATEGORY_LABELS[category]}"에 같은 slug가 있습니다.`);
    if (!description.trim()) list.push("설명을 입력하세요.");
    if (!date.trim()) list.push("작성일을 입력하세요.");
    if (category === "study" && !topic) list.push("철도기술사 글은 분야(topic)를 선택해야 합니다.");
    return list;
  }, [title, slug, slugConflict, description, date, category, topic]);

  // 저장(handleSave)과 실시간 미리보기(LivePreview)가 같은 데이터 모양을
  // 공유합니다 — 미리보기에서 본 내용과 실제로 저장되는 내용이 어긋나지
  // 않도록 하기 위함입니다.
  const payload: AdminSavePayload = useMemo(
    () => ({
      category,
      slug,
      title,
      description,
      date,
      tags: tags.filter((t) => t.trim()),
      difficulty,
      summary: summary.filter((s) => s.trim()),
      examPoints: examPoints.filter((e) => e.trim()),
      body,
      status: "draft",
      ...(category === "terms"
        ? {
            english,
            abbreviation,
            field,
            relatedTerms: relatedTerms.filter((t) => t.trim()),
            designStandard,
            examRelevant,
          }
        : {}),
      ...(category === "study" ? { topic } : {}),
    }),
    [
      category,
      slug,
      title,
      description,
      date,
      tags,
      difficulty,
      summary,
      examPoints,
      body,
      english,
      abbreviation,
      field,
      relatedTerms,
      designStandard,
      examRelevant,
      topic,
    ]
  );

  const draftContext: DraftContext = useMemo(
    () => ({
      category,
      title,
      description,
      tags: tags.filter((t) => t.trim()),
      difficulty,
      examFrequency,
      examImportance,
      summary: summary.filter((s) => s.trim()),
      topic: category === "study" ? topic : undefined,
      english: category === "terms" ? english : undefined,
      abbreviation: category === "terms" ? abbreviation : undefined,
      field: category === "terms" ? field : undefined,
    }),
    [
      category,
      title,
      description,
      tags,
      difficulty,
      examFrequency,
      examImportance,
      summary,
      topic,
      english,
      abbreviation,
      field,
    ]
  );

  async function handleSave() {
    setServerIssues([]);
    setSaving(true);
    try {
      const response = await fetch("/api/admin/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok) {
        const error = json.error as SaveApiError;
        setServerIssues(error.issues?.length ? error.issues : [error.message]);
        setToast({ kind: "error", title: "저장 실패", description: error.message });
        return;
      }

      const result = json.result as SaveApiResult;
      setToast({
        kind: "success",
        title: "저장되었습니다",
        description: `${result.path} · ${result.sizeBytes.toLocaleString()} bytes · status: ${result.status}`,
      });
      refreshExistingSlugs();
    } catch {
      setToast({ kind: "error", title: "저장 실패", description: "네트워크 오류가 발생했습니다." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 모바일 전용 탭 전환 (md 미만에서만 보임) */}
      <div className="flex gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setActiveTab("edit")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "edit" ? "bg-blue-950 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          작성
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "preview" ? "bg-blue-950 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          미리보기
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* 왼쪽: 입력 폼 — 모바일에서는 activeTab이 "edit"일 때만, md 이상에서는 항상 보입니다 */}
        <div className={`${activeTab === "edit" ? "flex" : "hidden"} flex-col gap-6 md:flex`}>
          <Field label="카테고리" required>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as Category)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="제목" required>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="예: 장대레일이란 무엇인가"
              className={inputClass}
            />
          </Field>

          <Field
            label="Slug"
            required
            helperText="제목 입력 시 자동 생성됩니다. 직접 수정할 수도 있습니다 (영문 kebab-case 권장)."
          >
            <input
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              className={`${inputClass} font-mono ${slugConflict ? "border-red-400" : ""}`}
            />
            {slugConflict && (
              <p className="mt-1 text-xs text-red-600">
                이미 사용 중인 slug입니다: /{category}/{slug}
              </p>
            )}
          </Field>

          <ArrayFieldEditor
            label="태그"
            items={tags}
            onChange={setTags}
            placeholder="예: 궤도틀림"
          />

          <div className="grid grid-cols-2 gap-4">
            <Field label="난이도">
              <DifficultyPicker value={difficulty} onChange={setDifficulty} />
            </Field>
            <Field label="작성일" required>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="출제빈도">
              <select
                value={examFrequency}
                onChange={(event) =>
                  setExamFrequency(event.target.value as (typeof EXAM_FREQUENCY_OPTIONS)[number])
                }
                className={inputClass}
              >
                {EXAM_FREQUENCY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="기술사 중요도">
              <select
                value={examImportance}
                onChange={(event) =>
                  setExamImportance(event.target.value as (typeof EXAM_IMPORTANCE_OPTIONS)[number])
                }
                className={inputClass}
              >
                {EXAM_IMPORTANCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="설명" required helperText="목록 카드와 검색엔진에 노출되는 한 줄 요약입니다.">
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>

          <Field label="대표 이미지" helperText="3단계에서 content/images/ 폴더 저장이 연결됩니다.">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              className="text-sm text-slate-500"
            />
            {imageFile && (
              <p className="mt-1 text-xs text-slate-400">선택됨: {imageFile.name}</p>
            )}
          </Field>

          {category === "study" && (
            <Field label="분야 (topic)" required>
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className={inputClass}
              >
                <option value="">선택하세요</option>
                {RAIL_TOPICS.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.emoji} {t.label}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {category === "terms" && (
            <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                철도용어 전용 필드
              </p>
              <Field label="영문명">
                <input
                  value={english}
                  onChange={(event) => setEnglish(event.target.value)}
                  placeholder="예: Continuous Welded Rail"
                  className={inputClass}
                />
              </Field>
              <Field label="약어">
                <input
                  value={abbreviation}
                  onChange={(event) => setAbbreviation(event.target.value)}
                  placeholder="예: CWR"
                  className={inputClass}
                />
              </Field>
              <Field label="관련 분야">
                <select
                  value={field}
                  onChange={(event) => setField(event.target.value)}
                  className={inputClass}
                >
                  <option value="">선택 안 함</option>
                  {RAIL_TOPICS.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.emoji} {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <ArrayFieldEditor
                label="관련 용어 (slug)"
                items={relatedTerms}
                onChange={setRelatedTerms}
                placeholder="예: rail"
                helperText="content/terms 폴더 내 다른 글의 slug를 입력하세요."
              />
              <Field label="설계기준">
                <textarea
                  value={designStandard}
                  onChange={(event) => setDesignStandard(event.target.value)}
                  rows={2}
                  className={inputClass}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={examRelevant}
                  onChange={(event) => setExamRelevant(event.target.checked)}
                />
                기술사 기출 여부
              </label>
            </div>
          )}

          <ArrayFieldEditor
            label="핵심 요약"
            items={summary}
            onChange={setSummary}
            placeholder="핵심 요점 한 줄"
            helperText="상세 페이지 상단 요약 박스에 표시됩니다."
          />

          <ArrayFieldEditor
            label="기술사 기출 포인트 (선택)"
            items={examPoints}
            onChange={setExamPoints}
            placeholder="기출 포인트 한 줄"
          />

          <AIDraftButton
            context={draftContext}
            onStart={() => {
              setBodyTouched(true);
              setBody("");
            }}
            onChunk={(chunk) => setBody((prev) => prev + chunk)}
            onDone={() => {}}
          />

          <Field
            label="본문 (MDX)"
            helperText="카테고리를 바꾸면 해당 템플릿으로 다시 채워집니다 (직접 수정한 내용이 없을 때만). AI 초안 생성 후에도 자유롭게 수정할 수 있습니다."
          >
            <textarea
              value={body}
              onChange={(event) => {
                setBodyTouched(true);
                setBody(event.target.value);
              }}
              rows={16}
              className={`${inputClass} font-mono leading-relaxed`}
            />
          </Field>

          {errors.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-bold">저장 전 확인이 필요합니다</p>
              <ul className="mt-2 list-disc pl-5">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {serverIssues.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-bold">저장 중 문제가 발생했습니다</p>
              <ul className="mt-2 list-disc pl-5">
                {serverIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={errors.length > 0 || saving}
              onClick={handleSave}
              className="rounded-md bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
            <p className="text-xs text-slate-400">
              content/{category}/{slug || "..."}.mdx 로 저장됩니다 (draft 상태).
            </p>
          </div>
        </div>

        {/* 오른쪽: 실시간 미리보기 — 실제 게시글과 동일한 파이프라인으로 렌더링됩니다 */}
        <div className={`${activeTab === "preview" ? "block" : "hidden"} mt-10 md:block lg:mt-0`}>
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <LivePreview payload={payload} />
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        저장하기 전에 오른쪽 미리보기에서 실제 게시글 모습을 반드시 확인하세요.
      </p>

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
