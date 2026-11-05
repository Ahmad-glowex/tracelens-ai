import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen text-zinc-100 font-sans flex flex-col">
      <nav className="border-b border-white/5 bg-[#08080b]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-lg font-bold text-white">RunFix AI</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-24">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-red-500/10 border border-red-500/30 text-red-400 mb-6">
            <span>ERROR 404</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            Page Not Found
          </h1>
          <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
            The requested resource could not be found or has been moved to another location.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-semibold text-sm hover:bg-emerald-400 transition"
          >
            Return to Workbench
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-[#07070a] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; 2026 RunFix AI. All rights reserved. Operated by Raihan LLC.</p>
          <div className="flex items-center space-x-4">
            <Link href="/terms" className="text-zinc-400 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-zinc-400 hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
