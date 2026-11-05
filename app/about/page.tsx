import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowLeft, Terminal, Bot, GitPullRequest, ShieldCheck, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us & Vision | Raihan LLC",
  description:
    "The mission, leadership, and architectural roadmap of RunFix AI operated by Raihan LLC. Building the first autonomous sandboxed debugging engine for DevOps.",
  alternates: {
    canonical: "https://runfix.live/about",
  },
  openGraph: {
    title: "About Us & Vision | RunFix AI",
    description:
      "The mission, leadership, and architectural roadmap of RunFix AI operated by Raihan LLC.",
    url: "https://runfix.live/about",
    siteName: "RunFix AI",
    images: [
      {
        url: "https://runfix.live/og-image.png",
        width: 1200,
        height: 630,
        alt: "RunFix AI — About Us",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us & Vision | RunFix AI",
    description:
      "The mission, leadership, and architectural roadmap of RunFix AI operated by Raihan LLC.",
    creator: "@runfix_ai",
    site: "@runfix_ai",
    images: ["https://runfix.live/twitter-image.png"],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://runfix.live/about/#webpage",
      url: "https://runfix.live/about",
      name: "About Us & Vision | RunFix AI",
      description:
        "The mission, leadership, and architectural roadmap of RunFix AI operated by Raihan LLC.",
      isPartOf: {
        "@id": "https://runfix.live/#website",
      },
      breadcrumb: {
        "@id": "https://runfix.live/about/#breadcrumb",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://runfix.live/about/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://runfix.live",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: "https://runfix.live/about",
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Workbench</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-tight">RunFix AI</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>RAIHAN LLC MISSION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Eliminating Debugging Friction with Autonomous Sandboxed Healing
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            RunFix AI was born out of a simple frustration: developers spend up to 40% of their engineering cycles untangling cryptic runtime stack traces, unhandled exceptions, and broken CI pipelines.
          </p>
        </div>

        {/* The Shift */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 mb-12">
          <h2 className="text-lg font-bold text-white mb-3">Our Thesis: From Chatbots to Verified Action</h2>
          <p className="text-sm text-zinc-300 leading-relaxed mb-4">
            Generic conversational AI chatbots provide polite explanations, but software engineers do not need polite explanations—they need <strong className="text-cyan-400">syntactically verified, production-ready Git diffs</strong> that pass tests and resolve crashes in sub-seconds.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We operate under a zero-telemetry, privacy-first commitment: no user error trace or patch is ever retained, stored, or fed into model training.
          </p>
        </div>

        {/* Roadmap Milestones */}
        <h2 className="text-xl font-bold text-white mb-6">Commercial Architecture & Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">Phase 1 • Live</span>
              <h3 className="text-base font-semibold text-white mt-1 mb-2">CLI & MCP Server</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Execute <code className="text-cyan-300 font-mono">npx runfix</code> directly in your terminal, or connect the official RunFix Model Context Protocol (MCP) server to Cursor and Claude Desktop.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">Phase 2 • Q4 2026</span>
              <h3 className="text-base font-semibold text-white mt-1 mb-2">Autonomous CI/CD Healer</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                GitHub Action and GitLab CI integration. When a test or build fails, RunFix autonomously diagnoses the root cause, tests the patch in a sandboxed runner, and opens an actionable Pull Request.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400">Phase 3 • 2027</span>
              <h3 className="text-base font-semibold text-white mt-1 mb-2">Live Incident Webhooks</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Direct integration with Sentry, Datadog, and AWS CloudWatch. Receive instant Slack / Teams alerts with pre-verified emergency patches within 30 seconds of an incident.
              </p>
            </div>
          </div>
        </div>

        {/* Company Identity */}
        <div className="border-t border-zinc-800/80 pt-8 text-sm text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-white mb-2">Company & Stewardship</h2>
          <p className="mb-4">
            RunFix AI is developed and operated by <strong>Raihan LLC</strong>, dedicated to developer tooling, high-throughput inference orchestration, and automated software repair.
          </p>
          <p>
            For enterprise partnerships, security reviews, or technical inquiries, reach out directly at{" "}
            <a href="mailto:contact@runfix.live" className="text-cyan-400 hover:underline">
              contact@runfix.live
            </a>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} RunFix AI (Raihan LLC). All rights reserved.</div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Workbench</Link>
            <Link href="/security" className="hover:text-zinc-300 transition-colors">Security</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
