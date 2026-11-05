import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service, acceptable use policies, operating entity notices, and legal agreements for RunFix AI operated by Raihan LLC.",
  alternates: {
    canonical: "https://runfix.live/terms",
  },
  openGraph: {
    title: "Terms of Service | RunFix AI",
    description:
      "Terms of Service, acceptable use policies, and legal agreements for RunFix AI operated by Raihan LLC.",
    url: "https://runfix.live/terms",
    siteName: "RunFix AI",
    images: [
      {
        url: "https://runfix.live/og-image.png",
        width: 1200,
        height: 630,
        alt: "RunFix AI — Terms of Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | RunFix AI",
    description:
      "Terms of Service, acceptable use policies, and legal agreements for RunFix AI operated by Raihan LLC.",
    creator: "@runfix_ai",
    site: "@runfix_ai",
    images: ["https://runfix.live/twitter-image.png"],
  },
};

const termsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://runfix.live/terms/#webpage",
      url: "https://runfix.live/terms",
      name: "Terms of Service | RunFix AI",
      description:
        "Terms of Service, acceptable use policies, operating entity notices, and legal agreements for RunFix AI operated by Raihan LLC.",
      isPartOf: {
        "@id": "https://runfix.live/#website",
      },
      breadcrumb: {
        "@id": "https://runfix.live/terms/#breadcrumb",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://runfix.live/terms/#breadcrumb",
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
          name: "Terms of Service",
          item: "https://runfix.live/terms",
        },
      ],
    },
  ],
};

export default function TermsPage() {
  return (
    <div className="min-h-screen text-zinc-100 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }}
      />
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
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-mono text-zinc-500">
            <ol className="flex items-center space-x-2 list-none p-0 m-0">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-zinc-300">
                Terms of Service
              </li>
            </ol>
          </nav>
          <div className="text-xs font-mono text-brand-400 uppercase tracking-widest mb-2">
            Legal Agreement
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Terms of Service</h1>
          <p className="text-xs text-zinc-500 font-mono mb-8">Last Updated: October 13, 2026</p>

          <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Agreement to Terms</h2>
              <p>
                By accessing or using the RunFix AI platform, application, command-line interface,
                or APIs, operated by <strong>Raihan LLC</strong>, you agree to be bound by these
                Terms of Service. If you do not agree to these Terms, you may not access or use our
                Services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Operating Entity</h2>
              <p>
                RunFix AI is proudly developed and operated by <strong>Raihan LLC</strong>, a
                legal entity organized under the laws of the State of Wyoming, located at{" "}
                <strong>1910 Thomes Ave, Cheyenne, WY 82001, United States</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">
                3. Use of Services & Code Processing
              </h2>
              <p>
                RunFix AI provides diagnostic parsing of error messages, stack traces, and
                software code diff generation. You retain full ownership and intellectual property
                rights to any source code or telemetry you input into the Service. We do not use
                your proprietary source code to train foundation models without your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Disclaimer of Warranties</h2>
              <p>
                The Services and generated Git patches are provided on an &quot;AS IS&quot; and &quot;AS
                AVAILABLE&quot; basis. Automated AI-generated code patches must be reviewed,
                compiled, and tested prior to deployment to production environments.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, in no event shall Raihan LLC, its
                officers, directors, employees, or affiliates be liable for any indirect, punitive,
                incidental, special, consequential, or exemplary damages.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">6. Contact Information</h2>
              <div className="mt-2 p-4 rounded-xl bg-dark-elevated border border-dark-border font-mono text-xs text-zinc-300">
                <strong>Raihan LLC</strong>
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
            <Link href="/terms" className="text-zinc-300 hover:text-white">
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
