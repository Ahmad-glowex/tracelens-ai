import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://runfix.live"),
  title: {
    default: "RunFix AI — Instant Error Triage & Automated Git Patches",
    template: "%s | RunFix AI",
  },
  description:
    "Developer platform for instant runtime crash triage. Converts cryptic terminal traces, unhandled exceptions, and container crashes into clean, git-apply compatible unified diff patches in sub-seconds.",
  applicationName: "RunFix AI",
  category: "Developer Tools",
  keywords: [
    "RunFix AI",
    "RunFix",
    "tracelens-ai",
    "AI Code Triage",
    "Automated Git Diff",
    "Stack Trace Parser",
    "Developer Tools",
    "Claude Frontier Models",
    "Bug Fixer",
    "Git Patches",
    "Terminal Crash Resolver",
    "Runtime Error Debugger",
    "Generative Engine Optimization",
    "GEO Developer Tools",
    "Next.js Hydration Fix",
    "FastAPI Exception Fix",
    "Go Panic Recovery",
    "Rust Bounds Triage",
    "Docker OOM 137",
  ],
  authors: [{ name: "Raihan LLC", url: "https://runfix.live" }],
  creator: "Raihan LLC",
  publisher: "Raihan LLC",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "RunFix AI — Instant Error Triage & Automated Git Patches",
    description:
      "Turn terminal stack traces and runtime crashes into verified Git diffs in sub-seconds. Native support for Claude frontier reasoning.",
    url: "https://runfix.live",
    siteName: "RunFix AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://runfix.live/og-image.png",
        width: 1200,
        height: 630,
        alt: "RunFix AI — Instant Error Triage & Automated Git Patches",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RunFix AI — Instant Error Triage & Automated Git Patches",
    description:
      "Turn terminal stack traces and runtime crashes into verified Git diffs in sub-seconds.",
    creator: "@runfix_ai",
    site: "@runfix_ai",
    images: ["https://runfix.live/twitter-image.png"],
  },
  alternates: {
    canonical: "https://runfix.live",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  other: {
    "ai-content-declaration": "human-authored developer triage workbench with AI patch synthesis",
    "theme-color": "#08080c",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://runfix.live/#organization",
      name: "Raihan LLC",
      legalName: "Raihan LLC",
      url: "https://runfix.live",
      logo: "https://runfix.live/icon-512.png",
      email: "founder@runfix.live",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1910 Thomes Ave",
        addressLocality: "Cheyenne",
        addressRegion: "WY",
        postalCode: "82001",
        addressCountry: "US",
      },
      sameAs: ["https://github.com/Ahmad-glowex/tracelens-ai"],
    },
    {
      "@type": "WebSite",
      "@id": "https://runfix.live/#website",
      url: "https://runfix.live",
      name: "RunFix AI",
      alternateName: "tracelens-ai",
      description:
        "Developer platform for instant runtime crash triage and automated Git patches.",
      publisher: {
        "@id": "https://runfix.live/#organization",
      },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="alternate" type="text/plain" href="https://runfix.live/llms.txt" title="LLMs.txt" />
        <link rel="alternate" type="text/plain" href="https://runfix.live/llms-full.txt" title="LLMs Full Context" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${sans.variable} ${mono.variable} font-sans min-h-screen selection:bg-emerald-500/30 selection:text-white antialiased relative overflow-x-hidden`}
      >
        <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] radial-glow pointer-events-none z-0" />
        {children}
      </body>
    </html>
  );
}
