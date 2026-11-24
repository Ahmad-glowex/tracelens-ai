# RunFix Pivot Plan: From Website to Agent-Native Triage

Date: 2026-11-24
Status: Phase 1 implemented on this branch.

## 1. Problem

RunFix today is a website (runfix.live): the developer pastes a stack trace, reads the
root cause, copies a diff back into their editor, and repeats. That workflow loses to
coding agents on every axis:

- **The workflow moved.** Build/test failures are now diagnosed inside Claude Code,
  Codex, Cursor, and Antigravity, which already hold the terminal output, the repo
  contents, and the ability to edit files. Pasting an error into a browser is a
  strictly worse version of what the agent does natively.
- **Context loss.** The website sees only the pasted trace — no repository, no file
  contents, no git state — so its "verified patch" is verified by nothing.
- **Round-trip cost.** Copy error → paste → wait → copy diff → `git apply` → repeat
  per failure. No developer sustains that loop.

The npm package (`runfix`) already shipped a command-wrapping CLI (`npx runfix "npm test"`)
and a minimal MCP server (`npx runfix mcp`), but both are thin proxies to the hosted
`/api/analyze` endpoint: the MCP server exposes only `triage_stacktrace` (raw log in,
diagnostic JSON out), never verifies that the returned diff applies to the caller's
tree, and — critically — never answers the agent at all if the API call throws, which
hangs the tool call.

## 2. Options considered

### (a) MCP server inside the coding agent — **chosen**

The agent already captures the failed command's output and exit code. An MCP tool
`triage_failure` receives exactly what the agent has at the moment of failure
(`command`, `exitCode`, `output`), scrubs secrets locally, returns root cause plus a
unified diff, and — the differentiator — **verifies the patch with `git apply --check`
against the caller's working tree before returning it**, so the agent never burns a
turn on a patch that does not apply. Zero change to developer habit; works in every
MCP client (Claude Code, Codex, Cursor, Antigravity, Windsurf); the website becomes
the marketing/docs surface and the hosted analysis gateway.

Why it wins: it is the only option that inserts RunFix at the exact moment of failure
with full repo context, in the tool the market is consolidating on.

### (b) Command-wrapping CLI

Already exists (`npx runfix "npm test"`). Keep it as a complement (it is how a human
runs something *for* the agent, and how CI pipes logs), but it requires developers to
change how they invoke commands — a habit tax that MCP does not pay. Secondary surface.

### (c) Stronger alternatives (IDE plugin, CI healer, local daemon)

A native IDE plugin duplicates what MCP already delivers with less work. The GitHub
Action CI healer (in `templates/`) is a good Phase 3 extension of the same pipeline,
not a wedge product. A local daemon adds install friction with no additional value
over an MCP stdio server. All deferred.

## 3. Chosen first step (Phase 1)

Agent-native MCP, made genuinely agent-grade. This branch delivers:

- New MCP tool **`triage_failure`** (`command`, `exitCode`, `output`, optional
  `workingDirectory`, `provider`): composes a structured crash log, scrubs secrets
  client-side (reusing the shared scrubber rules), calls the hosted analyzer, and
  verifies the returned diff before responding.
- New shared module **`lib/verify.mjs`**: `verifyPatch(diff, { cwd })` validates the
  diff shape with the existing `lib/diffParser` and runs `git apply --check` in the
  caller's repo; returns `{ parseable, gitCheck, verified, reason }`.
- `triage_stacktrace` responses now include the same `patchVerification` block.
- MCP error handling fixed: a failed API call now returns a JSON-RPC error response
  instead of leaving the agent's tool call hanging.
- CLI: the `--json` output and failure path report verification status too.

## Phase 1: Hardened, verified MCP triage (this PR)
- [x] `lib/verify.mjs` — diff-shape validation + `git apply --check` verification
- [x] `triage_failure` MCP tool accepting command/exitCode/output
- [x] Verification attached to all MCP triage responses
- [x] JSON-RPC error responses on API failure (no more hanging tool calls)
- [x] Tests: mock API server, git-repo patch verification, error-path regression
- [x] Existing web app and CLI untouched and passing

Acceptance: `npx runfix mcp` in Claude Code/Cursor exposes `triage_failure`; a failing
command's output returns root cause + a patch marked `verified: true` when
`git apply --check` passes against the caller's tree; the website still builds and runs.

## Phase 2: Repo-context triage
- [ ] Read the target file around the offending line and include it in the analysis prompt
- [ ] Deterministic offline heuristics (exit 137 OOM, module-not-found, TS errors) when the API is unreachable
- [ ] Ready-made agent configs: `claude_desktop_config.json`, `.cursor/mcp.json`, Codex, Antigravity

Acceptance: triage of a failing test in a repo returns analysis that quotes the real
file contents, and works with the network path down (heuristic mode).

## Phase 3: CI healing on the same pipeline
- [ ] GitHub Action reuses `triage_failure` (log + exit code) and opens a PR with the verified patch
- [ ] Opt-in usage metrics for the hosted gateway

Acceptance: a failing CI run produces an open PR containing a `git apply --check`-verified diff.

## 4. Risks and assumptions

- **Verification honesty:** `git apply --check` proves the patch applies, not that it
  is correct. Copy on the site/docs must say "applies cleanly", not "tested fix".
  (Phase 2 could add running the project's own tests against the patch in a worktree.)
- **Secrets:** scrubbing runs before any network egress, in the caller's process.
  The API key question is unchanged (BYOK / hosted failover).
- **Assumption:** the hosted `/api/analyze` gateway remains the analysis backend; the
  MCP server stays dependency-free (stdlib JSON-RPC over stdio).
