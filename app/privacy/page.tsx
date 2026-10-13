import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen text-zinc-100 font-sans">
      <nav className="border-b border-dark-border/80 bg-dark-bg/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-brand-400" />
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="glass-card rounded-2xl p-8 sm:p-12">
          <div className="text-xs font-mono text-brand-400 uppercase tracking-widest mb-2">
            Privacy & Governance
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Privacy Policy</h1>
          <p className="text-xs text-zinc-500 font-mono mb-8">Last Updated: October 13, 2026</p>

          <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">
                1. Overview & Zero Telemetry
              </h2>
              <p>
                At RunFix AI, operated by <strong>Raihan LLC</strong>, we are developers building
                for developers. We recognize that error logs and stack traces often contain sensitive
                directory paths and code snippets. Our core architectural philosophy is built on
                strict privacy and zero centralized code telemetry.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Data We Do NOT Collect</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li>
                  <strong>Your Source Code & Stacks:</strong> We do not log, retain, or store your
                  inputted terminal crashes or generated patches.
                </li>
                <li>
                  <strong>Your API Credentials:</strong> Keys provided in Bring Your Own Key (BYOK)
                  mode are stored exclusively inside your web browser&apos;s isolated localStorage.
                </li>
                <li>
                  <strong>Model Training:</strong> Your input data is never used to train or fine-tune
                  AI foundation models.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Operator Contact</h2>
              <div className="mt-2 p-4 rounded-xl bg-dark-elevated border border-dark-border font-mono text-xs text-zinc-300">
                <strong>Raihan LLC</strong>
                <br />
                Attn: Privacy & Data Protection
                <br />
                1910 Thomes Ave
                <br />
                Cheyenne, WY 82001
                <br />
                United States
                <br />
                Email: founder@runfix.live
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-dark-border/80 bg-dark-bg/95 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            &copy; 2026 RunFix AI. All rights reserved. Operated by Raihan LLC (1910 Thomes Ave,
            Cheyenne, WY 82001, United States).
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/terms" className="text-zinc-400 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-zinc-300 hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
