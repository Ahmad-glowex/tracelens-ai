import Link from "next/link";
import {
  ArrowRight,
  Bug,
  CheckCircle2,
  ClipboardCheck,
  GitPullRequestArrow,
  Plug,
  ShieldCheck,
  Terminal,
  Wrench,
  Zap,
} from "lucide-react";
import { CopySnippet } from "./docs/CopySnippet";

const agents = [
  {
    name: "Claude Code",
    code: `claude mcp add runfix -- npx -y runfix mcp`,
    note: "Project or user scope; RunFix joins the agent's MCP tool list immediately.",
  },
  {
    name: "Codex",
    code: `# ~/.codex/config.toml
[mcp_servers.runfix]
command = "npx"
args = ["-y", "runfix", "mcp"]`,
    note: "Add the server block, then restart Codex to load the triage_failure tool.",
  },
  {
    name: "Cursor",
    code: `# ~/.cursor/mcp.json
{
  "mcpServers": {
    "runfix": { "command": "npx", "args": ["-y", "runfix", "mcp"] }
  }
}`,
    note: "Paste into MCP settings and enable; Cursor detects it on the next session.",
  },
  {
    name: "Antigravity",
    code: `npx -y runfix mcp`,
    note: "Point the Antigravity MCP client at the runfix binary over stdio.",
  },
];

const features = [
  {
    icon: Zap,
    title: "Root cause in one tool call",
    body: "triage_failure takes the failing command and its output, then returns the real cause — not a paraphrase of the stack trace.",
  },
  {
    icon: ClipboardCheck,
    title: "Every patch pre-verified",
    body: "Patches are checked with git apply --check before they are returned. If it would not apply, you get the diagnosis, not a broken edit.",
  },
  {
    icon: ShieldCheck,
    title: "Secrets scrubbed by default",
    body: "Tokens, keys and connection strings are stripped from everything that leaves your machine, ten categories covered.",
  },
  {
    icon: Plug,
    title: "Native MCP, zero glue",
    body: "Runs over stdio inside Claude Code, Codex, Cursor and Antigravity. No proxy, no API key wiring, no browser round-trip.",
  },
  {
    icon: GitPullRequestArrow,
    title: "Unified diffs, ready to apply",
    body: "Output is a clean git-compatible patch you can review in the terminal or drop straight into a branch.",
  },
  {
    icon: Bug,
    title: "Built for real failures",
    body: "Build errors, test failures, hydration mismatches, OOM kills, panics — triaged from the same telemetry the CLI already understands.",
  },
];

const steps = [
  {
    n: "01",
    title: "The agent hits a failure",
    body: "A build, test suite or command exits non-zero. The failure output — stderr, stack trace, exit code — stays local.",
  },
  {
    n: "02",
    title: "The agent calls triage_failure",
    body: "RunFix receives the scrubbed output over MCP and analyses it: root cause, failure category, affected files.",
  },
  {
    n: "03",
    title: "RunFix verifies the patch",
    body: "A candidate fix is synthesised as a unified diff and validated with git apply --check against your working tree.",
  },
  {
    n: "04",
    title: "The agent returns the verified fix",
    body: "Root cause plus an applicable patch reach the agent's context. Nothing is written to your working tree without the agent deciding to.",
  },
];

const terminalLines: { prompt?: string; text: string; tone?: "ok" | "muted" }[] = [
  { prompt: "agent", text: "npm test → 1 failed (TypeError: Cannot read properties of undefined)" },
  { prompt: "agent", text: 'triage_failure({ command: "npm test", exitCode: 1, output: "…" })' },
  { text: "runfix: root cause — user.account is undefined in notify.ts:42", tone: "muted" },
  { text: "runfix: patch verified with git apply --check (1 file, +6 −2)", tone: "ok" },
  { prompt: "agent", text: "returns root cause + diff to context ✓" },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              MCP server for coding agents
            </p>
            <h1 className="mt-4 font-mono text-4xl font-bold leading-[1.1] tracking-tight text-[var(--text)] sm:text-5xl">
              Your agent finds the root cause. RunFix verifies the patch.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
              When a build, test or command fails, your agent calls RunFix&apos;s{" "}
              <code className="font-mono text-[var(--text)]">triage_failure</code> tool and gets the real
              cause plus a patch checked with{" "}
              <code className="font-mono text-[var(--text)]">git apply --check</code> — before it ever
              reaches your working tree.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#install"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 font-mono text-sm font-semibold text-[#0B0F14] transition-colors duration-150 hover:bg-[#6ee79b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Add RunFix to your agent
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border)] px-6 py-3 font-mono text-sm font-semibold text-[var(--text)] transition-colors duration-150 hover:border-[rgba(74,222,128,0.4)] hover:bg-[var(--surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Try the web demo
              </Link>
            </div>
            <ul className="mt-8 space-y-2.5">
              {[
                "triage_failure: root cause in one tool call",
                "Every patch pre-verified with git apply --check",
                "Works inside Claude Code, Codex, Cursor and Antigravity",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--muted)]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Focal terminal visual */}
          <div className="glow-emerald min-w-0 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2a3646]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2a3646]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2a3646]" aria-hidden="true" />
              <span className="ml-2 font-mono text-xs text-[var(--muted)]">agent ↔ runfix (stdio)</span>
            </div>
            <div className="space-y-3 p-5 font-mono text-[13px] leading-relaxed">
              {terminalLines.map((line, i) => (
                <div key={i} className="flex gap-2">
                  {line.prompt ? (
                    <span className={line.prompt === "agent" ? "text-[#6ee79b]" : "text-[var(--accent)]"}>
                      {line.prompt}→
                    </span>
                  ) : (
                    <span className="text-[var(--muted)]">│</span>
                  )}
                  <span
                    className={
                      line.tone === "ok"
                        ? "break-words text-[var(--accent)]"
                        : line.tone === "muted"
                          ? "break-words text-[var(--muted)]"
                          : "break-words text-[var(--text)]"
                    }
                  >
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-[var(--border)] bg-[var(--surface)]/40 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">How it works</p>
          <h2 className="mt-3 max-w-2xl font-mono text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
            The agent-to-RunFix handshake
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="glass-card p-6">
                <span className="font-mono text-sm font-semibold text-[var(--accent)]">{s.n}</span>
                <h3 className="mt-3 font-mono text-base font-semibold leading-snug text-[var(--text)]">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-[var(--muted)]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Install */}
      <section id="install" className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Install</p>
          <h2 className="mt-3 max-w-2xl font-mono text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
            One command per agent
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--muted)] leading-7">
            RunFix speaks plain MCP over stdio. Add it once and the{" "}
            <code className="font-mono text-[var(--text)]">triage_failure</code> tool shows up in your
            agent&apos;s tool list. Full options live in the{" "}
            <Link href="/docs" className="text-[var(--accent)] hover:underline">
              docs
            </Link>
            .
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {agents.map((a) => (
              <div key={a.name} className="glass-card min-w-0 overflow-hidden p-6">
                <div className="flex items-center gap-2.5">
                  <Terminal className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                  <h3 className="font-mono text-base font-semibold text-[var(--text)]">{a.name}</h3>
                </div>
                <CopySnippet code={a.code} filename={`${a.name.toLowerCase().replace(/\s+/g, "-")}.setup`} />
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{a.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="product" className="border-t border-[var(--border)] bg-[var(--surface)]/40 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Product</p>
          <h2 className="mt-3 max-w-2xl font-mono text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
            Quiet, precise, verified
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="glass-card p-6">
                <f.icon className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                <h3 className="mt-4 font-mono text-base font-semibold text-[var(--text)]">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-[var(--muted)]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo (minor section) */}
      <section id="demo" className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="glass-card grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Web demo</p>
              <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                No agent? Paste an error in the browser.
              </h2>
              <p className="mt-4 max-w-2xl text-[var(--muted)] leading-7">
                The original RunFix workbench is still live: paste a stack trace, get the scrubbed
                analysis and a unified diff in the browser. It is a taste of what your agent gets
                automatically — the real product is the MCP server above.
              </p>
            </div>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[rgba(74,222,128,0.4)] px-6 py-3 font-mono text-sm font-semibold text-[var(--accent)] transition-colors duration-150 hover:bg-[rgba(74,222,128,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Open the workbench
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* About strip */}
      <section id="about" className="border-t border-[var(--border)] bg-[var(--surface)]/40 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[rgba(74,222,128,0.12)] text-[var(--accent)]">
              <Wrench className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="max-w-3xl">
              <h2 className="font-mono text-3xl font-bold tracking-tight text-[var(--text)]">
                About RunFix
              </h2>
              <p className="mt-4 leading-7 text-[var(--muted)]">
                RunFix is built by RunFix on the idea that agents should not guess at failures.
                It started as a browser workbench that turned stack traces into verified git patches,
                and is now an MCP server that plugs the same engine directly into the tools where the
                failures happen. Everything that leaves your machine is scrubbed first, and nothing is
                returned unless it applies cleanly.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <Link href="/about" className="text-[var(--accent)] hover:underline">
                  More about the project →
                </Link>
                <Link href="/security" className="text-[var(--muted)] transition-colors hover:text-[var(--text)]">
                  Security model
                </Link>
                <a
                  href="https://github.com/Ahmad-glowex/tracelens-ai"
                  className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                  Source on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
