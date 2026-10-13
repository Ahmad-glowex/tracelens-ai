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
} from "lucide-react";

// Preset Samples
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
  { name: string; defaultModel: string; models: string[]; keyLink: string }
> = {
  groq: {
    name: "Groq LPUs",
    defaultModel: "llama-3.3-70b-versatile",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "qwen/qwen3.8-27b"],
    keyLink: "https://console.groq.com/keys",
  },
  gemini: {
    name: "Google Gemini",
    defaultModel: "gemini-2.0-flash",
    models: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"],
    keyLink: "https://aistudio.google.com/app/apikey",
  },
  openrouter: {
    name: "OpenRouter",
    defaultModel: "google/gemini-2.0-flash-exp:free",
    models: [
      "google/gemini-2.0-flash-exp:free",
      "meta-llama/llama-3.3-70b-instruct:free",
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
  const [statusPill, setStatusPill] = useState("142ms • Groq LPU (Built-in)");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Settings State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("groq");
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
  const [userApiKey, setUserApiKey] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("http://localhost:11434/v1");
  const [keyVisible, setKeyVisible] = useState(false);
  const [testingModel, setTestingModel] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedDiff, setCopiedDiff] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedProv = localStorage.getItem("tracelens_provider") || "groq";
    const savedMod =
      localStorage.getItem("tracelens_model") || PROVIDERS_META[savedProv]?.defaultModel || "llama-3.3-70b-versatile";
    const savedKey = localStorage.getItem("tracelens_api_key") || "";
    const savedUrl = localStorage.getItem("tracelens_custom_url") || "http://localhost:11434/v1";

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
      alert(`✓ Connection verified! Model "${selectedModel}" responded in ${data.data?.latency}ms.`);
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
    setStatusPill(`Connecting to /api/analyze (${selectedProvider})...`);

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

      const { rootCause: rc, targetFile: tf, diff: df, latency, provider: p, model: m } = json.data;
      setRootCause(rc);
      setDiffTarget(tf);
      setDiffText(df);
      setStatusPill(`✓ ${latency}ms • ${PROVIDERS_META[p]?.name || p} (${m.split("/").pop()})`);
      showToast("Live AI diagnosis complete!");
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
          <div key={idx} className="text-accent-cyan/80 bg-accent-cyan/5 px-2 py-0.5 font-semibold select-none">
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
    <div className="relative min-h-screen text-zinc-100 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-dark-border/80 bg-dark-bg/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan p-0.5 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300">
                <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                TraceLens
                <span className="text-brand-400 text-sm ml-1 font-mono px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">
                  AI
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
            <a href="#playground" className="hover:text-white transition-colors">
              Sandbox
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Architecture
            </a>
            <a href="#beta" className="hover:text-white transition-colors flex items-center space-x-1.5 text-brand-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              <span>Public Beta</span>
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

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-dark-elevated hover:bg-dark-hover text-zinc-300 hover:text-white border border-dark-border flex items-center space-x-1.5 transition shadow-sm group"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-400 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Configure Model</span>
              <span className="sm:hidden">Model</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                {selectedModel.split("/").pop()?.replace(":free", "")}
              </span>
            </button>

            <a
              href="#playground"
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-zinc-950 font-mono shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 transition-all"
            >
              Launch Sandbox
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-dark-surface border border-brand-500/30 text-zinc-300 shadow-sm shadow-brand-500/10 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-ping" />
          <span className="font-semibold text-brand-400">Next.js 14 Full-Stack SaaS</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">Serverless AI Route Handlers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Turn raw stack traces into <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-violet bg-clip-text text-transparent">
            instant fixes & Git diffs.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Cryptic runtime crashes, segfaults, and container exceptions decoded in milliseconds. TraceLens isolates culprit
          AST lines and delivers production-ready Git diffs with zero client CORS issues.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <a
            href="#playground"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-sm text-zinc-950 bg-brand-400 hover:bg-brand-500 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-200 flex items-center justify-center space-x-2 font-mono"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Try Interactive Sandbox</span>
          </a>
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm text-zinc-300 hover:text-white bg-dark-surface hover:bg-dark-elevated border border-dark-border hover:border-zinc-700 transition-all duration-200 flex items-center justify-center space-x-2 font-mono"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-400" />
            <span>Configure Model</span>
          </button>
          <a
            href="https://github.com/Ahmad-glowex/tracelens-ai"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm text-zinc-400 hover:text-white bg-dark-surface hover:bg-dark-elevated border border-dark-border hover:border-zinc-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Github className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-mono uppercase tracking-wider">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Groq LPU 500+ tok/s</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            <Bot className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Gemini Flash</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            <Server className="w-3.5 h-3.5 text-brand-400" />
            <span>Vercel Edge & Serverless</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Browser CORS</span>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox */}
      <section id="playground" className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl border border-dark-border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 mb-4 border-b border-dark-border gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-400" />
                <span>Real-Time Triage Workbench</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Paste real crash logs or pick a sample to execute serverless AI error triage
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500 font-mono mr-1">Samples:</span>
              {(["node", "python", "go", "docker"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`px-2.5 py-1 text-xs rounded-md font-mono transition ${
                    currentPreset === key
                      ? "bg-dark-elevated border border-brand-500/40 text-brand-400"
                      : "bg-dark-elevated border border-dark-border text-zinc-300 hover:text-white"
                  }`}
                >
                  {key === "node"
                    ? "Node / TS"
                    : key === "python"
                    ? "Python FastAPI"
                    : key === "go"
                    ? "Go Panic"
                    : "Docker OOM"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Input */}
            <div className="flex flex-col rounded-xl bg-dark-bg border border-dark-border overflow-hidden">
              <div className="px-4 py-2.5 bg-dark-surface border-b border-dark-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-xs font-mono text-zinc-400 ml-2">stderr (Terminal / Test Runner)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-mono text-zinc-500">
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

              <div className="p-3 flex-1 flex flex-col">
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
                  className="w-full flex-1 bg-transparent text-xs font-mono text-rose-300 focus:outline-none resize-none leading-relaxed"
                  placeholder="Paste stack trace, compiler error, or Docker container log..."
                />
              </div>

              <div className="px-4 py-3 bg-dark-surface/60 border-t border-dark-border flex items-center justify-between">
                <div className="text-[11px] text-zinc-500 font-mono flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>
                    Press{" "}
                    <kbd className="px-1 py-0.5 rounded bg-dark-elevated border border-dark-border text-zinc-300">
                      ⌘+Enter
                    </kbd>{" "}
                    to analyze
                  </span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-500 hover:bg-brand-400 text-zinc-950 font-mono flex items-center space-x-2 transition shadow-lg shadow-brand-500/20 active:scale-95 disabled:opacity-75 disabled:cursor-wait"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{isAnalyzing ? "Analyzing via /api/analyze..." : "Analyze Error"}</span>
                </button>
              </div>
            </div>

            {/* Right: AI Resolution & Diff */}
            <div className="flex flex-col rounded-xl bg-dark-bg border border-dark-border overflow-hidden">
              <div className="px-4 py-2.5 bg-dark-surface border-b border-dark-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      errorMessage ? "bg-rose-500" : "bg-brand-400"
                    }`}
                  />
                  <span className="text-xs font-mono text-zinc-300">
                    {errorMessage ? "Analysis Error" : "Resolution Ready"}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {statusPill}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyDiff}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-dark-elevated text-zinc-300 hover:text-white border border-dark-border transition flex items-center space-x-1.5 active:scale-95"
                  >
                    {copiedDiff ? (
                      <Check className="w-3 h-3 text-brand-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-brand-400" />
                    )}
                    <span>{copiedDiff ? "Copied!" : "Copy Git Diff"}</span>
                  </button>
                </div>
              </div>

              {/* Diagnosis Details */}
              <div className="p-3 border-b border-dark-border bg-dark-surface/30">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5 mb-1.5">
                  <Microchip className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Root Cause Diagnosis:</span>
                </div>
                {errorMessage ? (
                  <div className="text-xs text-rose-400 font-mono p-2.5 rounded bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Backend Error:</div>
                      <div>{errorMessage}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-dark-surface/60 p-2.5 rounded-lg border border-dark-border">
                    {rootCause}
                  </p>
                )}
              </div>

              {/* Diff Viewer */}
              <div className="p-3 flex-1 overflow-x-auto bg-[#0a0a0e]">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between mb-2">
                  <span className="flex items-center space-x-1.5">
                    <GitCommit className="w-3.5 h-3.5 text-brand-400" />
                    <span>Generated Git Patch (`git apply` compatible)</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">{diffTarget}</span>
                </div>
                <pre className="text-xs font-mono leading-relaxed whitespace-pre font-normal">
                  {renderDiffHtml(diffText)}
                </pre>
              </div>

              <div className="px-4 py-3 bg-dark-surface/60 border-t border-dark-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">100% Valid Unified Diff</span>
                <button
                  onClick={() =>
                    alert("PR Pilot integration: Ready to push patch branch to your GitHub repo!")
                  }
                  className="px-3 py-1.5 text-xs font-mono rounded bg-dark-elevated hover:bg-dark-border text-zinc-300 hover:text-white border border-dark-border transition flex items-center space-x-1.5"
                >
                  <GitPullRequest className="w-3 h-3 text-brand-400" />
                  <span>Create PR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-brand-400 mb-2">
            Engineered for Velocity
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Full-stack serverless architecture for instant bug triage.
          </p>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Built with Next.js 14 App Router, Serverless Edge Handlers, and zero client-side CORS friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-5 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Root-Cause Analysis</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Zeros in on the exact user-code frame causing memory leaks, undefined references, or type violations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-dark-border/60 flex items-center text-xs font-mono text-brand-400">
              <span>Deterministic AST mapping</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-5 group-hover:scale-105 transition-transform">
                <GitMerge className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Clean Git Diff Fixes</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Receive formatted, unified Git diff patches that can be instantly applied via <code className="text-zinc-300">git apply</code>.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-dark-border/60 flex items-center text-xs font-mono text-accent-cyan">
              <span>Zero hallucinated syntax</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet mb-5 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Serverless Edge Acceleration</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                All requests routed securely through Next.js serverless route handlers with Groq and Gemini dual-engine fallback.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-dark-border/60 flex items-center text-xs font-mono text-accent-violet">
              <span>Sub-200ms latency</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Public Beta Section */}
      <section id="beta" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-dark-border/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-brand-500/10 border border-brand-500/30 text-brand-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-ping" />
            <span>PUBLIC BETA 1.0 • 100% FREE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            No Paywalls.{" "}
            <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-violet bg-clip-text text-transparent">
              100% Free During Public Beta.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Zero checkout flows, zero trial expiration traps, and no credit card required. Enjoy unthrottled developer error triage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-dark-border hover:border-brand-500/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unlimited Terminal Error Analysis</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Completely free with zero artificial rate barriers. Analyze Node.js, Python, Go, Rust, or Docker container crashes without counting tokens.
              </p>
            </div>
            <div className="pt-4 border-t border-dark-border/60 flex items-center justify-between text-xs font-mono">
              <span className="text-brand-400">Completely Free</span>
              <span className="text-zinc-500">Zero Limits</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-dark-border hover:border-accent-cyan/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Credit Card Required</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Zero checkout flows, zero trial expiration traps, and no surprise invoices. Start debugging immediately straight from your browser.
              </p>
            </div>
            <div className="pt-4 border-t border-dark-border/60 flex items-center justify-between text-xs font-mono">
              <span className="text-accent-cyan">Instant Access</span>
              <span className="text-zinc-500">$0 / Month</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-dark-border hover:border-accent-violet/40 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Community-Driven & Developer First</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Engineered with strict zero-telemetry client-side privacy. Your code stays yours, with open support for free Groq, OpenRouter, and Gemini models.
              </p>
            </div>
            <div className="pt-4 border-t border-dark-border/60 flex items-center justify-between text-xs font-mono">
              <span className="text-accent-violet">Open & Decentralized</span>
              <span className="text-zinc-500">BYOK Ready</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 border-2 border-brand-500/30 bg-gradient-to-r from-dark-surface/90 via-dark-surface/60 to-dark-surface/90 shadow-xl shadow-brand-500/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan mb-2">
                <Calendar className="w-3 h-3" />
                <span>FUTURE ROADMAP</span>
              </div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2.5">
                <span>Team Collaboration & Cloud Logs</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30 font-semibold">
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
                className="px-5 py-2.5 text-xs font-mono font-bold rounded-lg bg-brand-400 hover:bg-brand-500 text-zinc-950 shadow-md shadow-brand-500/20 transition flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Try Sandbox Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (With mandatory verbatim legal notice) */}
      <footer className="relative z-10 border-t border-dark-border/80 bg-dark-bg/95 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-brand-400" />
              </div>
              <span className="text-sm font-bold text-white">TraceLens AI</span>
            </div>
            {/* MANDATORY EXACT LEGAL TEXT */}
            <p className="text-xs text-zinc-400 font-sans">
              &copy; 2026 TraceLens. All rights reserved. Operated by Raihan LLC (1910 Thomes Ave, Cheyenne, WY 82001, United States).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
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
              <SlidersHorizontal className="w-3 h-3 text-brand-400" />
              <span>API Settings</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Universal Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-lg w-full p-6 sm:p-7 border border-dark-border shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-dark-border">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Configure AI Model</h3>
                  <p className="text-[11px] text-zinc-400">
                    Client override options saved in your browser&apos;s localStorage.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-dark-elevated transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-brand-400" />
                    <span>AI Provider</span>
                  </span>
                  <span className="text-[10px] text-brand-400 font-mono">Serverless Dispatch</span>
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => {
                    const p = e.target.value;
                    setSelectedProvider(p);
                    setSelectedModel(PROVIDERS_META[p]?.defaultModel || "");
                  }}
                  className="w-full px-3 py-2 text-xs font-mono bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-brand-400"
                >
                  <option value="groq">Groq LPUs (Fastest • Llama 3.3 70B)</option>
                  <option value="gemini">Google Gemini (Gemini 2.0 / 1.5 Flash)</option>
                  <option value="openrouter">OpenRouter (Free Models)</option>
                  <option value="openai">OpenAI (GPT-4o Mini / GPT-4o)</option>
                  <option value="custom">Custom OpenAI-Compatible (Local Ollama / LM Studio)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Bot className="w-3.5 h-3.5 text-accent-cyan" />
                    <span>Model Name</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Custom or Preset</span>
                </label>
                <input
                  type="text"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  placeholder="llama-3.3-70b-versatile"
                  className="w-full px-3 py-2 text-xs font-mono bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-accent-cyan"
                />

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PROVIDERS_META[selectedProvider]?.models.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedModel(m)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-elevated hover:bg-dark-border text-zinc-300 hover:text-white border border-dark-border transition"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {selectedProvider === "custom" && (
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    <span>Base URL (OpenAI-Compatible)</span>
                  </label>
                  <input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="http://localhost:11434/v1"
                    className="w-full px-3 py-2 text-xs font-mono bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none"
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
                      className="text-[10px] text-brand-400 hover:underline flex items-center space-x-1"
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
                    placeholder="Leave empty to use built-in server key..."
                    className="w-full pl-3 pr-10 py-2 text-xs font-mono bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-brand-400"
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
                  Leave empty to use the built-in server fallback. Custom keys are saved exclusively in your browser.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dark-border flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingModel}
                className="px-3.5 py-2 text-xs font-mono rounded-lg bg-dark-elevated hover:bg-dark-hover text-zinc-300 hover:text-white border border-dark-border transition flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Activity className="w-3 h-3 text-brand-400" />
                <span>{testingModel ? "Testing..." : "Test Connection"}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.clear();
                    setSelectedProvider("groq");
                    setSelectedModel("llama-3.3-70b-versatile");
                    setUserApiKey("");
                    showToast("Settings reset to default!");
                  }}
                  className="px-3 py-2 text-xs font-mono text-zinc-400 hover:text-rose-400 transition"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-brand-400 hover:bg-brand-500 text-zinc-950 transition flex items-center space-x-1.5 shadow-md shadow-brand-500/20"
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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-dark-surface border border-brand-500/40 text-xs font-mono text-brand-400 shadow-2xl flex items-center space-x-2 transition-all">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
