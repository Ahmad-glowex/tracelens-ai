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
  title: "RunFix AI (runfix.live) — Instant Code Triage & Automated Git Patches",
  description:
    "Full-stack AI developer tool. Turn terminal stack traces and runtime crashes into verified Git diffs in sub-seconds.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
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
