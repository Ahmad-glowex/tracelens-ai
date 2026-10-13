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
  Bot,
  ShieldCheck,
  Server,
  Sparkles,
  Target,
  GitMerge,
  ArrowRight,
  Info,
  Microchip,
  GitCommit,
  GitPullRequest,
  HeartHandshake,
  Calendar,
  X,
  Eye,
  EyeOff,
  Activity,
  ExternalLink,
  Menu,
  Coins,
  Layers,
  Code2,
  RefreshCw,
} from "lucide-react";

// Preset Real-World Error Samples
const SAMPLES: Record<
  string,
  { targetFile: string; input: string; rootCause: string; diff: string }
> = {
  node: {
    targetFile: "src/components/UserProfileList.tsx",
    input: `TypeError: Cannot read properties of undefined (reading 'map')
    at UserProfileList (src/components/UserProfileList.tsx:42:28)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
    at HTMLUnknownElement.callCallback (node_modules/react-dom/cjs/react-dom.development.js:4164:14)`,
    rootCause: `The 'users' collection is asynchronously populated via fetch/query. On initial mount before resolution, 'users' evaluates to undefined. Invoking Array.prototype.map without optional chaining causes an unhandled TypeError.`,
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
+        <UserCard key={user.id} user={user} />
+      ))}
+    </div>
+  );
 }`,
  },
  python: {
    targetFile: "app/api/v1/endpoints/users.py",
    input: `pydantic.error_wrappers.ValidationError: 1 validation error for UserResponse
email
  value is not a valid email address: The email address is not valid. It must have exactly one @-sign. (type=value_error.email)
INFO: 127.0.0.1:54210 - "POST /api/v1/users HTTP/1.1" 422 Unprocessable Entity
Traceback (most recent call last):
  File "app/api/v1/endpoints/users.py", line 64, in create_user
    return UserResponse.from_orm(db_user)`,
    rootCause: `User payload passed raw contact text instead of valid EmailStr. The Pydantic model response serializer enforces RFC 5322 email syntax validation, triggering a 422 Unprocessable Entity crash.`,
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
  go: {
    targetFile: "internal/cache/memory_store.go",
    input: `fatal error: concurrent map read and map write
goroutine 64 [running]:
runtime.throw({0x10b75d2?, 0x0?})
    /usr/local/go/src/runtime/panic.go:1077 +0x5c
github.com/tracelens/engine/cache.(*MemoryCache).Set(0xc00010c000, {0x10a241b, 0x7}, {0x10a5140, 0xc0000a8030})
    /app/internal/cache/memory_store.go:38 +0x88`,
    rootCause: `Native Go maps are not goroutine-safe. Multiple concurrent worker routines executed MemoryCache.Set and Get concurrently on the shared reference without sync primitives.`,
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
    targetFile: "src/worker/pool.rs",
    input: `thread 'tokio-runtime-worker' panicked at src/worker/pool.rs:42:18:
index out of bounds: the len is 4 but the index is 4
stack backtrace:
   0: rust_begin_unwind
   1: core::panicking::panic_fmt
   2: core::panicking::panic_bounds_check
   3: pool::WorkerPool::dispatch_job at src/worker/pool.rs:42:18`,
    rootCause: `Off-by-one indexing error in WorkerPool::dispatch_job. Attempted 0-indexed lookup using len rather than len - 1 or checked bounds (.get()).`,
    diff: `@@ -40,4 +40,4 @@ impl WorkerPool {
     pub fn dispatch_job(&mut self, idx: usize) -> Option<&Worker> {
-        Some(&self.workers[idx])
+        self.workers.get(idx)
     }
 }`,
  },
  docker: {
    targetFile: "docker-compose.yml",
    input: `container tracelens-worker exited with code 137
dmesg: [18492.102381] Out of memory: Killed process 8491 (node) total-vm:4194304kB, anon-rss:2097152kB
worker-1  | FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`,
    rootCause: `Exit Code 137 denotes a SIGKILL by Linux OOM Killer. The Node.js v8 runtime exceeded its default 2GB memory boundary inside container constraints.`,
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
};

const PROVIDERS_META: Record<
  string,
  { name: string; defaultModel: string; models: string[]; keyLink: string; badge?: string }
> = {
  river: {
    name: "River AI (GLM-5.3 Flash)",
    defaultModel: "zai-org/GLM-5.3-Flash",
    models: ["zai-org/GLM-5.3-Flash", "deepseek-ai/DeepSeek-V4.1-Flash"],
    keyLink: "https://river.ai",
    badge: "$25 Credit Active (Primary)",
  },
  groq: {
    name: "Groq LPUs",
    defaultModel: "llama-3.3-70b-versatile",
    models: ["llama-3.3-70b-versatile", "qwen/qwen3.8-27b", "llama-3.1-8b-instant"],
    keyLink: "https://console.groq.com/keys",
    badge: "Instant Fallback",
  },
  gemini: {
    name: "Google Gemini",
    defaultModel: "gemini-2.0-flash",
    models: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-3.8-flash"],
    keyLink: "https://aistudio.google.com/app/apikey",
    badge: "Emergency Fallback",
  },
  openrouter: {
    name: "OpenRouter",
    defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
    models: [
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemini-2.0-flash-exp:free",
      "deepseek/deepseek-r1:free",
    ],
    keyLink: "https://openrouter.ai/keys",
  },
  openai: {
    name: "OpenAI",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o"],
    keyLink: "https://platform.openai.com/api-keys",
  },
  custom: {
    name: "Custom (OpenAI-Compatible)",
    defaultModel: "llama3",
    models: ["llama3", "mistral", "qwen2.5-coder"],
    keyLink: "https://ollama.com",
  },
};

export default function HomePage() {
  const [currentPreset, setCurrentPreset] = useState("node");
  const [errorInput, setErrorInput] = useState(SAMPLES.node.input);
  const [rootCause, setRootCause] = useState(SAMPLES.node.rootCause);
  const [diffTarget, setDiffTarget] = useState(SAMPLES.node.targetFile);
  const [diffText, setDiffText] = useState(SAMPLES.node.diff);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusPill, setStatusPill] = useState("GLM-5.3 Flash • $25 Pool Active");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mobile View Tab: "input" or "output"
  const [mobileTab, setMobileTab] = useState<"input" | "output">("input");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Settings State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("river");
  const [selectedModel, setSelectedModel] = useState("zai-org/GLM-5.3-Flash");
  const [userApiKey, setUserApiKey] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("https://api.river.ai/v1");
  const [keyVisible, setKeyVisible] = useState(false);
  const [testingModel, setTestingModel] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedDiff, setCopiedDiff] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedProv = localStorage.getItem("tracelens_provider") || "river";
    const savedMod =
      localStorage.getItem("tracelens_model") || PROVIDERS_META[savedProv]?.defaultModel || "zai-org/GLM-5.3-Flash";
    const savedKey = localStorage.getItem("tracelens_api_key") || "";
    const savedUrl = localStorage.getItem("tracelens_custom_url") || "https://api.river.ai/v1";

    setSelectedProvider(savedProv);
    setSelectedModel(savedMod);
    setUserApiKey(savedKey);
    setCustomBaseUrl(savedUrl);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
    setStatusPill(`Sample: ${key.toUpperCase()}`);
    setMobileTab("input");
  };

  const handleCopyDiff = () => {
    navigator.clipboard.writeText(diffText).then(() => {
      setCopiedDiff(true);
      showToast("Git diff copied to clipboard (`git apply` ready)");
      setTimeout(() => setCopiedDiff(false), 2000);
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem("tracelens_provider", selectedProvider);
    localStorage.setItem("tracelens_model", selectedModel);
    if (userApiKey.trim()) {
      localStorage.setItem("tracelens_api_key", userApiKey.trim());
    } else {
      localStorage.removeItem("tracelens_api_key");
    }
    if (customBaseUrl.trim()) {
      localStorage.setItem("tracelens_custom_url", customBaseUrl.trim());
    }
    setSettingsOpen(false);
    showToast(`Configured: ${PROVIDERS_META[selectedProvider]?.name} (${selectedModel})`);
  };

  const handleTestConnection = async () => {
    setTestingModel(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errorLog: "Error: ping connection test",
          provider: selectedProvider,
          model: selectedModel,
          apiKey: userApiKey.trim(),
          customUrl: customBaseUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      alert(`✓ Connection verified! Engine responded in ${data.data?.latency}ms via ${data.data?.provider}.`);
    } catch (err: any) {
      alert(`Connection Failed: ${err.message}`);
    } finally {
      setTestingModel(false);
    }
  };

  const handleAnalyze = async () => {
    const raw = errorInput.trim();
    if (!raw) {
      showToast("Please paste an error log or stack trace first.");
      textareaRef.current?.focus();
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setStatusPill(`Dispatching to /api/analyze (${selectedProvider})...`);

    console.group("⚡ [TraceLens Full-Stack] Dispatching /api/analyze");
    console.log("Provider:", selectedProvider, "Model:", selectedModel);
    console.log("Input Length:", raw.length);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errorLog: raw,
          provider: selectedProvider,
          model: selectedModel,
          apiKey: userApiKey.trim(),
          customUrl: customBaseUrl.trim(),
        }),
      });

      const json = await res.json();
      console.log("📡 API Response Status:", res.status);
      console.log("📦 API Response Body:", json);
      console.groupEnd();

      if (!json.success) {
        throw new Error(json.error || "Analysis failed.");
      }

      const { rootCause: rc, targetFile: tf, diff: df, latency, provider: p, model: m, fallbackUsed } = json.data;
      setRootCause(rc);
      setDiffTarget(tf);
      setDiffText(df);
      
      const badgeSuffix = fallbackUsed ? " (Failover)" : " (Primary $25 Pool)";
      setStatusPill(`✓ ${latency}ms • ${m.split("/").pop()}${badgeSuffix}`);
      showToast("Live AI diagnosis complete!");

      // Switch mobile tab to output automatically
      setMobileTab("output");
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          outputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err: any) {
      console.error("❌ [TraceLens Error]:", err);
      console.groupEnd();
      setErrorMessage(err.message || "Failed to contact backend API route.");
      setStatusPill("Analysis Error");
      showToast(`⚠️ Error: ${err.message?.substring(0, 32)}...`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderDiffHtml = (diff: string) => {
    return diff.split("\n").map((line, idx) => {
      if (line.startsWith("+") && !line.startsWith("+++")) {
        return (
          <div key={idx} className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border-l-2 border-emerald-500 select-text">
            {line}
          </div>
        );
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        return (
          <div key={idx} className="bg-rose-500/10 text-rose-400 px-2 py-0.5 border-l-2 border-rose-500 select-text">
            {line}
          </div>
        );
      } else if (line.startsWith("@@")) {
        return (
          <div key={idx} className="text-cyan-400/90 bg-cyan-950/30 px-2 py-0.5 font-semibold select-none border-y border-cyan-800/20">
            {line}
          </div>
        );
      }
      return (
        <div key={idx} className="text-zinc-400 px-2 py-0.5 select-text">
          {line}
        </div>
      );
    });
  };

  const lineCount = errorInput ? errorInput.split("\n").length : 0;
  const charCount = errorInput.length;

  return (
    <div className="relative min-h-screen text-zinc-100 font-sans selection:bg-brand-500/30 selection:text-white">
      {/* Top Engine Announcement Banner */}
      <div className="w-full bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-emerald-950/80 border-b border-emerald-500/20 px-3 py-1.5 text-center text-xs font-mono text-zinc-300 flex items-center justify-center gap-2 flex-wrap">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="font-semibold text-emerald-300">Live AI Pool:</span>
        <span>River AI GLM-5.3 Flash ($25 Credit Pool Loaded)</span>
        <span className="text-zinc-600 hidden sm:inline">•</span>
        <span className="text-zinc-400 hidden sm:inline">Auto-Failover to Groq LPU & Gemini</span>
        <button
          onClick={() => setSettingsOpen(true)}
          className="ml-1 text-[11px] underline text-emerald-400 hover:text-emerald-300"
        >
          Details
        </button>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#08080b]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
                <div className="w-full h-full bg-[#08080b] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                TraceLens
                <span className="text-emerald-400 text-xs ml-1.5 font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  AI
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7 text-sm font-medium text-zinc-400">
            <a href="#playground" className="hover:text-white transition-colors">
              Workbench
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#beta" className="hover:text-white transition-colors flex items-center space-x-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Public Beta (100% Free)</span>
            </a>
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

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 flex items-center space-x-1.5 transition shadow-sm group"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Model Settings</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {selectedModel.split("/").pop()?.replace(":free", "")}
              </span>
            </button>

            <a
              href="#playground"
              className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-mono shadow-md shadow-emerald-500/25 transition-all"
            >
              Launch Triage
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0a0e] px-4 py-4 space-y-3 font-mono text-xs">
            <a
              href="#playground"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-white py-1"
            >
              ⚡ Workbench Sandbox
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-white py-1"
            >
              🛠️ Core Features
            </a>
            <a
              href="#beta"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-400 hover:text-emerald-300 py-1"
            >
              🎁 100% Free Public Beta
            </a>
            <a
              href="https://github.com/Ahmad-glowex/tracelens-ai"
              target="_blank"
              rel="noreferrer"
              className="block text-zinc-300 hover:text-white py-1"
            >
              ⭐ GitHub Repository
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSettingsOpen(true);
              }}
              className="w-full text-left text-emerald-400 py-1 flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Configure AI Providers</span>
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-zinc-900/90 border border-emerald-500/30 text-zinc-300 shadow-sm shadow-emerald-500/10 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-400">Next.js 14 App Router</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">River AI GLM-5.3 Flash & Groq LPUs</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15] mb-6">
          Turn cryptic stack traces into <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            instant root causes & Git diffs.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Unhandled promise rejections, type panics, and container crashes resolved in sub-seconds. TraceLens isolates offending frames and produces verified, <code className="text-emerald-400">git apply</code> compatible diffs.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 max-w-md sm:max-w-none mx-auto">
          <a
            href="#playground"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 flex items-center justify-center space-x-2 font-mono"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Open Interactive Workbench</span>
          </a>
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 transition-all duration-200 flex items-center justify-center space-x-2 font-mono"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Configure AI Engine</span>
          </button>
          <a
            href="https://github.com/Ahmad-glowex/tracelens-ai"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Github className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
        </div>

        {/* Live Pool Status Card */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-md text-left text-xs font-mono">
          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Primary Engine</div>
              <div className="text-emerald-300 font-semibold truncate">GLM-5.3 Flash ($25 Pool)</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Zero-Downtime Failover</div>
              <div className="text-zinc-200 font-semibold">Groq LPU + Gemini Flash</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Architecture</div>
              <div className="text-zinc-200 font-semibold">Serverless API / Zero CORS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workbench / Sandbox */}
      <section id="playground" className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/10">
          {/* Header & Preset Switchers */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 mb-4 border-b border-white/5 gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-Time Triage Workbench</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Paste any terminal crash log, or test a stack trace preset with our serverless AI pipeline.
              </p>
            </div>

            {/* Presets - Horizontally Scrollable on Mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs text-zinc-500 font-mono mr-1 shrink-0">Presets:</span>
              {(["node", "python", "go", "rust", "docker"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`px-2.5 py-1 text-xs rounded-md font-mono shrink-0 transition ${
                    currentPreset === key
                      ? "bg-zinc-800 border border-emerald-500/50 text-emerald-400 font-semibold"
                      : "bg-zinc-900/90 border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {key === "node"
                    ? "Node / TS"
                    : key === "python"
                    ? "Python FastAPI"
                    : key === "go"
                    ? "Go Panic"
                    : key === "rust"
                    ? "Rust Bounds"
                    : "Docker OOM"}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Segmented Tab Controls (Visible only on < lg screens) */}
          <div className="lg:hidden flex items-center p-1 bg-zinc-900/90 rounded-xl border border-white/5 mb-4 font-mono text-xs">
            <button
              onClick={() => setMobileTab("input")}
              className={`flex-1 py-2 rounded-lg text-center transition flex items-center justify-center space-x-1.5 ${
                mobileTab === "input"
                  ? "bg-zinc-800 text-white font-semibold shadow-sm border border-white/10"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              <span>1. Terminal Stderr</span>
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
              <span>2. AI Diff Fix</span>
            </button>
          </div>

          {/* Workbench Grid (Desktop: Side-by-side; Mobile: Tabbed) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Input Pane */}
            <div
              className={`flex flex-col rounded-xl bg-[#09090d] border border-white/10 overflow-hidden ${
                mobileTab === "output" ? "hidden lg:flex" : "flex"
              }`}
            >
              <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-xs font-mono text-zinc-400 ml-2">stderr (Raw Terminal Crash)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                    {lineCount} lines • {charCount} chars
                  </span>
                  <button
                    onClick={() => {
                      setErrorInput("");
                      textareaRef.current?.focus();
                    }}
                    className="text-xs font-mono text-zinc-400 hover:text-rose-400 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col min-h-[260px] sm:min-h-[360px]">
                <textarea
                  ref={textareaRef}
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      handleAnalyze();
                    }
                  }}
                  rows={14}
                  className="w-full flex-1 bg-transparent text-xs sm:text-sm font-mono text-rose-300/90 focus:outline-none resize-none leading-relaxed placeholder:text-zinc-600"
                  placeholder="Paste stack trace, compiler error, or Docker container log..."
                />
              </div>

              <div className="px-4 py-3 bg-zinc-900/60 border-t border-white/5 flex items-center justify-between">
                <div className="text-[11px] text-zinc-500 font-mono hidden sm:flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>
                    Press{" "}
                    <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                      ⌘+Enter
                    </kbd>{" "}
                    to analyze
                  </span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-mono flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-75 disabled:cursor-wait"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>{isAnalyzing ? "Analyzing via GLM-5.3..." : "Analyze Error (Sub-Second)"}</span>
                </button>
              </div>
            </div>

            {/* Right: AI Resolution & Diff Pane */}
            <div
              ref={outputSectionRef}
              className={`flex flex-col rounded-xl bg-[#09090d] border border-white/10 overflow-hidden ${
                mobileTab === "input" ? "hidden lg:flex" : "flex"
              }`}
            >
              <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      errorMessage ? "bg-rose-500" : "bg-emerald-400"
                    }`}
                  />
                  <span className="text-xs font-mono text-zinc-300">
                    {errorMessage ? "Analysis Error" : "Resolution Ready"}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {statusPill}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyDiff}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition flex items-center space-x-1.5 active:scale-95"
                  >
                    {copiedDiff ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-emerald-400" />
                    )}
                    <span>{copiedDiff ? "Copied!" : "Copy Diff"}</span>
                  </button>
                </div>
              </div>

              {/* Diagnosis Callout */}
              <div className="p-3.5 border-b border-white/5 bg-zinc-900/30">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5 mb-2">
                  <Microchip className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Root Cause Diagnosis:</span>
                </div>
                {errorMessage ? (
                  <div className="text-xs text-rose-400 font-mono p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Error Notice:</div>
                      <div>{errorMessage}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans bg-zinc-900/70 p-3 rounded-lg border border-white/5">
                    {rootCause}
                  </p>
                )}
              </div>

              {/* Diff Viewer */}
              <div className="p-3.5 flex-1 overflow-x-auto bg-[#07070a] min-h-[200px] sm:min-h-[280px]">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between mb-2">
                  <span className="flex items-center space-x-1.5">
                    <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Generated Git Patch (`git apply` ready)</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">{diffTarget}</span>
                </div>
                <pre className="text-xs font-mono leading-relaxed whitespace-pre font-normal">
                  {renderDiffHtml(diffText)}
                </pre>
              </div>

              <div className="px-4 py-3 bg-zinc-900/60 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">Unified Diff (RFC 5322 compatible)</span>
                <button
                  onClick={handleCopyDiff}
                  className="px-3 py-1.5 text-xs font-mono rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/10 transition flex items-center space-x-1.5"
                >
                  <Copy className="w-3 h-3 text-emerald-400" />
                  <span>Apply Patch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
            Engineered for Developers
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sub-second diagnosis. Zero hallucinated patches.
          </p>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Combining River AI GLM-5.3 Flash reasoning with ultra-fast Groq LPU inference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Root-Cause Analysis</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Zeros in on the exact file frame causing null pointer exceptions, unhandled rejections, or type panics across Node, Python, Go, and Rust.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-emerald-400">
              <span>Deterministic AST mapping</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                <GitMerge className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Clean Git Diff Patches</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Receive standardized unified Git diffs formatted for direct terminal consumption via <code className="text-zinc-300">git apply patch.diff</code>.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-cyan-400">
              <span>Zero syntax hallucination</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-105 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cascading Failover Engine</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Primary queries stream through River AI GLM-5.3 Flash ($25 pool). If quotas exhaust, requests automatically failover to Groq LPUs and Gemini Flash.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-teal-400">
              <span>99.99% Availability Guarantee</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Public Beta Section (100% Free) */}
      <section id="beta" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>PUBLIC BETA 1.0 • 100% FREE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            No Paywalls.{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              100% Free During Public Beta.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Zero checkout flows, zero trial expiration traps, and no credit card required. Enjoy unthrottled developer error triage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-white/10 hover:border-emerald-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unlimited Error Analysis</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Analyze Node.js, Python, Go, Rust, or Docker crashes without worrying about token metering or paywalls.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400">Completely Free</span>
              <span className="text-zinc-500">Zero Limits</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-white/10 hover:border-cyan-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Credit Card Required</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Zero checkout modals, no surprise recurring charges, and zero personal tracking. Debug directly in browser.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400">Instant Access</span>
              <span className="text-zinc-500">$0 / Month</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-white/10 hover:border-teal-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Community & Developer First</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Configured with dedicated API credit pools ($25 River AI balance + Groq/Gemini fallbacks) with full BYOK privacy.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-teal-400">Open Ecosystem</span>
              <span className="text-zinc-500">BYOK Ready</span>
            </div>
          </div>
        </div>

        {/* Future Roadmap Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border-2 border-emerald-500/30 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-900/90 shadow-xl shadow-emerald-500/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-2">
                <Calendar className="w-3 h-3" />
                <span>FUTURE ROADMAP</span>
              </div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2.5">
                <span>Team Collaboration & Cloud Logs</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Coming in Q4
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                Centralized team incident triaging, automated GitHub CI/CD Pull Request bots, and real-time Slack/Discord crash alerts are currently in active development for engineering organizations.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <a
                href="#playground"
                className="px-5 py-2.5 text-xs font-mono font-bold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 shadow-md shadow-emerald-500/20 transition flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Try Sandbox Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (MANDATORY EXACT VERBATIM NOTICE) */}
      <footer className="relative z-10 border-t border-white/5 bg-[#07070a] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-white">TraceLens AI</span>
            </div>
            {/* MANDATORY EXACT LEGAL TEXT */}
            <p className="text-xs text-zinc-400 font-sans">
              &copy; 2026 TraceLens. All rights reserved. Operated by Raihan LLC (1910 Thomes Ave, Cheyenne, WY 82001, United States).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
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
            <span className="text-zinc-600">•</span>
            <button onClick={() => setSettingsOpen(true)} className="hover:text-white transition flex items-center space-x-1">
              <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
              <span>Model Settings</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Universal Settings Modal (Mobile & Desktop Responsive) */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="glass-card rounded-2xl max-w-lg w-full p-5 sm:p-7 border border-white/10 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Configure AI Engine</h3>
                  <p className="text-[11px] text-zinc-400">
                    River AI ($25 credit pool) active by default with instant failover.
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
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI Provider</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Serverless Dispatch</span>
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => {
                    const p = e.target.value;
                    setSelectedProvider(p);
                    setSelectedModel(PROVIDERS_META[p]?.defaultModel || "");
                    if (p === "river") {
                      setCustomBaseUrl("https://api.river.ai/v1");
                    }
                  }}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#09090d] border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="river">River AI GLM-5.3 Flash (Primary • $25 Pool Active)</option>
                  <option value="groq">Groq LPUs (Fastest • Llama 3.3 70B & Qwen)</option>
                  <option value="gemini">Google Gemini (Gemini 2.0 Flash)</option>
                  <option value="openrouter">OpenRouter (Free Tiers)</option>
                  <option value="openai">OpenAI (GPT-4o Mini / GPT-4o)</option>
                  <option value="custom">Custom Endpoint (Ollama / LM Studio)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Model Name</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Custom or Preset</span>
                </label>
                <input
                  type="text"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  placeholder="zai-org/GLM-5.3-Flash"
                  className="w-full px-3 py-2 text-xs font-mono bg-[#09090d] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PROVIDERS_META[selectedProvider]?.models.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedModel(m)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/5 transition"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedProvider === "custom" || selectedProvider === "river") && (
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    <span>Base URL</span>
                  </label>
                  <input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="https://api.river.ai/v1"
                    className="w-full px-3 py-2 text-xs font-mono bg-[#09090d] border border-white/10 rounded-lg text-white focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Optional Custom API Key (BYOK)</span>
                  </span>
                  {PROVIDERS_META[selectedProvider]?.keyLink && (
                    <a
                      href={PROVIDERS_META[selectedProvider].keyLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Get Key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={keyVisible ? "text" : "password"}
                    value={userApiKey}
                    onChange={(e) => setUserApiKey(e.target.value)}
                    placeholder="Leave empty to use built-in server key & $25 credit pool..."
                    className="w-full pl-3 pr-10 py-2 text-xs font-mono bg-[#09090d] border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setKeyVisible(!keyVisible)}
                    className="absolute right-2.5 text-zinc-500 hover:text-zinc-300 p-1"
                  >
                    {keyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  Leave empty to use the built-in $25 River AI credit pool and automatic failovers.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingModel}
                className="px-3.5 py-2 text-xs font-mono rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/10 transition flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>{testingModel ? "Testing..." : "Test Connection"}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.clear();
                    setSelectedProvider("river");
                    setSelectedModel("zai-org/GLM-5.3-Flash");
                    setUserApiKey("");
                    setCustomBaseUrl("https://api.river.ai/v1");
                    showToast("Settings reset to River AI GLM-5.3 ($25 Pool)!");
                  }}
                  className="px-3 py-2 text-xs font-mono text-zinc-400 hover:text-rose-400 transition"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 transition flex items-center space-x-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#0e0e14] border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-2xl flex items-center space-x-2 transition-all">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
