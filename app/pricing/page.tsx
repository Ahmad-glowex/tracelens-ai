import type { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Zap,
  HelpCircle,
  Lock,
  Server,
  FileCheck,
  Check,
  Minus,
} from "lucide-react";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing Plans & Enterprise Subscriptions",
  description:
    "Simple, transparent pricing for RunFix AI. Get started free, bring your own API key (BYOK), or automate autonomous CI healing across all engineering repositories.",
  alternates: {
    canonical: "https://runfix.live/pricing",
  },
  openGraph: {
    title: "Pricing Plans | RunFix AI",
    description:
      "Simple, transparent pricing for RunFix AI. Developer Free, Pro BYOK ($19/mo or $0 BYOK), and Enterprise Healer.",
    url: "https://runfix.live/pricing",
    siteName: "RunFix AI",
    images: [
      {
        url: "https://runfix.live/og-image.png",
        width: 1200,
        height: 630,
        alt: "RunFix AI Pricing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans | RunFix AI",
    description:
      "Simple, transparent pricing for RunFix AI. Developer Free, Pro BYOK ($19/mo or $0 BYOK), and Enterprise Healer.",
    creator: "@runfix_ai",
    site: "@runfix_ai",
    images: ["https://runfix.live/twitter-image.png"],
  },
};

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://runfix.live/pricing/#webpage",
      url: "https://runfix.live/pricing",
      name: "RunFix AI Pricing Plans",
      description: "Transparent pricing tiers for RunFix AI Developer Free, Pro BYOK, and Enterprise Healer.",
      isPartOf: {
        "@id": "https://runfix.live/#website",
      },
    },
    {
      "@type": "Product",
      name: "RunFix AI",
      description: "Autonomous runtime crash triage, CLI & MCP server, and unified Git patch synthesis.",
      image: "https://runfix.live/og-image.png",
      brand: {
        "@type": "Brand",
        name: "RunFix AI",
      },
      offers: [
        {
          "@type": "Offer",
          name: "Developer Free",
          price: "0",
          priceCurrency: "USD",
          description: "Free tier for individual developers with rate-limited community models.",
        },
        {
          "@type": "Offer",
          name: "Pro BYOK",
          price: "19",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "19",
            priceCurrency: "USD",
            unitText: "MONTH",
          },
          description: "Professional plan with Anthropic Claude frontier reasoning, MCP server, and BYOK support.",
        },
        {
          "@type": "Offer",
          name: "Enterprise Healer",
          price: "99",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "99",
            priceCurrency: "USD",
            unitText: "MONTH",
          },
          description: "Autonomous CI Healer with multi-repo GitHub Action PR generation and dedicated SLA.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do you store or train on our private code and stack traces?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. RunFix operates a strict Zero Data Retention (ZDR) policy. Errors and diffs exist only in ephemeral RAM during generation and are never logged or stored.",
          },
        },
        {
          "@type": "Question",
          name: "How does Bring Your Own Key (BYOK) work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can supply your private Anthropic, Gemini, or Groq API keys in your browser or CLI environment variables. Requests route directly to the model provider with 0% platform markup.",
          },
        },
        {
          "@type": "Question",
          name: "What is the Autonomous GitHub Action CI Healer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It is a drop-in workflow template that triggers when your CI build fails, extracts the terminal failure log, synthesizes a fix, and opens a pull request automatically.",
          },
        },
      ],
    },
  ],
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Workbench</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/docs"
              className="text-xs text-zinc-400 hover:text-white transition-colors hidden sm:inline-block"
            >
              Documentation
            </Link>
            <Link
              href="/security"
              className="text-xs text-zinc-400 hover:text-white transition-colors hidden sm:inline-block"
            >
              Security
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight">Pricing & Plans</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="py-12 sm:py-16 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>TRANSPARENT DEVELOPER PRICING</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Start Free. Scale to Autonomous CI Healing.
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          No hidden fees, no opaque usage credits, and no telemetry. Use our community cluster for free or upgrade for frontier reasoning, MCP IDE integration, and CI automation.
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 flex-1 w-full pb-16">
        {/* Interactive Client Pricing (Cards & Stripe modal) */}
        <PricingClient />

        {/* Feature Comparison Table */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Detailed Feature Comparison
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Compare capabilities across Developer Free, Pro BYOK, and Enterprise Healer.
            </p>
          </div>

          <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/30">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-950/80 text-zinc-300 font-mono border-b border-zinc-800">
                <tr>
                  <th className="p-4 w-1/3">Feature / Capability</th>
                  <th className="p-4 text-center">Developer Free</th>
                  <th className="p-4 text-center text-cyan-400">Pro BYOK</th>
                  <th className="p-4 text-center text-purple-400">Enterprise Healer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                <tr>
                  <td className="p-4 font-medium text-white">Interactive Web Workbench</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Client-Side Secret & PII Scrubber</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Terminal CLI (<code className="text-cyan-400">npx runfix</code>)</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Inference Engine</td>
                  <td className="p-4 text-center text-zinc-400">Community LPUs</td>
                  <td className="p-4 text-center text-white">Claude 3.5 Sonnet / BYOK</td>
                  <td className="p-4 text-center text-white">Dedicated Priority Cascades</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Model Context Protocol (MCP) Server</td>
                  <td className="p-4 text-center"><Minus className="w-4 h-4 text-zinc-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Bring Your Own Key (BYOK) Support</td>
                  <td className="p-4 text-center"><Minus className="w-4 h-4 text-zinc-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Autonomous GitHub Action CI Healer</td>
                  <td className="p-4 text-center"><Minus className="w-4 h-4 text-zinc-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Minus className="w-4 h-4 text-zinc-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Multi-Repo Automated Pull Requests</td>
                  <td className="p-4 text-center"><Minus className="w-4 h-4 text-zinc-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Minus className="w-4 h-4 text-zinc-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Team Workspaces & Centralized Billing</td>
                  <td className="p-4 text-center"><Minus className="w-4 h-4 text-zinc-600 mx-auto" /></td>
                  <td className="p-4 text-center text-zinc-400">Single User</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Zero Data Retention (ZDR) SLA</td>
                  <td className="p-4 text-center text-zinc-400">Standard Privacy</td>
                  <td className="p-4 text-center text-zinc-300">Standard Privacy</td>
                  <td className="p-4 text-center text-emerald-400 font-semibold">Strict Enterprise BAA/DPA</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Dedicated VPC / On-Premise Gateway</td>
                  <td className="p-4 text-center"><Minus className="w-4 h-4 text-zinc-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Minus className="w-4 h-4 text-zinc-600 mx-auto" /></td>
                  <td className="p-4 text-center text-white">Available Add-On</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Support SLA</td>
                  <td className="p-4 text-center text-zinc-500">Community</td>
                  <td className="p-4 text-center text-zinc-300">Standard Email (24h)</td>
                  <td className="p-4 text-center text-emerald-400 font-semibold">Dedicated Slack (1h SLA)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Enterprise Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Zero Telemetry & ZDR</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We never store error logs or proprietary source code on disk. Processing occurs in volatile RAM and is wiped immediately upon patch generation.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Client-Side Scrubber</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Regex sanitization runs in the client browser or terminal before network transmission, wiping API keys, passwords, and tokens.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Stripe Billing Security</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All payment transactions are encrypted and processed by Stripe with PCI Service Provider Level 1 certification. Cancel anytime with no lock-in.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8 flex items-center justify-center space-x-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>Frequently Asked Billing Questions</span>
          </h2>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
              <h3 className="text-sm font-semibold text-white mb-1.5">
                Can I use RunFix completely free?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes. Our Developer Free tier includes the web workbench, community rate-limited models, client-side scrubber, and terminal CLI. There is no credit card required to get started.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
              <h3 className="text-sm font-semibold text-white mb-1.5">
                How does Bring Your Own Key (BYOK) work?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If you have an Anthropic, Google Gemini, or Groq API account, you can plug your API key directly into the RunFix workbench settings or CLI environment. Your requests are sent directly to the model provider with 0% platform surcharge.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
              <h3 className="text-sm font-semibold text-white mb-1.5">
                How does the Autonomous GitHub Action Healer work?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The GitHub Action workflow triggers when a CI build fails. It executes in your own GitHub runner, fetches the failed step log via GitHub CLI, sanitizes credentials, requests a patch from RunFix, and automatically opens a pull request on your behalf.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
              <h3 className="text-sm font-semibold text-white mb-1.5">
                Can I cancel or change my plan anytime?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes, you can upgrade, downgrade, or cancel your subscription at any time directly through the Stripe customer portal with no cancellation fees or lock-in contracts.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} RunFix AI (Raihan LLC). All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Workbench
            </Link>
            <Link href="/docs" className="hover:text-zinc-300 transition-colors">
              Documentation
            </Link>
            <Link href="/security" className="hover:text-zinc-300 transition-colors">
              Security
            </Link>
            <Link href="/about" className="hover:text-zinc-300 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
