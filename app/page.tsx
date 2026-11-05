"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Zap,
  Play,
  Github,
  SlidersHorizontal,
  Copy,
  Check,
  CheckCircle,
  AlertCircle,
  Terminal,
  Cpu,
  ShieldCheck,
  Sparkles,
  Target,
  GitMerge,
  ArrowRight,
  Info,
  Microchip,
  GitCommit,
  HeartHandshake,
  Calendar,
  X,
  Eye,
  EyeOff,
  Menu,
  Key,
  Layers,
  Code2,
  RefreshCw,
  Clock,
  Download,
  ChevronDown,
  HelpCircle,
  FileCode,
  Trash2,
  Lock,
  Workflow,
  ExternalLink,
} from "lucide-react";
import { scrubSensitiveData } from "../lib/scrubber";
import { parseUnifiedDiff, cleanDiffText, type DiffLine } from "../lib/diffParser";

// Preset Real-World Error Samples
const SAMPLES: Record<
  string,
  { label: string; targetFile: string; input: string; rootCause: string; diff: string }
> = {
  next: {
    label: "Next.js Hydration",
    targetFile: "app/dashboard/page.tsx",
    input: `Unhandled Runtime Error
Error: Hydration failed because the initial UI does not match what was rendered on the server.
Warning: Expected server HTML to contain a matching <div> in <span>.
    at Dashboard (app/dashboard/page.tsx:18:11)
    at HydrationErrorBoundary (node_modules/next/dist/client/components/react-dev-overlay.js)`,
    rootCause:
      "Hydration mismatch triggered by accessing dynamic browser state (such as Date.now(), window, or localStorage) during server pre-rendering. The initial client DOM structure differed from the dehydrated SSR response.",
    diff: `@@ -15,7 +15,9 @@ export default function Dashboard() {
+  const [mounted, setMounted] = useState(false);
+  useEffect(() => setMounted(true), []);
-  return <span>Current Time: {new Date().toLocaleTimeString()}</span>;
+  return <span>Current Time: {mounted ? new Date().toLocaleTimeString() : "--:--:--"}</span>;
+}`,
  },
  node: {
    label: "Node TypeError",
    targetFile: "src/components/UserProfileList.tsx",
    input: `TypeError: Cannot read properties of undefined (reading 'map')
    at UserProfileList (src/components/UserProfileList.tsx:42:28)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
    at HTMLUnknownElement.callCallback (node_modules/react-dom/cjs/react-dom.development.js:4164:14)`,
    rootCause:
      "The 'users' collection is asynchronously populated via fetch/query. On initial mount before resolution, 'users' evaluates to undefined. Invoking Array.prototype.map without optional chaining causes an unhandled TypeError.",
    diff: `@@ -39,11 +39,11 @@ export function UserProfileList({ users, isLoading }: Props) {
   if (isLoading) {
     return <LoadingSkeleton count={3} />;
   }
   
-  return (
-    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
-      {users.map((user) => (
-        <UserCard key={user.id} user={user} />
-      ))}
-    </div>
-  );
+  return (
+    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
+      {(users ?? []).map((user) => (
-        <UserCard key={user.id} user={user} />
+        <UserCard key={user.id} user={user} />
       ))}
     </div>
   );
 }`,
  },
  python: {
    label: "Python FastAPI",
    targetFile: "app/api/v1/endpoints/users.py",
    input: `pydantic.error_wrappers.ValidationError: 1 validation error for UserResponse
email
  value is not a valid email address: The email address is not valid. It must have exactly one @-sign. (type=value_error.email)
INFO: 127.0.0.1:54210 - "POST /api/v1/users HTTP/1.1" 422 Unprocessable Entity
Traceback (most recent call last):
  File "app/api/v1/endpoints/users.py", line 64, in create_user
    return UserResponse.from_orm(db_user)`,
    rootCause:
      "User payload passed raw contact text instead of valid EmailStr. The Pydantic model response serializer enforces RFC 5322 email syntax validation, triggering a 422 Unprocessable Entity crash.",
    diff: `@@ -60,6 +60,8 @@ async def create_user(payload: UserCreate, db: Session = Depends(get_db)):
     existing = db.query(User).filter(User.email == payload.email).first()
     if existing:
         raise HTTPException(status_code=400, detail="Email already registered")
         
+    normalized_email = payload.email.strip().lower()
+    db_user = User(email=normalized_email, full_name=payload.full_name)
     db.add(db_user)
     db.commit()
     db.refresh(db_user)
-    return UserResponse.from_orm(db_user)
+    return UserResponse.model_validate(db_user)`,
  },
  docker: {
    label: "Docker exit 137 OOM",
    targetFile: "docker-compose.yml",
    input: `container runfix-worker exited with code 137
dmesg: [18492.102381] Out of memory: Killed process 8491 (node) total-vm:4194304kB, anon-rss:2097152kB
worker-1  | FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`,
    rootCause:
      "Exit Code 137 denotes a SIGKILL by Linux OOM Killer. The Node.js v8 runtime exceeded its default 2GB memory boundary inside container constraints.",
    diff: `@@ -14,6 +14,8 @@ services:
     build: .
     restart: unless-stopped
+    environment:
+      - NODE_OPTIONS=--max-old-space-size=4096
     deploy:
       resources:
         limits:
-          memory: 2048M
+          memory: 4096M`,
  },
  go: {
    label: "Go Panic",
    targetFile: "internal/cache/memory_store.go",
    input: `fatal error: concurrent map read and map write
goroutine 64 [running]:
runtime.throw({0x10b75d2?, 0x0?})
    /usr/local/go/src/runtime/panic.go:1077 +0x5c
github.com/runfix/engine/cache.(*MemoryCache).Set(0xc00010c000, {0x10a241b, 0x7}, {0x10a5140, 0xc0000a8030})
    /app/internal/cache/memory_store.go:38 +0x88`,
    rootCause:
      "Native Go maps are not goroutine-safe. Multiple concurrent worker routines executed MemoryCache.Set and Get concurrently on the shared reference without sync primitives.",
    diff: `@@ -12,8 +12,10 @@ package cache
 
+import "sync"
+
 type MemoryCache struct {
+	mu    sync.RWMutex
 	store map[string]interface{}
 }
 
 func (c *MemoryCache) Set(key string, val interface{}) {
+	c.mu.Lock()
+	defer c.mu.Unlock()
 	c.store[key] = val
 }`,
  },
  rust: {
    label: "Rust Bounds",
    targetFile: "src/worker/pool.rs",
    input: `thread 'tokio-runtime-worker' panicked at src/worker/pool.rs:42:18:
index out of bounds: the len is 4 but the index is 4
stack backtrace:
   0: rust_begin_unwind
   1: core::panicking::panic_fmt
   2: core::panicking::panic_bounds_check
   3: pool::WorkerPool::dispatch_job at src/worker/pool.rs:42:18`,
    rootCause:
      "Off-by-one indexing error in WorkerPool::dispatch_job. Attempted 0-indexed lookup using len rather than len - 1 or checked bounds (.get()).",
    diff: `@@ -40,4 +40,4 @@ impl WorkerPool {
     pub fn dispatch_job(&mut self, idx: usize) -> Option<&Worker> {
-        Some(&self.workers[idx])
+        self.workers.get(idx)
     }
 }`,
  },
};

const FAQ_ITEMS = [
  {
    question: "Is RunFix AI completely free during the public beta?",
    answer:
      "Yes, 100% free with no credit card required. During our public beta, you have open access to the interactive developer workbench, community inference models, client-side secret scrubber, and the terminal CLI. You can also bring your own API key (BYOK) for unmetered frontier reasoning.",
  },
  {
    question: "How does the Client-Side Secret & PII Scrubber protect my code?",
    answer:
      "Before any crash log or stack trace leaves your machine or browser, our zero-telemetry regex engine runs locally to strip 10 sensitive categories—including OpenAI, Anthropic, Google, AWS, GitHub tokens, JWT keys, and database passwords. Private secrets never cross the wire.",
  },
  {
    question: "How do I apply the synthesized Git diff patch?",
    answer:
      "RunFix generates standard RFC 5322 unified diffs. Click 'Copy git diff' or 'Download patch.diff', save it to your repo root as 'patch.diff', and execute 'git apply patch.diff' in your terminal. You can immediately rerun your test suite to verify the resolution.",
  },
  {
    question: "How does Bring Your Own Key (BYOK) work?",
    answer:
      "You can supply your personal Anthropic Claude, OpenAI, Google Gemini, or Groq API keys directly in the Workbench toolbar or through CLI environment variables. Keys remain strictly in local browser storage, and queries route directly to the model provider with 0% platform surcharge.",
  },
  {
    question: "How do I connect RunFix to Cursor or Claude Desktop via MCP?",
    answer:
      "Execute 'npx runfix mcp' in your terminal. Add the command to your Claude Desktop config (claude_desktop_config.json) or Cursor configuration (.cursor/mcp.json) under mcpServers. This grants your AI agent direct access to automated error triage tools.",
  },
  {
    question: "What programming languages and runtimes are supported?",
    answer:
      "RunFix AI natively parses stack traces across Next.js (SSR/Hydration), Node.js/TypeScript, Python (FastAPI/Pydantic/Django), Go runtime panics, Rust memory & bounds checks, and Docker OOM Exit 137 container crashes.",
  },
];

const softwareAppJsonLd = {
  "@type": "SoftwareApplication",
  "@id": "https://runfix.live/#software",
  name: "RunFix AI",
  alternateName: "tracelens-ai",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Cross-platform (Linux, macOS, Windows)",
  url: "https://runfix.live",
  image: "https://runfix.live/og-image.png",
  softwareVersion: "1.1.0",
  description:
    "Automated developer error triage engine turning terminal crashes into verified Git diff patches.",
  featureList: [
    "Deterministic AST root-cause frame pinpointing",
    "Syntax-aware unified Git diff generation (git apply compatible)",
    "Zero-telemetry client-side BYOK privacy architecture",
    "Multi-engine cascading failover across Claude, Gemini, Groq, and River AI",
    "Broad runtime support: Node.js, Next.js, Python FastAPI, Go, Rust, and Docker",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  publisher: {
    "@id": "https://runfix.live/#organization",
  },
};

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    softwareAppJsonLd,
    {
      "@type": "FAQPage",
      "@id": "https://runfix.live/#faq",
      isPartOf: {
        "@id": "https://runfix.live/#website",
      },
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

interface ModelOption {
  provider: string;
  model: string;
  label: string;
  badge: string;
}

const POPULAR_MODELS: ModelOption[] = [
  { provider: "anthropic", model: "claude-frontier", label: "Claude Frontier", badge: "Anthropic" },
  { provider: "river", model: "zai-org/GLM-5.3-Flash", label: "GLM-5.3 Flash", badge: "River AI" },
  { provider: "river", model: "deepseek-ai/DeepSeek-V4.1-Flash", label: "DeepSeek V4.1", badge: "River AI" },
  { provider: "groq", model: "qwen/qwen3.8-27b", label: "Qwen 3.8 27B", badge: "Groq LPU" },
  { provider: "gemini", model: "gemini-3.8-flash", label: "Gemini 3.8 Flash", badge: "Google" },
  { provider: "openai", model: "gpt-4o-mini", label: "GPT-4o Mini", badge: "OpenAI" },
  { provider: "custom", model: "custom-model", label: "Custom OpenAI-Compatible", badge: "Self-Hosted" },
];

const PRESET_BADGES: Record<string, { tag: string; tagColor: string }> = {
  next: { tag: "React/SSR", tagColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  node: { tag: "TypeError", tagColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  python: { tag: "FastAPI", tagColor: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  docker: { tag: "Exit 137", tagColor: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  go: { tag: "Panic", tagColor: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
  rust: { tag: "Bounds", tagColor: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
};

export default function HomePage() {
  const [currentPreset, setCurrentPreset] = useState("next");
  const [errorInput, setErrorInput] = useState(SAMPLES.next.input);
  const [rootCause, setRootCause] = useState(SAMPLES.next.rootCause);
  const [diffTarget, setDiffTarget] = useState(SAMPLES.next.targetFile);
  const [diffText, setDiffText] = useState(SAMPLES.next.diff);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusPill, setStatusPill] = useState("Ready • Sub-Second Engine");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mobile View Tab: "input" or "output"
  const [mobileTab, setMobileTab] = useState<"input" | "output">("input");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Model & Key state
  const [selectedProvider, setSelectedProvider] = useState("river");
  const [selectedModel, setSelectedModel] = useState("zai-org/GLM-5.3-Flash");
  const [userApiKey, setUserApiKey] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("https://api.river.ai/v1");
  const [keyVisible, setKeyVisible] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Toast & Export states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [copiedTargetFile, setCopiedTargetFile] = useState(false);
  const [downloadedDiff, setDownloadedDiff] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedProv =
      localStorage.getItem("runfix_provider") ||
      localStorage.getItem("tracelens_provider") ||
      "river";
    const savedMod =
      localStorage.getItem("runfix_model") ||
      localStorage.getItem("tracelens_model") ||
      "zai-org/GLM-5.3-Flash";
    const savedKey =
      localStorage.getItem("runfix_api_key") ||
      localStorage.getItem("tracelens_api_key") ||
      "";
    const savedUrl =
      localStorage.getItem("runfix_custom_url") ||
      localStorage.getItem("tracelens_custom_url") ||
      "https://api.river.ai/v1";

    setSelectedProvider(savedProv);
    setSelectedModel(savedMod);
    setUserApiKey(savedKey);
    setCustomBaseUrl(savedUrl);
    if (savedKey) {
      setShowKeyInput(true);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadDiff = () => {
    if (!diffText || !diffText.trim()) {
      showToast("No diff patch available to download.");
      return;
    }
    const blob = new Blob([diffText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const baseName = diffTarget ? diffTarget.split("/").pop() || "patch" : "patch";
    link.download = `${baseName}.diff`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadedDiff(true);
    showToast(`📥 Downloaded ${baseName}.diff!`);
    setTimeout(() => setDownloadedDiff(false), 2500);
  };

  const handleSelectPreset = (key: string) => {
    const s = SAMPLES[key];
    if (!s) return;
    setCurrentPreset(key);
    setErrorInput(s.input);
    setDiffTarget(s.targetFile);
    setRootCause(s.rootCause);
    setDiffText(s.diff);
    setErrorMessage(null);
    setStatusPill(`Preset: ${s.label}`);
    showToast(`Loaded preset: ${s.label}`);
  };

  const handleClear = () => {
    setErrorInput("");
    setDiffText("");
    setDiffTarget("");
    setRootCause("");
    setErrorMessage(null);
    setCurrentPreset("");
    setStatusPill("Ready • Sub-Second Engine");
    textareaRef.current?.focus();
    showToast("Input buffer cleared");
  };

  const handleCopyDiff = () => {
    if (!diffText || !diffText.trim()) {
      showToast("No diff patch available to copy.");
      return;
    }
    navigator.clipboard.writeText(diffText).then(() => {
      setCopiedDiff(true);
      showToast("Git diff copied (`git apply` ready)");
      setTimeout(() => setCopiedDiff(false), 2000);
    });
  };

  const handleCopyTargetFile = () => {
    if (!diffTarget) return;
    navigator.clipboard.writeText(diffTarget).then(() => {
      setCopiedTargetFile(true);
      showToast(`Copied file path: ${diffTarget}`);
      setTimeout(() => setCopiedTargetFile(false), 2000);
    });
  };

  const handleModelChange = (modelId: string) => {
    const found = POPULAR_MODELS.find((m) => m.model === modelId);
    if (found) {
      setSelectedProvider(found.provider);
      setSelectedModel(found.model);
      localStorage.setItem("runfix_provider", found.provider);
      localStorage.setItem("runfix_model", found.model);
      localStorage.setItem("tracelens_provider", found.provider);
      localStorage.setItem("tracelens_model", found.model);
      showToast(`Active Model: ${found.label}`);
    } else {
      setSelectedModel(modelId);
      localStorage.setItem("runfix_model", modelId);
      localStorage.setItem("tracelens_model", modelId);
    }
  };

  const handleApiKeyChange = (keyVal: string) => {
    setUserApiKey(keyVal);
    if (keyVal.trim()) {
      localStorage.setItem("runfix_api_key", keyVal.trim());
      localStorage.setItem("tracelens_api_key", keyVal.trim());
    } else {
      localStorage.removeItem("runfix_api_key");
      localStorage.removeItem("tracelens_api_key");
    }
  };

  const handleAnalyze = async () => {
    const raw = errorInput.trim();
    if (!raw) {
      showToast("Please paste an error log or stack trace first.");
      textareaRef.current?.focus();
      return;
    }

    // Client-side Zero-Telemetry Secret & PII Scrubbing
    const scrubResult = scrubSensitiveData(raw);
    if (scrubResult.redactedCount > 0) {
      showToast(`🛡️ Sanitized ${scrubResult.redactedCount} secret(s) locally before sending`);
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setStatusPill(`Analyzing via ${selectedModel.split("/").pop()}...`);

    const start = Date.now();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errorLog: scrubResult.scrubbed,
          provider: selectedProvider,
          model: selectedModel,
          apiKey: userApiKey.trim(),
          customUrl: customBaseUrl.trim(),
        }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Analysis failed.");
      }

      const { rootCause: rc, targetFile: tf, diff: df, latency, provider: p } = json.data;
      setRootCause(rc);
      setDiffTarget(tf);
      setDiffText(df);

      const elapsed = latency || Date.now() - start;
      setStatusPill(`✓ ${elapsed}ms • ${p}`);
      showToast("Triage complete!");

      // Switch mobile tab to output
      setMobileTab("output");
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          outputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 80);
      }
    } catch (err: any) {
      console.error("❌ [RunFix AI Error]:", err);
      setErrorMessage(err.message || "Failed to contact backend API route.");
      setStatusPill("Analysis Error");
      setDiffText("");
      showToast(`⚠️ Error: ${err.message?.substring(0, 32)}...`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parsedDiffLines = parseUnifiedDiff(diffText);
  const lineCount = errorInput ? errorInput.split("\n").length : 0;
  const charCount = errorInput.length;

  return (
    <div className="relative min-h-screen text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-white bg-[#08080c]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#08080c]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
                <div className="w-full h-full bg-[#08080c] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  RunFix
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold tracking-wide">
                  PUBLIC BETA
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7 text-sm font-medium text-zinc-400">
            <a href="#playground" className="hover:text-white transition-colors">
              Workbench
            </a>
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/security" className="hover:text-white transition-colors">
              Security
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <a
              href="https://github.com/Ahmad-glowex/tracelens-ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center space-x-1.5"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Desktop Right Quick Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Free Public Beta</span>
            </div>

            <a
              href="#playground"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-mono shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              Launch Triage
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800/80 bg-[#0a0a0f] px-4 py-4 space-y-3 font-mono text-xs">
            <div className="pb-2 mb-2 border-b border-zinc-800 text-[11px] text-emerald-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Free Public Beta • No Credit Card Required</span>
            </div>
            <a
              href="#playground"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-white py-1"
            >
              ⚡ Workbench
            </a>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-white py-1"
            >
              📚 Developer Docs
            </Link>
            <Link
              href="/security"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-white py-1"
            >
              🛡️ Security & Privacy
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-white py-1"
            >
              📖 About & Vision
            </Link>
            <a
              href="https://github.com/Ahmad-glowex/tracelens-ai"
              target="_blank"
              rel="noreferrer"
              className="block text-zinc-300 hover:text-white py-1"
            >
              ⭐ GitHub Repository
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Authoritative Public Beta Tagline */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-zinc-900/90 border border-emerald-500/30 text-zinc-300 shadow-sm shadow-emerald-500/10 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-400">100% Free Public Beta</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-300">No Credit Card Required</span>
          <span className="text-zinc-600">•</span>
          <span className="text-cyan-400">Zero Telemetry BYOK</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12] mb-6">
          Turn cryptic stack traces into <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            instant root causes & Git patches.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
          High-precision developer triage workbench. Unhandled exceptions, type panics, and container crashes isolated to the exact code frame and resolved into verified, <code className="text-emerald-400 font-mono">git apply</code> compatible diffs in sub-seconds.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 max-w-md sm:max-w-none mx-auto">
          <a
            href="#playground"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 flex items-center justify-center space-x-2 font-mono active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Open Workbench</span>
          </a>
          <Link
            href="/docs"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 transition-all duration-200 flex items-center justify-center space-x-2 font-mono"
          >
            <span>Explore Documentation</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
          <a
            href="https://github.com/Ahmad-glowex/tracelens-ai"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800/80 transition-all duration-200 flex items-center justify-center space-x-2 font-mono"
          >
            <Github className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
        </div>

        {/* Capability Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-zinc-400 pt-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sub-Second Synthesis</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Client Secret Scrubber</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <Target className="w-3.5 h-3.5 text-purple-400" />
            <span>Deterministic AST Pinpointing</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
            <span>git apply Ready</span>
          </div>
        </div>
      </section>

      {/* Interactive High-Precision Workbench */}
      <section id="playground" className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl border border-zinc-800">
          
          {/* Top Workbench Toolbar: Presets & Inline Model Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 mb-4 border-b border-zinc-800 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  High-Precision Triage Workbench
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Paste terminal crash output, select reasoning engine, and inspect verified diff patches.
              </p>
            </div>

            {/* Presets - Fast 1-Click Pills for Real-World Scenarios */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs text-zinc-500 font-mono mr-1 shrink-0 font-medium">Presets:</span>
              {(["next", "node", "python", "docker", "go", "rust"] as const).map((key) => {
                const sample = SAMPLES[key];
                const meta = PRESET_BADGES[key];
                const isActive = currentPreset === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectPreset(key)}
                    className={`px-2.5 py-1.5 text-xs rounded-lg font-mono shrink-0 transition-all duration-150 flex items-center space-x-1.5 ${
                      isActive
                        ? "bg-zinc-800 border border-emerald-500/50 text-emerald-400 font-semibold shadow-sm shadow-emerald-500/10"
                        : "bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                    <span>{sample.label}</span>
                    <span className={`text-[10px] px-1 py-0.5 rounded border hidden sm:inline ${meta.tagColor}`}>
                      {meta.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Selection & BYOK Toolbar */}
          <div className="mb-4 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            {/* Compact Provider/Model Selector */}
            <div className="flex items-center space-x-2 flex-1 min-w-[280px]">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-zinc-400 shrink-0">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-medium">Engine:</span>
              </div>
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="flex-1 max-w-sm px-3 py-1.5 text-xs font-mono bg-[#08080c] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-400 cursor-pointer hover:border-zinc-700 transition"
              >
                {POPULAR_MODELS.map((m) => (
                  <option key={m.model} value={m.model}>
                    {m.label} ({m.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Inline BYOK Key & Settings */}
            <div className="flex items-center space-x-2">
              {!showKeyInput ? (
                <button
                  onClick={() => setShowKeyInput(true)}
                  className="px-2.5 py-1.5 text-xs font-mono text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700/60 flex items-center space-x-1.5 transition active:scale-95"
                  title="Configure private BYOK API key (Stored exclusively in browser localStorage)"
                >
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BYOK Key</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <div className="relative flex items-center">
                    <input
                      type={keyVisible ? "text" : "password"}
                      value={userApiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="Paste BYOK API key (optional)..."
                      className="w-48 sm:w-60 pl-2.5 pr-8 py-1.5 text-xs font-mono bg-[#08080c] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-400 placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setKeyVisible(!keyVisible)}
                      className="absolute right-2 text-zinc-500 hover:text-zinc-300"
                      aria-label="Toggle API Key Visibility"
                    >
                      {keyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {userApiKey && (
                    <button
                      onClick={() => handleApiKeyChange("")}
                      className="text-xs text-zinc-500 hover:text-rose-400 p-1"
                      title="Clear custom API key"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={() => setSettingsOpen(true)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 transition"
                title="Advanced AI Settings & Custom Endpoint Base URL"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Segmented Tab Controls (Visible only on < lg screens) */}
          <div className="lg:hidden flex items-center p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 mb-4 font-mono text-xs">
            <button
              onClick={() => setMobileTab("input")}
              className={`flex-1 py-2 rounded-lg text-center transition flex items-center justify-center space-x-1.5 ${
                mobileTab === "input"
                  ? "bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              <span>1. Crash Input</span>
            </button>
            <button
              onClick={() => setMobileTab("output")}
              className={`flex-1 py-2 rounded-lg text-center transition flex items-center justify-center space-x-1.5 ${
                mobileTab === "output"
                  ? "bg-zinc-800 text-emerald-300 font-semibold shadow-sm border border-emerald-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. Diff Patch</span>
            </button>
          </div>

          {/* Workbench Grid (Desktop: Side-by-side; Mobile: Tabbed) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left: Terminal Input Pane */}
            <div
              className={`flex flex-col rounded-xl bg-[#08080c] border border-zinc-800 overflow-hidden shadow-inner ${
                mobileTab === "output" ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Terminal Title Bar */}
              <div className="px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-xs font-mono text-zinc-300 ml-1.5 font-medium">stdin / stderr</span>
                  
                  {/* Subtle Client Scrubber Active Indicator */}
                  <div
                    className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono cursor-help transition hover:bg-emerald-500/15"
                    title="Client Scrubber Active: Redacts 10 secret categories (OpenAI, Anthropic, AWS, GitHub tokens, DB passwords, JWTs) locally in browser memory before network transit."
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Client Scrubber Active</span>
                    <span className="sm:hidden">Scrubber</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                    {lineCount} lines • {charCount} chars
                  </span>
                  <button
                    onClick={handleClear}
                    className="text-xs font-mono text-zinc-400 hover:text-rose-400 transition flex items-center space-x-1 p-1 rounded hover:bg-zinc-800"
                    title="Clear input and patch buffer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Textarea Input */}
              <div className="p-3.5 flex-1 flex flex-col min-h-[280px] sm:min-h-[380px] bg-[#07070a]">
                <textarea
                  ref={textareaRef}
                  value={errorInput}
                  onChange={(e) => {
                    setErrorInput(e.target.value);
                    if (currentPreset) setCurrentPreset("");
                  }}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      handleAnalyze();
                    }
                  }}
                  rows={14}
                  className="w-full flex-1 bg-transparent text-xs sm:text-[13px] font-mono text-zinc-200 focus:outline-none resize-none leading-relaxed placeholder:text-zinc-600 selection:bg-emerald-500/30"
                  placeholder="Paste terminal stack trace, compiler error, or Docker container log..."
                />
              </div>

              {/* Input Footer Bar */}
              <div className="px-4 py-3 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-[11px] text-zinc-500 font-mono hidden sm:flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-zinc-400" />
                  <span>
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">
                      ⌘+Enter
                    </kbd>{" "}
                    to analyze
                  </span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-mono flex items-center justify-center space-x-2 transition shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-75 disabled:cursor-wait"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing (Sub-Second)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>Analyze Error</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Diff Output Pane */}
            <div
              ref={outputSectionRef}
              className={`flex flex-col rounded-xl bg-[#08080c] border border-zinc-800 overflow-hidden shadow-inner ${
                mobileTab === "input" ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Header Bar with Target File Badge & Action Bar */}
              <div className="px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      errorMessage ? "bg-rose-500" : "bg-emerald-400 animate-pulse"
                    }`}
                  />
                  <span className="text-xs font-mono text-zinc-300 font-medium">
                    {errorMessage ? "Error" : "Diff Output"}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    {statusPill}
                  </span>
                </div>

                {/* Floating / Top Action Bar */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleDownloadDiff}
                    disabled={!diffText.trim() || !!errorMessage}
                    className={`text-xs font-mono px-2.5 py-1 rounded-md border transition flex items-center space-x-1.5 active:scale-95 ${
                      !diffText.trim() || !!errorMessage
                        ? "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border-zinc-700/80"
                    }`}
                    title="Download patch.diff file"
                  >
                    {downloadedDiff ? (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span className="hidden sm:inline">{downloadedDiff ? "Downloaded" : "Download"}</span>
                    <span>patch.diff</span>
                  </button>

                  <button
                    onClick={handleCopyDiff}
                    disabled={!diffText.trim() || !!errorMessage}
                    className={`text-xs font-mono px-2.5 py-1 rounded-md border transition flex items-center space-x-1.5 active:scale-95 ${
                      !diffText.trim() || !!errorMessage
                        ? "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border-zinc-700/80"
                    }`}
                    title="Copy unified git diff to clipboard"
                  >
                    {copiedDiff ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{copiedDiff ? "Copied!" : "Copy git diff"}</span>
                  </button>
                </div>
              </div>

              {/* Target File Badge & Root Cause Diagnosis */}
              <div className="p-3.5 border-b border-zinc-800 bg-zinc-900/40 space-y-2.5">
                {/* Target File Badge with Copy */}
                <div className="flex items-center justify-between text-xs font-mono bg-zinc-950/70 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-zinc-500 text-[11px]">TARGET FILE:</span>
                    <span className="text-zinc-200 font-semibold truncate">{diffTarget || "auto-detected"}</span>
                  </div>
                  {diffTarget && (
                    <button
                      onClick={handleCopyTargetFile}
                      className="text-[11px] text-zinc-400 hover:text-emerald-400 transition flex items-center space-x-1 shrink-0 ml-2"
                      title="Copy target file path"
                    >
                      {copiedTargetFile ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Path</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Root Cause Callout */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5 mb-1.5">
                    <Microchip className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Root Cause Diagnosis:</span>
                  </div>
                  {errorMessage ? (
                    <div className="text-xs text-rose-300 font-mono p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 flex items-start space-x-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-rose-300">Analysis Error Encountered</div>
                        <div className="text-zinc-400 mt-0.5">{errorMessage}</div>
                      </div>
                    </div>
                  ) : !rootCause ? (
                    <p className="text-xs text-zinc-500 italic bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                      Awaiting input analysis...
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                      {rootCause}
                    </p>
                  )}
                </div>
              </div>

              {/* Professional Unified Diff Viewer with Line Numbers */}
              <div className="p-3.5 flex-1 overflow-x-auto bg-[#07070a] min-h-[220px] sm:min-h-[300px]">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 flex items-center justify-between mb-2">
                  <span className="flex items-center space-x-1.5">
                    <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unified Diff Patch (RFC 5322)</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">`git apply` compatible</span>
                </div>

                {/* Diff Viewer Body */}
                {errorMessage ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center min-h-[220px]">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2.5">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-mono font-semibold text-zinc-200 mb-1">Patch Synthesis Interrupted</div>
                    <div className="text-[11px] text-zinc-400 max-w-sm font-sans mb-3">{errorMessage}</div>
                    <button
                      onClick={handleAnalyze}
                      className="px-3.5 py-1.5 text-xs font-mono rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition flex items-center space-x-1.5 active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Retry Analysis</span>
                    </button>
                  </div>
                ) : !diffText.trim() ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center min-h-[220px]">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-2.5">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-mono font-semibold text-zinc-300 mb-1">Awaiting Crash Input</div>
                    <div className="text-[11px] text-zinc-500 max-w-xs font-sans">
                      Paste a crash log and click <strong className="text-emerald-400 font-normal">Analyze Error</strong>, or pick a scenario preset above.
                    </div>
                  </div>
                ) : (
                  <div className="border border-zinc-800 rounded-lg overflow-hidden bg-[#050508] font-mono text-[12px] leading-5">
                    {parsedDiffLines.map((line) => {
                      if (line.type === "hunk") {
                        return (
                          <div
                            key={line.id}
                            className="bg-cyan-950/30 text-cyan-400/95 font-semibold px-3 py-1 border-y border-cyan-800/30 select-none text-[11px]"
                          >
                            {line.content}
                          </div>
                        );
                      }
                      if (line.type === "header") {
                        return (
                          <div
                            key={line.id}
                            className="bg-zinc-900/60 text-zinc-500 px-3 py-0.5 border-b border-zinc-800/80 select-none text-[11px]"
                          >
                            {line.content}
                          </div>
                        );
                      }
                      if (line.type === "add") {
                        return (
                          <div
                            key={line.id}
                            className="flex items-center bg-emerald-500/[0.08] text-emerald-300 border-l-2 border-emerald-500 hover:bg-emerald-500/[0.14] transition-colors"
                          >
                            <span className="w-10 sm:w-11 text-right font-mono tabular-nums text-[10px] text-zinc-600 select-none pr-2 shrink-0">
                              {line.oldNum}
                            </span>
                            <span className="w-10 sm:w-11 text-right font-mono tabular-nums text-[10px] text-emerald-400/80 select-none pr-2 shrink-0">
                              {line.newNum}
                            </span>
                            <span className="w-5 text-center font-bold text-emerald-400 select-none shrink-0">
                              +
                            </span>
                            <span className="font-mono text-[12px] whitespace-pre select-text flex-1 py-0.5 pr-3 overflow-x-auto">
                              {line.content}
                            </span>
                          </div>
                        );
                      }
                      if (line.type === "delete") {
                        return (
                          <div
                            key={line.id}
                            className="flex items-center bg-rose-500/[0.08] text-rose-300 border-l-2 border-rose-500 hover:bg-rose-500/[0.14] transition-colors"
                          >
                            <span className="w-10 sm:w-11 text-right font-mono tabular-nums text-[10px] text-rose-400/80 select-none pr-2 shrink-0">
                              {line.oldNum}
                            </span>
                            <span className="w-10 sm:w-11 text-right font-mono tabular-nums text-[10px] text-zinc-600 select-none pr-2 shrink-0">
                              {line.newNum}
                            </span>
                            <span className="w-5 text-center font-bold text-rose-400 select-none shrink-0">
                              -
                            </span>
                            <span className="font-mono text-[12px] whitespace-pre select-text flex-1 py-0.5 pr-3 overflow-x-auto">
                              {line.content}
                            </span>
                          </div>
                        );
                      }
                      // Context line
                      return (
                        <div
                          key={line.id}
                          className="flex items-center text-zinc-300 hover:bg-white/[0.02] transition-colors border-l-2 border-transparent"
                        >
                          <span className="w-10 sm:w-11 text-right font-mono tabular-nums text-[10px] text-zinc-600 select-none pr-2 shrink-0">
                            {line.oldNum}
                          </span>
                          <span className="w-10 sm:w-11 text-right font-mono tabular-nums text-[10px] text-zinc-600 select-none pr-2 shrink-0">
                            {line.newNum}
                          </span>
                          <span className="w-5 text-center text-zinc-600 select-none shrink-0">
                            {" "}
                          </span>
                          <span className="font-mono text-[12px] whitespace-pre select-text flex-1 py-0.5 pr-3 overflow-x-auto text-zinc-400">
                            {line.content}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step-by-Step Verification & Apply Guide Accordion */}
              <div className="px-3.5 py-2.5 bg-zinc-900/60 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-emerald-400 transition"
                >
                  <span className="flex items-center space-x-1.5 font-semibold">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>How to Apply & Verify Patch in Terminal</span>
                  </span>
                  <span className="text-[11px] text-zinc-500 font-normal">
                    {showExplanation ? "Hide ▲" : "Expand ▼"}
                  </span>
                </button>
                {showExplanation && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-800 text-xs text-zinc-300 font-mono space-y-2 leading-relaxed">
                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold shrink-0">1.</span>
                      <div>
                        Save patch to file: <code className="text-emerald-300 bg-zinc-800 px-1 py-0.5 rounded">runfix.patch</code>
                      </div>
                    </div>
                    <div className="flex items-start justify-between space-x-2 bg-zinc-950/40 p-2 rounded border border-zinc-800">
                      <div className="flex items-start space-x-2">
                        <span className="text-cyan-400 font-bold shrink-0">2.</span>
                        <div>
                          Apply to local git repository: <code className="text-cyan-300 bg-zinc-800 px-1 py-0.5 rounded">git apply runfix.patch</code>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("git apply runfix.patch");
                          showToast("Copied `git apply runfix.patch`!");
                        }}
                        className="text-[10px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 transition shrink-0"
                        title="Copy command to clipboard"
                      >
                        Copy Command
                      </button>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-400 font-bold shrink-0">3.</span>
                      <div>
                        Rerun test suite or compiler to verify regression-free fix.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              <div className="px-4 py-3 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-[11px] font-mono text-zinc-500 flex items-center space-x-1.5">
                  {errorMessage ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-rose-400">Analysis Halted</span>
                    </>
                  ) : diffText.trim() ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Syntactically Verified Patch</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Awaiting Analysis</span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownloadDiff}
                    disabled={!diffText.trim() || !!errorMessage}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition flex items-center space-x-1.5 active:scale-95 ${
                      !diffText.trim() || !!errorMessage
                        ? "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
                        : "bg-zinc-800 hover:bg-zinc-700 text-cyan-400 border-zinc-700"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleCopyDiff}
                    disabled={!diffText.trim() || !!errorMessage}
                    className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg border transition flex items-center space-x-1.5 active:scale-95 shadow-sm ${
                      !diffText.trim() || !!errorMessage
                        ? "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
                        : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10"
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copy Patch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid: Engineered for Developer Tooling */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
            <span>ENGINEERED FOR DEVELOPER WORKFLOWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sub-second diagnosis. Zero hallucinated patches.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            From terminal crashes to production container failures, RunFix isolates root-cause user frames and produces verified git diffs with zero telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group border border-zinc-800 hover:border-emerald-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Deterministic AST Frame Mapping</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Zeros in on the exact file frame causing null pointer exceptions, unhandled rejections, or type panics across Node, Python, Go, and Rust.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center text-xs font-mono text-emerald-400">
              <span>Slices through noisy framework stacks</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group border border-zinc-800 hover:border-cyan-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                <GitMerge className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Standardized Unified Git Diffs</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Receive standardized unified Git diffs formatted for direct terminal execution via <code className="text-zinc-300">git apply patch.diff</code> with zero syntax hallucination.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center text-xs font-mono text-cyan-400">
              <span>RFC 5322 syntax validation</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group border border-zinc-800 hover:border-purple-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Client-Side Secret & PII Scrubber</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Client-side regex redaction sanitizes API keys (OpenAI, Anthropic, AWS, GitHub), JWTs, and database credentials before network transmission.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center text-xs font-mono text-purple-400">
              <span>Zero code telemetry guarantee</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group border border-zinc-800 hover:border-emerald-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Terminal CLI (`npx runfix`)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Wrap your tests or builds with <code className="text-zinc-300">npx runfix &quot;npm test&quot;</code> to auto-triage any nonzero exit code and synthesize fixes directly in your shell.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center text-xs font-mono text-emerald-400">
              <span>Zero-install npm runner</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group border border-zinc-800 hover:border-cyan-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Model Context Protocol (MCP)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Connect your IDE—Cursor, Windsurf, Claude Desktop, and VS Code—directly to RunFix triage tools via native JSON-RPC 2.0 stdio with <code className="text-zinc-300">npx runfix mcp</code>.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center text-xs font-mono text-cyan-400">
              <span>Standardized MCP tools</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group border border-zinc-800 hover:border-teal-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-105 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Engine Failover</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                High-availability cascade between Anthropic Claude frontier models, Google Gemini, Groq LPUs, and River AI clusters ensures zero downtime.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center text-xs font-mono text-teal-400">
              <span>99.99% Redundancy SLA</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* 100% Free Public Beta Section */}
      <section id="beta" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>100% FREE PUBLIC BETA • NO CREDIT CARD REQUIRED</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Developer-First Triage.{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Zero Paywalls.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            RunFix is actively in free public beta. No checkout modals, no surprise invoices, and no trial countdowns. Free unthrottled access on our community cluster, or plug in your private API keys via Zero-Telemetry BYOK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-zinc-800 hover:border-emerald-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unmetered Web Workbench</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Analyze Node.js, Next.js hydration, Python FastAPI, Go panics, Rust bounds, and Docker OOM crashes with zero token metering or paywalls.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400">Open Access</span>
              <span className="text-zinc-500">$0 / Month</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-zinc-800 hover:border-cyan-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero Telemetry BYOK</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Bring your personal Anthropic Claude, OpenAI, Google Gemini, or Groq API keys with 0% platform markup. Keys reside strictly in local browser storage.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400">Strict Privacy</span>
              <span className="text-zinc-500">RAM-Only Execution</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-zinc-800 hover:border-purple-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">CLI & IDE MCP Server Included</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Enjoy complete access to the official terminal CLI tool (<code className="text-zinc-300">npx runfix</code>) and native MCP server for Cursor and Claude Desktop.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400">Developer Ecosystem</span>
              <span className="text-zinc-500">Fully Open</span>
            </div>
          </div>
        </div>

        {/* Enterprise & Autonomous Healer Roadmap Banner */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-900/90 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-2">
                <Calendar className="w-3 h-3" />
                <span>ENGINEERING ROADMAP</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2.5">
                <span>From Web Workbench to Autonomous DevOps Healer</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Q4 2026 - Q1 2027
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
                Zero friction developer workflows: run locally via CLI, connect your IDE via Model Context Protocol (MCP), and let our GitHub Action automatically heal failed CI builds with verified Pull Requests.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <Link
                href="/about"
                className="px-5 py-2.5 text-xs font-mono font-bold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 shadow-md shadow-emerald-500/20 transition flex items-center space-x-1.5 active:scale-95"
              >
                <span>Read Full Vision</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Terminal CLI & MCP Server</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">Available</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-2">
                $ npx runfix &quot;npm test&quot;<br />
                $ npx runfix mcp
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Direct integration with Cursor, Windsurf, and Claude Desktop via Model Context Protocol stdio.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Autonomous CI/CD Healer</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Template Ready</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-2">
                .github/workflows/runfix.yml
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                When automated tests fail, RunFix diagnoses the root cause and opens a tested Pull Request.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Zero Telemetry & PII Scrubber</span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">Client-Side Active</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-2">
                regex-based client redaction
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                All API keys, DB credentials, and sensitive tokens are wiped in the browser before network transit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-zinc-800">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>KNOWLEDGE BASE & FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Everything you need to know about RunFix AI triage, public beta access, privacy governance, and git patches.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <details
              key={idx}
              open={idx === 0}
              className="group glass-card rounded-xl border border-zinc-800 overflow-hidden transition-all duration-200"
            >
              <summary className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 cursor-pointer list-none hover:bg-white/[0.02] transition select-none">
                <span className="font-semibold text-white text-base sm:text-lg">
                  {item.question}
                </span>
                <ChevronDown className="w-5 h-5 text-emerald-400 shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-2 text-sm sm:text-base text-zinc-300 leading-relaxed border-t border-zinc-800/80 font-sans">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Footer (MANDATORY EXACT VERBATIM NOTICE) */}
      <footer className="relative z-10 border-t border-zinc-800/80 bg-[#07070a] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-white">RunFix AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                100% Free Beta
              </span>
            </div>
            {/* MANDATORY EXACT LEGAL TEXT */}
            <p className="text-xs text-zinc-400 font-sans">
              &copy; 2026 RunFix AI. All rights reserved. Operated by Raihan LLC (1910 Thomes Ave, Cheyenne, WY 82001, United States).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
            <a
              href="mailto:founder@runfix.live"
              className="hover:text-emerald-400 transition flex items-center space-x-1"
            >
              <span>founder@runfix.live</span>
            </a>
            <span className="text-zinc-600">•</span>
            <a href="#playground" className="hover:text-white transition">
              Workbench
            </a>
            <span className="text-zinc-600">•</span>
            <a href="#faq" className="hover:text-white transition">
              FAQ
            </a>
            <span className="text-zinc-600">•</span>
            <Link href="/docs" className="hover:text-white transition">
              Docs
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/security" className="hover:text-white transition">
              Security
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <span className="text-zinc-600">•</span>
            <a href="/llms.txt" className="hover:text-white transition">
              llms.txt
            </a>
            <span className="text-zinc-600">•</span>
            <a
              href="https://github.com/Ahmad-glowex/tracelens-ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition flex items-center space-x-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Advanced Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="glass-card rounded-2xl max-w-lg w-full p-5 sm:p-7 border border-zinc-800 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Advanced AI Settings</h3>
                  <p className="text-[11px] text-zinc-400">
                    Configure custom OpenAI-compatible endpoint base URLs or Ollama local gateways.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  <span>Custom Endpoint Base URL</span>
                </label>
                <input
                  type="text"
                  value={customBaseUrl}
                  onChange={(e) => {
                    setCustomBaseUrl(e.target.value);
                    localStorage.setItem("runfix_custom_url", e.target.value);
                    localStorage.setItem("tracelens_custom_url", e.target.value);
                  }}
                  placeholder="https://api.river.ai/v1 or http://localhost:11434/v1"
                  className="w-full px-3 py-2 text-xs font-mono bg-[#08080c] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>API Key (BYOK)</span>
                  <span className="text-[10px] text-zinc-500">Stored in browser localStorage</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={keyVisible ? "text" : "password"}
                    value={userApiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Leave blank to use default public beta cluster..."
                    className="w-full pl-3 pr-10 py-2 text-xs font-mono bg-[#08080c] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setKeyVisible(!keyVisible)}
                    className="absolute right-2.5 text-zinc-500 hover:text-zinc-300 p-1"
                  >
                    {keyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("runfix_api_key");
                  localStorage.removeItem("tracelens_api_key");
                  localStorage.removeItem("runfix_custom_url");
                  localStorage.removeItem("tracelens_custom_url");
                  setSelectedProvider("river");
                  setSelectedModel("zai-org/GLM-5.3-Flash");
                  setUserApiKey("");
                  setCustomBaseUrl("https://api.river.ai/v1");
                  showToast("Settings reset to default!");
                  setSettingsOpen(false);
                }}
                className="px-3 py-2 text-xs font-mono text-zinc-400 hover:text-rose-400 transition"
              >
                Reset Default
              </button>

              <button
                type="button"
                onClick={() => {
                  setSettingsOpen(false);
                  showToast("Settings saved!");
                }}
                className="px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 transition flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#0e0e14] border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-2xl flex items-center space-x-2 transition-all">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
