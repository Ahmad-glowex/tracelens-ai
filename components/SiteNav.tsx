"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Wrench } from "lucide-react";

const links = [
  { href: "/#product", label: "Product" },
  { href: "/#install", label: "Install" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[#0B0F14]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2 font-mono font-semibold text-[var(--text)]" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(74,222,128,0.12)] text-[var(--accent)]">
            <Wrench className="h-4 w-4" aria-hidden="true" />
          </span>
          RunFix
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-[var(--muted)] transition-colors duration-150 hover:text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#install"
            className="rounded-md bg-[var(--accent)] px-4 py-2 font-mono text-sm font-semibold text-[#0B0F14] transition-colors duration-150 hover:bg-[#6ee79b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Add RunFix to your agent
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-md text-[var(--text)] transition-colors hover:bg-[var(--surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-[var(--border)] bg-[#0B0F14] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-[var(--border)] py-3 font-mono text-sm text-[var(--text)] last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#install"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-md bg-[var(--accent)] px-4 py-3 text-center font-mono text-sm font-semibold text-[#0B0F14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Add RunFix to your agent
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
