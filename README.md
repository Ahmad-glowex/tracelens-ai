# ⚡ TraceLens AI

> **Turn raw stack traces into instant fixes & Git diffs in milliseconds.**  
> Full-Stack Next.js 14 (App Router) + TypeScript + Tailwind CSS developer tool with Serverless AI Route Handlers.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAhmad-glowex%2Ftracelens-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Framework: Next.js 14](https://img.shields.io/badge/Framework-Next.js%2014-black.svg)](https://nextjs.org)
[![Engine: Groq LPUs](https://img.shields.io/badge/Engine-Groq%20Llama%203.3-orange.svg)](https://groq.com)
[![Engine: Gemini Flash](https://img.shields.io/badge/Engine-Gemini%20Flash-blue.svg)](https://aistudio.google.com)
[![Design: Linear / Raycast](https://img.shields.io/badge/Design-Silicon%20Valley%20Dark-purple.svg)](#)

---

## 🚀 Overview

Developers spend countless hours parsing cryptic terminal crashes, segmentation faults, unhandled promise rejections, and Docker exit codes.

**TraceLens AI** is an intelligent full-stack developer workbench and triage assistant that:
1. **Serverless AI Route Handlers (`app/api/analyze/route.ts`):** Zero browser CORS issues. Secure, unified backend proxying to AI foundation models.
2. **Isolates Offending Frames:** Slices noisy framework stacks down to the exact root-cause user code line.
3. **Generates Precision Git Diffs:** Outputs syntactically valid unified Git diff patches (`git apply` compatible).
4. **Sub-Second Latency:** Powered by Groq's high-throughput LPU inference (~500+ tok/s) and Google Gemini Flash.
5. **BYOK & Built-in Dual Engine:** Built-in server keys with client-side override support stored in `localStorage`.

---

## 🛠️ Key Features

- **🌐 Serverless AI Architecture:** Clean `POST /api/analyze` route handling multi-provider AI synthesis with automated failover.
- **🎁 100% Free During Public Beta:** Unlimited terminal error analysis with zero paywalls and no credit card required.
- **🎯 Instant Root-Cause Analysis:** Pinpoint the exact runtime reason behind obscure errors (Node.js, TypeScript, Python FastAPI, Go panics, Docker OOM 137).
- **⚡ Interactive Split-Screen Sandbox:** Test stack traces live with preset samples or custom terminal inputs with real-time character/line counters.
- **📋 1-Click Patch Application:** Copy formatted unified diffs ready for `git apply patch.diff` with instant toast notification.
- **✨ Silicon Valley Dark Aesthetic:** Engineered with Raycast / Linear aesthetic (Tailwind CSS, glassmorphism, JetBrains Mono typography, Lucide icons).

---

## 📐 Architecture & Flow

```mermaid
flowchart LR
    A["Client Browser (React 18)"] -->|"POST /api/analyze"| B["Next.js Serverless Route Handler"]
    B --> C{"AI Provider Dispatch"}
    C -->|"Sub-200ms LPU"| D["Groq Llama 3.3 70B"]
    C -->|"Long Context"| E["Gemini Flash"]
    D --> F["JSON Diagnostic Synthesizer"]
    E --> F
    F --> G["Precision Unified Git Diff"]
    G --> A
```

---

## 🚀 Deploy to Vercel (1-Click)

The repository is built strictly for Next.js 14 and can be deployed directly to Vercel with zero configuration:

1. Click the button below or go to [vercel.com/new](https://vercel.com/new):  
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAhmad-glowex%2Ftracelens-ai)
2. Import the `Ahmad-glowex/tracelens-ai` repository.
3. (Optional) Set `GROQ_API_KEY` or `GEMINI_API_KEY` in Environment Variables.
4. Click **Deploy**.

---

## 💻 Local Development

```bash
# Clone repository
git clone https://github.com/Ahmad-glowex/tracelens-ai.git
cd tracelens-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📄 Legal & Operator Notice

© 2026 TraceLens. All rights reserved. Operated by **Raihan LLC** (1910 Thomes Ave, Cheyenne, WY 82001, United States).

- [Terms of Service](/terms)
- [Privacy Policy](/privacy)
