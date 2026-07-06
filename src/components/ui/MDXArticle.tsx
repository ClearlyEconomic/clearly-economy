export function MDXArticle({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose prose-slate prose-lg max-w-none leading-relaxed prose-headings:font-extrabold prose-p:leading-relaxed prose-a:no-underline prose-img:rounded-xl">
      {children}
    </article>
  );
}
