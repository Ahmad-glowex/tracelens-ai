"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopySnippetProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CopySnippet({ code, language = "bash", filename }: CopySnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative rounded-xl border border-zinc-800 bg-[#0c0d14] overflow-hidden my-3 group">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/70 text-xs font-mono text-zinc-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400/80 inline-block" />
            <span>{filename}</span>
          </span>
          <span className="uppercase text-[10px] text-zinc-500 font-semibold">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed selection:bg-cyan-500/30 selection:text-cyan-200">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="absolute top-3 right-3 p-1.5 rounded-md bg-zinc-900/90 border border-zinc-700/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all shadow-sm"
        >
          {copied ? (
            <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-sans font-medium px-1">
              <Check className="w-3.5 h-3.5" />
              <span>Copied</span>
            </span>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
