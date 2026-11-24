# RunFix Site Redesign (redesign/site-v2)

## Goal and users
Present RunFix as what it is now: an MCP server that lives inside coding agents (Claude Code, Codex, Cursor, Antigravity). When a build/test/command fails, the agent calls `triage_failure` and gets the root cause plus a patch verified with `git apply --check`. Audience: developer-tool buyers and agent users. "Working" = a professional, responsive site with real navigation at 390px and 1440px.

## Design brief (direction: Dark Instrument — terminal-atelier)
- Who: developers evaluating an MCP server for their coding agent.
- Job of each screen: explain the agent-to-RunFix handshake and get it installed.
- Mood: dark, precise, instrument-like.
- Direction: dark editorial stage; one focal terminal visual (`triage_failure` call) does the memorable work; the rest stays quiet and strict-grid.
- Memorable: the terminal handshake rendered as a monospace exchange.

## Design tokens
- Colors: --bg #0B0F14, --surface #0F1620, --text #E6EDF3, --muted #8B98A5, --accent #4ADE80, --border #1E2A38. Neutrals calm, accent used sparingly.
- Type: JetBrains Mono as display face (headings, terminal), Inter/Plus Jakarta as text face; 5-step scale with clamp().
- Spacing: 4/8px scale; two radii (6px, 10px); two shadow levels.
- Motion: 150–300ms, transform/opacity only, reduced-motion fallback.

## Scope
In scope: new home page (hero, how it works, install per agent, features, minor demo section, about strip), shared nav (desktop + working mobile hamburger) and footer in the layout, old workbench moved to /demo, consistent tokens.
Out of scope for now: pricing, auth, blog, docs content overhaul (existing /docs stays), API changes.

## Architecture
- Next.js 14 App Router + TypeScript + Tailwind (unchanged stack).
- `components/SiteNav.tsx` (client component: hamburger state, closes on link click/escape), `components/Footer.tsx` (server) rendered from `app/layout.tsx` so every route gets navigation.
- Old workbench page moved verbatim to `app/demo/page.tsx` (imports adjusted) so the /api/analyze functionality stays intact. Home links to it from the minor "Try it in the browser" section.
- Data model/auth: none (public marketing site); the only API is the existing `/api/analyze` route, untouched.

## Routes
- `/` new MCP home; `/demo` full workbench (moved); `/about`, `/docs`, `/privacy`, `/security`, `/terms`, `/api/analyze` unchanged; footer links only to these.

## Risks and assumptions
- The 1,800-line workbench is moved, not rewritten; risk of import-path breakage — verified by build.
- Assumed: keep existing metadata/SEO in layout; only visual chrome changes.

## Phase 1: Full redesign (all requested pages in this run)
Goal: complete MCP product site with working navigation.
- [ ] Tokens in globals.css/tailwind (Dark Instrument palette, mono display type)
- [ ] SiteNav (desktop + hamburger) and Footer in root layout
- [ ] New home: hero + terminal visual, how it works, install per agent, features, demo teaser, about strip, footer
- [ ] Old workbench moved intact to /demo
- [ ] npm run build passes; browser checks at 390px and 1440px incl. open mobile menu

Acceptance: site reads as the MCP product at both widths, menu opens/closes, workbench still works at /demo, build green.
