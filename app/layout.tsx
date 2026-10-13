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
  title: "RunFix AI — Instant Error Triage & Automated Git Patches",
  description:
    "Developer platform for instant runtime crash triage. Converts cryptic terminal traces, unhandled exceptions, and container crashes into clean, git-apply compatible unified diff patches in sub-seconds.",
  keywords: [
    "RunFix AI",
    "RunFix",
    "AI Code Triage",
    "Automated Git Diff",
    "Stack Trace Parser",
    "Developer Tools",
    "Claude Frontier Models",
    "Bug Fixer",
    "Git Patches",
    "Terminal Crash Resolver",
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
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RunFix AI — Instant Error Triage & Automated Git Patches",
    description:
      "Turn terminal stack traces and runtime crashes into verified Git diffs in sub-seconds.",
    creator: "@runfix_ai",
  },
  alternates: {
    canonical: "https://runfix.live",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RunFix AI",
  operatingSystem: "All",
  applicationCategory: "DeveloperApplication",
  url: "https://runfix.live",
  description:
    "Automated developer error triage engine turning terminal crashes into verified Git diff patches.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  publisher: {
    "@type": "Organization",
    name: "Raihan LLC",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1910 Thomes Ave",
      addressLocality: "Cheyenne",
      addressRegion: "WY",
      postalCode: "82001",
      addressCountry: "US",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
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
