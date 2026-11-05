import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Zap, ArrowLeft, Lock, EyeOff, Server, Key, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Enterprise Security & Zero Data Retention",
  description:
    "Enterprise security architecture, zero code telemetry, client-side secret scrubbing, and BYOK governance for RunFix AI operated by Raihan LLC.",
  alternates: {
    canonical: "https://runfix.live/security",
  },
  openGraph: {
    title: "Enterprise Security & Compliance | RunFix AI",
    description:
      "Enterprise security architecture, zero code telemetry, and client-side secret scrubbing for RunFix AI.",
    url: "https://runfix.live/security",
    siteName: "RunFix AI",
    images: [
      {
        url: "https://runfix.live/og-image.png",
        width: 1200,
        height: 630,
        alt: "RunFix AI — Enterprise Security",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise Security & Compliance | RunFix AI",
    description:
      "Enterprise security architecture, zero code telemetry, and client-side secret scrubbing for RunFix AI.",
    creator: "@runfix_ai",
    site: "@runfix_ai",
    images: ["https://runfix.live/twitter-image.png"],
  },
};

const securityJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://runfix.live/security/#webpage",
      url: "https://runfix.live/security",
      name: "Enterprise Security & Compliance | RunFix AI",
      description:
        "Enterprise security architecture, zero code telemetry, and client-side secret scrubbing for RunFix AI.",
      isPartOf: {
        "@id": "https://runfix.live/#website",
      },
      breadcrumb: {
        "@id": "https://runfix.live/security/#breadcrumb",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://runfix.live/security/#breadcrumb",
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
          name: "Security",
          item: "https://runfix.live/security",
        },
      ],
    },
  ],
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(securityJsonLd) }}
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
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-tight">Security & Compliance</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>ENTERPRISE-GRADE TRUST BOUNDARY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Zero Telemetry & Code Privacy Architecture
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            RunFix AI is built from the ground up for engineering teams with strict intellectual property and compliance requirements. Your proprietary code and error traces are never stored, logged, or used for model training.
          </p>
        </div>

        {/* 4 Pillars of Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <EyeOff className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1.5">Client-Side Secret & PII Scrubbing</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Before any error trace leaves your browser or terminal, our client-side regex engine sanitizes API keys (OpenAI, AWS, Anthropic, Google), JWT tokens, database passwords, and personal credentials.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1.5">Zero Data Retention (ZDR)</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We do not persist submitted error logs or synthesized patches on any persistent disk or database. Analysis runs in ephemeral memory and is discarded immediately after response synthesis.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1.5">Bring Your Own Key (BYOK)</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Direct API billing through your own Anthropic, Groq, or OpenAI keys. Custom API keys are stored exclusively in your browser’s client-side localStorage and are never written to our servers.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1.5">No AI Model Training</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Under our zero-retention developer agreements, your stack traces, source code excerpts, and patches are never submitted to public model training corpora or used to fine-tune AI systems.
            </p>
          </div>
        </div>

        {/* Detailed Compliance Sections */}
        <div className="space-y-8 text-sm text-zinc-300">
          <section className="border-t border-zinc-800/80 pt-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>1. Data Transmission & Encryption</span>
            </h3>
            <p className="leading-relaxed text-zinc-400">
              All communications between developer clients, the RunFix web interface, the CLI, and our inference gateway are encrypted in transit using industry-standard TLS 1.3 with HSTS enforced. Unencrypted plain-text HTTP connections are unconditionally refused.
            </p>
          </section>

          <section className="border-t border-zinc-800/80 pt-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>2. Multi-Engine Failover Security</span>
            </h3>
            <p className="leading-relaxed text-zinc-400">
              Our automated failover cascades through isolated enterprise inference endpoints (Anthropic, Google Cloud Vertex, Groq LPUs). Each provider is selected based on zero-data-retention enterprise terms, ensuring consistency across fallback channels.
            </p>
          </section>

          <section className="border-t border-zinc-800/80 pt-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>3. Enterprise & Compliance Inquiries</span>
            </h3>
            <p className="leading-relaxed text-zinc-400">
              For enterprise VPC deployments, dedicated on-premise inference gateways, or custom BAA/DPA agreements, please contact Raihan LLC directly at{" "}
              <a href="mailto:security@runfix.live" className="text-cyan-400 hover:underline">
                security@runfix.live
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} RunFix AI (Raihan LLC). All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Workbench</Link>
            <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
            <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
