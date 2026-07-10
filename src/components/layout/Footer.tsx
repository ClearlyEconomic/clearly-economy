import Link from "next/link";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { Container } from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-slate-900">
            {SITE.name}
          </p>
          <p className="mt-1 text-sm text-slate-500">{SITE.tagline}</p>
          <p className="mt-4 text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-blue-950">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
