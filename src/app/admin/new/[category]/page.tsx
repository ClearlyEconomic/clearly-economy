import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdminEditor } from "@/components/admin/AdminEditor";
import { CATEGORIES, type Category } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/site";

export const metadata: Metadata = {
  title: "새 글 작성",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewContentPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!CATEGORIES.includes(category as Category)) notFound();
  const typedCategory = category as Category;

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "관리자", href: "/admin" },
    { label: `새 ${CATEGORY_LABELS[typedCategory]}`, href: `/admin/new/${typedCategory}` },
  ];

  return (
    <Container className="max-w-6xl py-16">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-slate-900">
        새 {CATEGORY_LABELS[typedCategory]} 작성
      </h1>
      <AdminEditor initialCategory={typedCategory} />
    </Container>
  );
}
