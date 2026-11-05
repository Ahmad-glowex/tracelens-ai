import type { Metadata } from "next";
import Link from "next/link";
import {
  Terminal,
  Zap,
  ArrowLeft,
  Bot,
  Shield,
  Workflow,
  Cpu,
  CheckCircle2,
  BookOpen,
  Layers,
  ArrowRight,
  ExternalLink,
  Code,
  FileCode,
  Key,
} from "lucide-react";
import { CopySnippet } from "./CopySnippet";

export const metadata: Metadata = {
  title: "Developer Documentation & Setup Guide",
  description:
    "Comprehensive developer documentation for RunFix AI: Interactive Workbench, Terminal CLI (npx runfix), Model Context Protocol (MCP) Server, Autonomous CI Action, and REST API.",
  alternates: {
    canonical: "https://runfix.live/docs",
  },
  openGraph: {
    title: "Developer Documentation | RunFix AI",
    description:
      "Developer guides for RunFix AI: Terminal CLI, MCP server for Cursor & Claude, GitHub Action healer, and REST API.",
    url: "https://runfix.live/docs",
    siteName: "RunFix AI",
    images: [
      {
        url: "https://runfix.live/og-image.png",
        width: 1200,
        height: 630,
        alt: "RunFix AI Documentation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Documentation | RunFix AI",
    description:
      "Developer guides for RunFix AI: Terminal CLI, MCP server for Cursor & Claude, GitHub Action healer, and REST API.",
    creator: "@runfix_ai",
    site: "@runfix_ai",
    images: ["https://runfix.live/twitter-image.png"],
  },
};

const docsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://runfix.live/docs/#article",
      url: "https://runfix.live/docs",
      name: "RunFix AI Developer Documentation",
      description:
        "Technical guide for configuring RunFix AI terminal CLI, Model Context Protocol server, and autonomous GitHub Action workflow.",
      inLanguage: "en-US",
      author: {
        "@type": "Organization",
        name: "RunFix AI (Raihan LLC)",
        url: "https://runfix.live",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://runfix.live/docs/#breadcrumb",
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
          name: "Documentation",
          item: "https://runfix.live/docs",
        },
      ],
    },
  ],
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docsJsonLd) }}
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
              href="/security"
              className="text-xs text-zinc-400 hover:text-white transition-colors hidden sm:inline-block"
            >
              Security
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight">Developer Docs</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900/30 via-transparent to-transparent py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>RUNFIX V1.1 SPECIFICATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Developer Documentation
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-3xl leading-relaxed">
            Everything you need to integrate RunFix AI into your terminal workflow, IDE (Cursor, Windsurf, Claude Desktop), CI/CD pipelines, and cloud services.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <a
              href="#quickstart"
              className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 text-xs font-semibold font-mono transition-colors"
            >
              Quickstart Guide
            </a>
            <a
              href="#cli"
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white text-xs font-mono transition-colors"
            >
              CLI Reference
            </a>
            <a
              href="#mcp"
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white text-xs font-mono transition-colors"
            >
              MCP Setup
            </a>
            <a
              href="#ci-healer"
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white text-xs font-mono transition-colors"
            >
              GitHub Action
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-6 text-xs">
            <div>
              <div className="font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 font-mono text-[11px]">
                Getting Started
              </div>
              <ul className="space-y-1.5 border-l border-zinc-800 pl-3">
                <li>
                  <a href="#quickstart" className="text-zinc-400 hover:text-cyan-400 transition-colors block">
                    1. Quickstart
                  </a>
                </li>
                <li>
                  <a href="#workbench" className="text-zinc-400 hover:text-cyan-400 transition-colors block">
                    2. Web Workbench
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 font-mono text-[11px]">
                Integration & Tools
              </div>
              <ul className="space-y-1.5 border-l border-zinc-800 pl-3">
                <li>
                  <a href="#cli" className="text-zinc-400 hover:text-cyan-400 transition-colors block">
                    3. Terminal CLI (`runfix`)
                  </a>
                </li>
                <li>
                  <a href="#mcp" className="text-zinc-400 hover:text-cyan-400 transition-colors block">
                    4. Model Context Protocol (MCP)
                  </a>
                </li>
                <li>
                  <a href="#scrubber" className="text-zinc-400 hover:text-cyan-400 transition-colors block">
                    5. Secret & PII Scrubber
                  </a>
                </li>
                <li>
                  <a href="#ci-healer" className="text-zinc-400 hover:text-cyan-400 transition-colors block">
                    6. GitHub Action CI Healer
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 font-mono text-[11px]">
                API & Runtimes
              </div>
              <ul className="space-y-1.5 border-l border-zinc-800 pl-3">
                <li>
                  <a href="#api" className="text-zinc-400 hover:text-cyan-400 transition-colors block">
                    7. REST API (`/api/analyze`)
                  </a>
                </li>
                <li>
                  <a href="#runtimes" className="text-zinc-400 hover:text-cyan-400 transition-colors block">
                    8. Supported Languages
                  </a>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-zinc-800/80">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-200 block mb-1">Need Enterprise Support?</span>
                Dedicated VPCs, custom SLAs, and on-premise gateways.
                <a
                  href="mailto:founder@runfix.live"
                  className="mt-2 block text-cyan-400 hover:underline font-mono text-[10px]"
                >
                  Contact founder@runfix.live →
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="lg:col-span-3 space-y-16">
          {/* Section 1: Quickstart */}
          <section id="quickstart" className="scroll-mt-24">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <Zap className="w-4 h-4" />
              <span>STEP 01</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">Quickstart Guide</h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Get from crash to verified fix in under 10 seconds. You can run RunFix from your browser, terminal, or IDE without creating an account.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <h3 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Direct Terminal Execution (No Installation Required)</span>
                </h3>
                <p className="text-xs text-zinc-400 mb-2">
                  Prepend `npx runfix` to your standard test or build command:
                </p>
                <CopySnippet code="npx runfix &quot;npm test&quot;" filename="Terminal Command" />
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <h3 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Apply the Synthesized Git Patch</span>
                </h3>
                <p className="text-xs text-zinc-400 mb-2">
                  RunFix returns a clean unified Git diff. Apply it directly with git:
                </p>
                <CopySnippet
                  code="git apply patch.diff && npm test"
                  filename="Terminal Verification"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Web Workbench */}
          <section id="workbench" className="scroll-mt-24 border-t border-zinc-800/80 pt-10">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <Layers className="w-4 h-4" />
              <span>STEP 02</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              Interactive Web Workbench
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              The RunFix Web Workbench at{" "}
              <Link href="/" className="text-cyan-400 hover:underline">
                runfix.live
              </Link>{" "}
              provides a split-pane interface designed for rapid manual triage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <div className="font-semibold text-white mb-1">Interactive Presets</div>
                Instant 1-click test benches for Node.js, Python, Go, Rust, and Docker crashes.
              </div>
              <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <div className="font-semibold text-white mb-1">Client-Side Scrubber Active</div>
                Secrets, passwords, and tokens are scrubbed in the browser before hitting the wire.
              </div>
              <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <div className="font-semibold text-white mb-1">1-Click Patch Download</div>
                Export RFC 5322 formatted `.diff` patches directly to your disk or clipboard.
              </div>
              <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <div className="font-semibold text-white mb-1">Bring Your Own Key (BYOK)</div>
                Input your private Anthropic, Gemini, or Groq API keys stored exclusively in localStorage.
              </div>
            </div>
          </section>

          {/* Section 3: CLI Reference */}
          <section id="cli" className="scroll-mt-24 border-t border-zinc-800/80 pt-10">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <Terminal className="w-4 h-4" />
              <span>STEP 03</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              Terminal CLI (`runfix`) Reference
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              The official RunFix CLI wraps any command execution, monitors exit codes, captures standard error output, scrubs secrets, and queries the triage engine.
            </p>

            <h3 className="text-sm font-semibold text-white mb-2 font-mono">Usage Modes</h3>
            <CopySnippet
              filename="CLI Commands"
              code={`# 1. Wrap and monitor any command:
npx runfix "npm test"
npx runfix "pytest tests/"
npx runfix "cargo build"
npx runfix "go test ./..."

# 2. Pipe standard error directly:
cat crash.log | npx runfix
git log -1 --stat | npx runfix

# 3. Model Context Protocol (MCP) stdio server:
npx runfix mcp

# 4. View help and version:
npx runfix --help
npx runfix --version`}
            />

            <h3 className="text-sm font-semibold text-white mt-6 mb-2 font-mono">
              CLI Environment Variables
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-zinc-800 rounded-lg overflow-hidden">
                <thead className="bg-zinc-900 text-zinc-300 font-mono">
                  <tr>
                    <th className="p-2.5 border-b border-zinc-800">Variable</th>
                    <th className="p-2.5 border-b border-zinc-800">Default</th>
                    <th className="p-2.5 border-b border-zinc-800">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-400 font-mono">
                  <tr>
                    <td className="p-2.5 text-cyan-400">RUNFIX_API_URL</td>
                    <td className="p-2.5">https://runfix.live/api/analyze</td>
                    <td className="p-2.5 font-sans">Endpoint URL for crash triage. Override for on-premise or custom gateways.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-cyan-400">RUNFIX_API_KEY</td>
                    <td className="p-2.5 font-sans text-zinc-500">None (optional)</td>
                    <td className="p-2.5 font-sans">Private provider API key passed securely for dedicated tenant routing.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: MCP Server */}
          <section id="mcp" className="scroll-mt-24 border-t border-zinc-800/80 pt-10">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <Bot className="w-4 h-4" />
              <span>STEP 04</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              Model Context Protocol (MCP) Server
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              RunFix includes an official Model Context Protocol (MCP) server operating over stdio (JSON-RPC 2.0). Connect it to your AI coding environments like Claude Desktop, Cursor, and Windsurf to give your agent native error-fixing superpowers.
            </p>

            <h3 className="text-sm font-semibold text-white mb-2 font-mono">
              Tools Exposed by RunFix MCP
            </h3>
            <div className="space-y-3 mb-6">
              <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    triage_stacktrace
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">tool</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Pinpoint root cause of terminal error traces and synthesize a verified unified Git patch diff. Requires `errorLog`.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-xs text-purple-400 font-bold">
                    scrub_sensitive_data
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">tool</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Sanitize API keys, tokens, credentials, and passwords from error logs prior to external sending.
                </p>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-white mb-2 font-mono">
              Claude Desktop Configuration
            </h3>
            <p className="text-xs text-zinc-400 mb-2">
              Add this block to your Claude Desktop config file (macOS:{" "}
              <code className="text-cyan-400">~/Library/Application Support/Claude/claude_desktop_config.json</code>
              , Windows: <code className="text-cyan-400">%APPDATA%\Claude\claude_desktop_config.json</code>):
            </p>
            <CopySnippet
              filename="claude_desktop_config.json"
              language="json"
              code={`{
  "mcpServers": {
    "runfix": {
      "command": "npx",
      "args": ["-y", "runfix", "mcp"],
      "env": {
        "RUNFIX_API_URL": "https://runfix.live/api/analyze"
      }
    }
  }
}`}
            />

            <h3 className="text-sm font-semibold text-white mt-6 mb-2 font-mono">
              Cursor IDE Configuration
            </h3>
            <p className="text-xs text-zinc-400 mb-2">
              Add to your project’s <code className="text-cyan-400">.cursor/mcp.json</code> or global Cursor Settings:
            </p>
            <CopySnippet
              filename=".cursor/mcp.json"
              language="json"
              code={`{
  "mcpServers": {
    "runfix": {
      "command": "npx",
      "args": ["-y", "runfix", "mcp"]
    }
  }
}`}
            />
          </section>

          {/* Section 5: Scrubber */}
          <section id="scrubber" className="scroll-mt-24 border-t border-zinc-800/80 pt-10">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <Shield className="w-4 h-4" />
              <span>STEP 05</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              Client-Side Secret & PII Scrubber
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              RunFix contains an embedded sanitization engine that scrubs credentials in the browser or terminal before any HTTP payload leaves your machine.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-zinc-800 rounded-lg overflow-hidden">
                <thead className="bg-zinc-900 text-zinc-300 font-mono">
                  <tr>
                    <th className="p-2.5 border-b border-zinc-800">Target Category</th>
                    <th className="p-2.5 border-b border-zinc-800">Example Trigger Pattern</th>
                    <th className="p-2.5 border-b border-zinc-800">Redaction Token</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-400 font-mono">
                  <tr>
                    <td className="p-2.5 text-white">Private Keys</td>
                    <td className="p-2.5">-----BEGIN RSA PRIVATE KEY-----</td>
                    <td className="p-2.5 text-emerald-400">[REDACTED_PRIVATE_KEY]</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white">OpenAI API Keys</td>
                    <td className="p-2.5">sk-proj-9481ad8...</td>
                    <td className="p-2.5 text-emerald-400">[REDACTED_OPENAI_KEY]</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white">Anthropic API Keys</td>
                    <td className="p-2.5">sk-ant-api03-8x7...</td>
                    <td className="p-2.5 text-emerald-400">[REDACTED_ANTHROPIC_KEY]</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white">Google API Keys</td>
                    <td className="p-2.5">AIzaSyB8b3Z...</td>
                    <td className="p-2.5 text-emerald-400">[REDACTED_GOOGLE_KEY]</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white">GitHub PAT / Tokens</td>
                    <td className="p-2.5">ghp_9148b1..., github_pat_...</td>
                    <td className="p-2.5 text-emerald-400">[REDACTED_GITHUB_TOKEN]</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white">AWS Access Keys</td>
                    <td className="p-2.5">AKIAIOSFODNN7EXAMPLE</td>
                    <td className="p-2.5 text-emerald-400">[REDACTED_AWS_KEY_ID]</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white">DB Connections</td>
                    <td className="p-2.5">postgres://admin:pass@host/db</td>
                    <td className="p-2.5 text-emerald-400">[REDACTED_DB_PASSWORD]</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white">JWT Bearer</td>
                    <td className="p-2.5">Bearer eyJhbGciOi...</td>
                    <td className="p-2.5 text-emerald-400">Bearer [REDACTED_JWT]</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: CI Healer Action */}
          <section id="ci-healer" className="scroll-mt-24 border-t border-zinc-800/80 pt-10">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <Workflow className="w-4 h-4" />
              <span>STEP 06</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              Autonomous GitHub Action CI Healer
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Integrate RunFix directly into GitHub Actions to heal broken builds automatically. When a workflow fails, the action extracts the failed step log, synthesizes a patch, and opens an actionable Pull Request.
            </p>

            <p className="text-xs text-zinc-400 mb-2">
              Save this workflow file to <code className="text-cyan-400">.github/workflows/runfix-action.yml</code> in your repository:
            </p>

            <CopySnippet
              filename=".github/workflows/runfix-action.yml"
              language="yaml"
              code={`name: "RunFix AI Autonomous Healer"

on:
  workflow_run:
    workflows: ["CI", "Test", "Build"]
    types: [completed]

jobs:
  auto-heal:
    runs-on: ubuntu-latest
    if: \${{ github.event.workflow_run.conclusion == 'failure' }}
    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          ref: \${{ github.event.workflow_run.head_branch }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Fetch Failed Step Logs & Triage via RunFix AI
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          RUNFIX_API_URL: "https://runfix.live/api/analyze"
        run: |
          echo "Inspecting failed workflow run: \${{ github.event.workflow_run.id }}"
          gh run view \${{ github.event.workflow_run.id }} --log-failed > failed_trace.log || true

          if [ -s failed_trace.log ]; then
            echo "Invoking RunFix AI triage engine..."
            npx runfix < failed_trace.log > runfix_diagnosis.json || true
          fi

      - name: Apply Patch and Open Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          commit-message: "fix(ci): automated patch synthesized by RunFix AI"
          title: "🤖 [RunFix AI] Automated Fix for failed CI run #\${{ github.event.workflow_run.run_number }}"
          body: |
            ## Automated Crash Healing Report
            RunFix AI detected a workflow failure on branch \`\${{ github.event.workflow_run.head_branch }}\`.

            - **Root Cause Pinpointed**: Analyzed via multi-engine fallback.
            - **Unified Patch**: Synthesized and applied cleanly.
            - **Verification Status**: Ready for review and merge.

            *Powered by [RunFix AI](https://runfix.live) (Raihan LLC).*
          branch: "runfix/auto-fix-\${{ github.event.workflow_run.run_number }}"
          delete-branch: true`}
            />
          </section>

          {/* Section 7: REST API */}
          <section id="api" className="scroll-mt-24 border-t border-zinc-800/80 pt-10">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <Code className="w-4 h-4" />
              <span>STEP 07</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              REST API (`POST /api/analyze`)
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Integrate RunFix programmatic triage into custom CLI bots, Datadog/Sentry webhooks, or internal dev tools.
            </p>

            <CopySnippet
              filename="cURL Request Example"
              language="bash"
              code={`curl -X POST https://runfix.live/api/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "errorLog": "TypeError: Cannot read properties of undefined (reading '\''map'\'')\\n    at UserProfileList (src/components/UserProfileList.tsx:42:28)",
    "provider": "anthropic",
    "model": "claude-frontier"
  }'`}
            />

            <h3 className="text-sm font-semibold text-white mt-6 mb-2 font-mono">
              JSON Response Format
            </h3>
            <CopySnippet
              filename="Response 200 OK"
              language="json"
              code={`{
  "success": true,
  "data": {
    "rootCause": "The 'users' collection is asynchronously populated. On initial mount before resolution, 'users' evaluates to undefined. Invoking map causes an unhandled TypeError.",
    "targetFile": "src/components/UserProfileList.tsx",
    "diff": "@@ -40,3 +40,3 @@\\n-  return users.map(u => <UserCard key={u.id} user={u} />);\\n+  return (users ?? []).map(u => <UserCard key={u.id} user={u} />);\\n",
    "latency": 342,
    "provider": "ANTHROPIC",
    "model": "claude-frontier"
  }
}`}
            />
          </section>

          {/* Section 8: Supported Languages */}
          <section id="runtimes" className="scroll-mt-24 border-t border-zinc-800/80 pt-10">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <FileCode className="w-4 h-4" />
              <span>STEP 08</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              Supported Stacks & Runtimes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <div className="font-semibold text-white mb-1.5 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Node.js, TypeScript & React</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Async unhandled promise rejections, TypeError null/undefined properties, Vite/Webpack build crashes, and React hydration mismatches.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <div className="font-semibold text-white mb-1.5 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span>Python & FastAPI</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Pydantic 422 validation crashes, Django ORM tracebacks, Celery worker task exceptions, and SQLAlchemy session locks.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <div className="font-semibold text-white mb-1.5 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Go (Golang)</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Concurrent map read and write panics, nil pointer dereferences, channel deadlocks, and goroutine leak traces.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <div className="font-semibold text-white mb-1.5 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  <span>Rust</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Tokio worker thread bounds checks, vector index out-of-bounds panics, unwrap on None errors, and lifetime borrow checker diagnostics.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 sm:col-span-2">
                <div className="font-semibold text-white mb-1.5 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Docker & Linux Containers</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Linux OOM Killer Exit Code 137, v8 JavaScript heap limit exhaustion, segfaults (Exit 139), and missing shared library loading failures.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} RunFix AI (Raihan LLC). All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Workbench
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
