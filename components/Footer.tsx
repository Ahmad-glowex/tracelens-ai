import Link from "next/link";
import { Wrench } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#product", label: "Features" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#install", label: "Install" },
      { href: "/demo", label: "Web demo" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "https://github.com/Ahmad-glowex/tracelens-ai", label: "GitHub" },
      { href: "/llms.txt", label: "llms.txt" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/security", label: "Security" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[#0B0F14]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-mono font-semibold text-[var(--text)]">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(74,222,128,0.12)] text-[var(--accent)]">
              <Wrench className="h-4 w-4" aria-hidden="true" />
            </span>
            RunFix
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--muted)]">
            An MCP server for coding agents. Your agent finds the root cause; RunFix verifies the patch before it reaches your working tree.
          </p>
          <p className="mt-4 font-mono text-xs text-[var(--muted)]">RunFix · founder@runfix.live</p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-[var(--muted)] transition-colors duration-150 hover:text-[var(--text)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} RunFix. MIT licensed.</span>
          <span className="font-mono">git apply --check verified, every time</span>
        </div>
      </div>
    </footer>
  );
}
