#!/usr/bin/env node

/**
 * RunFix AI CLI & Model Context Protocol (MCP) Server
 * 
 * Usage:
 *   npx runfix [command...]           Run a command, capture failure, and generate patch
 *   cat error.log | npx runfix        Triage piped error stack trace
 *   npx runfix mcp                    Start Model Context Protocol (MCP) server (stdio)
 *   npx runfix --help                 Show help and options
 *   npx runfix --version              Show version
 */

import { spawn } from "node:child_process";
import * as readline from "node:readline";
import * as fs from "node:fs";

const API_ENDPOINT = process.env.RUNFIX_API_URL || "https://runfix.live/api/analyze";
const VERSION = "1.1.0";

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
};

// Enterprise-grade secret and PII scrubber for CLI
function scrubText(text) {
  if (!text) return "";
  return text
    .replace(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g, "[REDACTED_PRIVATE_KEY]")
    .replace(/sk-ant-[a-zA-Z0-9_-]{30,}/g, "[REDACTED_ANTHROPIC_KEY]")
    .replace(/sk-(?!ant-)(?:live|test|proj)?[a-zA-Z0-9_-]{20,}/g, "[REDACTED_OPENAI_KEY]")
    .replace(/AIza[0-9A-Za-z\-_]{35}/g, "[REDACTED_GOOGLE_KEY]")
    .replace(/(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36,}|github_pat_[a-zA-Z0-9_]{82}/g, "[REDACTED_GITHUB_TOKEN]")
    .replace(/(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g, "[REDACTED_AWS_KEY_ID]")
    .replace(/(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis|amqp):\/\/[^:\s\/]+:([^@\s\/]+)@[^:\s\/]+/gi, (m, p) => m.replace(p, "[REDACTED_DB_PASSWORD]"))
    .replace(/(?:"?(?:api[_-]?key|secret|password|passwd|auth[_-]?token|access[_-]?token|private[_-]?key)"?\s*[:=]\s*["']?)([^"'\s,;}\]]{8,})/gi, (m, p) => m.replace(p, "[REDACTED_SECRET]"))
    .replace(/Bearer\s+ey[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*/g, "Bearer [REDACTED_JWT]")
    .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, "[REDACTED_EMAIL]");
}

async function queryRunFixApi(errorLog, options = {}) {
  const scrubbed = scrubText(errorLog);
  const payload = {
    errorLog: scrubbed,
  };

  if (options.provider) {
    payload.provider = options.provider;
  }
  if (options.model) {
    payload.model = options.model;
  }
  if (process.env.RUNFIX_API_KEY) {
    payload.apiKey = process.env.RUNFIX_API_KEY;
  }

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.success === false) {
    const errorMsg = json.error || `RunFix API error (HTTP ${response.status})`;
    throw new Error(errorMsg);
  }

  // Unpack nested data object returned by /api/analyze
  return json.data || json;
}

// -------------------------------------------------------------
// MCP Server Implementation (JSON-RPC 2.0 over stdio)
// -------------------------------------------------------------
function startMcpServer() {
  process.stderr.write(`${colors.cyan}[RunFix MCP]${colors.reset} Server initialized on stdio. Compatible with Cursor, Windsurf, Claude.\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const sendResponse = (id, result) => {
    const payload = JSON.stringify({ jsonrpc: "2.0", id, result });
    process.stdout.write(payload + "\n");
  };

  const sendError = (id, code, message) => {
    const payload = JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } });
    process.stdout.write(payload + "\n");
  };

  rl.on("line", async (line) => {
    if (!line.trim()) return;

    try {
      const msg = JSON.parse(line);
      const { id, method, params } = msg;

      if (method === "initialize") {
        sendResponse(id, {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "runfix-mcp", version: VERSION },
        });
        return;
      }

      if (method === "tools/list") {
        sendResponse(id, {
          tools: [
            {
              name: "triage_stacktrace",
              description: "Pinpoint root cause of terminal error traces and synthesize a verified unified Git patch diff.",
              inputSchema: {
                type: "object",
                properties: {
                  errorLog: { type: "string", description: "The full terminal crash log, stack trace, or unhandled exception." },
                  provider: { type: "string", description: "Optional LLM provider (groq, anthropic, gemini, river)." },
                },
                required: ["errorLog"],
              },
            },
            {
              name: "scrub_sensitive_data",
              description: "Sanitize API keys, tokens, credentials, and passwords from error logs prior to external sending.",
              inputSchema: {
                type: "object",
                properties: {
                  text: { type: "string", description: "Raw text to scrub." },
                },
                required: ["text"],
              },
            },
          ],
        });
        return;
      }

      if (method === "tools/call") {
        const { name, arguments: args } = params;

        if (name === "scrub_sensitive_data") {
          const scrubbed = scrubText(args.text || "");
          sendResponse(id, {
            content: [{ type: "text", text: scrubbed }],
          });
          return;
        }

        if (name === "triage_stacktrace") {
          const result = await queryRunFixApi(args.errorLog, { provider: args.provider });
          sendResponse(id, {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          });
          return;
        }

        sendError(id, -32601, `Tool not found: ${name}`);
        return;
      }

      if (method === "notifications/initialized") {
        // Notification, no response needed
        return;
      }

      sendError(id, -32601, `Method not supported: ${method}`);
    } catch (err) {
      process.stderr.write(`[RunFix MCP Error] ${err.message}\n`);
    }
  });
}

// -------------------------------------------------------------
// Interactive CLI / Subcommand execution
// -------------------------------------------------------------
function formatCommandLine(cmdArgs) {
  if (cmdArgs.length === 1) return cmdArgs[0];
  return cmdArgs
    .map((arg) => {
      if (/[\s"'$`\\!&|;()<>]/.test(arg)) {
        return `"${arg.replace(/(["\\$`])/g, "\\$1")}"`;
      }
      return arg;
    })
    .join(" ");
}

async function runCommandAndTriage(cmdArgs, cliFlags = {}) {
  const commandString = formatCommandLine(cmdArgs);
  console.log(`${colors.cyan}${colors.bold}RunFix AI${colors.reset} v${VERSION} — Monitoring execution: ${colors.yellow}${commandString}${colors.reset}\n`);

  const child = spawn(commandString, {
    shell: true,
    stdio: ["inherit", "pipe", "pipe"],
  });

  let stderrOutput = "";
  let stdoutOutput = "";

  child.stdout.on("data", (data) => {
    const str = data.toString();
    stdoutOutput += str;
    process.stdout.write(str);
  });

  child.stderr.on("data", (data) => {
    const str = data.toString();
    stderrOutput += str;
    process.stderr.write(str);
  });

  child.on("close", async (code) => {
    if (code === 0) {
      console.log(`\n${colors.green}✓ Process exited cleanly with code 0.${colors.reset}`);
      process.exit(0);
    }

    console.log(`\n${colors.red}✗ Command failed (exit code ${code}). Triggering RunFix automated triage...${colors.reset}\n`);
    const fullLog = [stdoutOutput, stderrOutput].filter(Boolean).join("\n").trim();

    if (!fullLog) {
      console.log(`${colors.yellow}Command exited with code ${code}, but produced no console or error output to triage.${colors.reset}`);
      process.exit(code || 1);
    }

    try {
      const result = await queryRunFixApi(fullLog, { provider: cliFlags.provider });
      await handleResult(result, cliFlags);
      process.exit(code || 1);
    } catch (err) {
      console.error(`${colors.red}Error querying RunFix AI:${colors.reset} ${err.message}`);
      process.exit(code || 1);
    }
  });
}

async function handleResult(result, cliFlags = {}) {
  if (cliFlags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  printAnalysis(result);

  if (cliFlags.patchFile && result.diff) {
    fs.writeFileSync(cliFlags.patchFile, result.diff, "utf8");
    console.log(`${colors.green}✓ Synthesized patch written to ${cliFlags.patchFile}${colors.reset}`);
  }

  if (cliFlags.apply && result.diff) {
    const patchPath = cliFlags.patchFile || "patch.diff";
    if (!cliFlags.patchFile) {
      fs.writeFileSync(patchPath, result.diff, "utf8");
    }
    console.log(`${colors.cyan}Applying patch with 'git apply ${patchPath}'...${colors.reset}`);
    await new Promise((resolve) => {
      const applyProcess = spawn(`git apply ${patchPath}`, { shell: true, stdio: "inherit" });
      applyProcess.on("close", (code) => {
        if (code === 0) {
          console.log(`${colors.green}✓ Patch successfully applied to working tree!${colors.reset}`);
        } else {
          console.error(`${colors.red}✗ git apply returned code ${code}. Check git status or conflicts.${colors.reset}`);
        }
        resolve();
      });
    });
  }
}

function printAnalysis(result) {
  console.log(`${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.green}  RunFix AI Diagnosis${colors.reset}`);
  console.log(`${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}`);

  if (result.rootCause) {
    console.log(`\n${colors.bold}Root Cause:${colors.reset}\n  ${result.rootCause}`);
  }

  if (result.targetFile) {
    console.log(`\n${colors.bold}Target File:${colors.reset}\n  ${colors.yellow}${result.targetFile}${colors.reset}`);
  }

  if (result.diff) {
    console.log(`\n${colors.bold}Synthesized Unified Git Diff:${colors.reset}`);
    const coloredDiff = result.diff
      .split("\n")
      .map((line) => {
        if (line.startsWith("+")) return colors.green + line + colors.reset;
        if (line.startsWith("-")) return colors.red + line + colors.reset;
        if (line.startsWith("@@")) return colors.cyan + line + colors.reset;
        return line;
      })
      .join("\n");
    console.log(coloredDiff);
    console.log(`\n${colors.gray}Tip: Save to patch.diff and run 'git apply patch.diff'${colors.reset}`);
  }

  if (result.latency || result.provider) {
    const metaParts = [];
    if (result.latency) metaParts.push(`${result.latency}ms`);
    if (result.provider) metaParts.push(result.provider);
    if (metaParts.length > 0) {
      console.log(`\n${colors.gray}[${metaParts.join(" • ")}]${colors.reset}`);
    }
  }

  console.log(`\n${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

async function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    if (process.stdin.isTTY) {
      resolve("");
      return;
    }
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

// -------------------------------------------------------------
// Entry Point
// -------------------------------------------------------------
async function main() {
  const rawArgs = process.argv.slice(2);

  if (rawArgs.includes("mcp")) {
    startMcpServer();
    return;
  }

  if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
    console.log(`
${colors.bold}RunFix AI CLI${colors.reset} — Automated runtime crash triage & unified Git patch synthesis.

${colors.bold}Usage:${colors.reset}
  npx runfix [command...]       Execute a test/build command and auto-triage failures
  npx runfix mcp                Launch Model Context Protocol (MCP) server for IDEs
  cat trace.log | npx runfix    Analyze piped error log or stack trace
  npx runfix --version          Show version
  npx runfix --help             Show help documentation

${colors.bold}Options:${colors.reset}
  --json                        Output raw machine-readable JSON diagnostic
  --patch [file]                Write synthesized Git diff patch to file (default: patch.diff)
  --apply                       Automatically apply synthesized diff with git apply
  --provider <name>             Specify LLM provider (river, groq, anthropic, gemini)

${colors.bold}Examples:${colors.reset}
  npx runfix "npm test"
  npx runfix "pytest tests/"
  npx runfix "cargo build"
  cat trace.log | npx runfix --patch
  git log -1 --stat | npx runfix

${colors.bold}Environment Variables:${colors.reset}
  RUNFIX_API_URL               API URL (default: https://runfix.live/api/analyze)
  RUNFIX_API_KEY               Custom provider key (optional)
`);
    return;
  }

  if (rawArgs.includes("--version") || rawArgs.includes("-v")) {
    console.log(`runfix v${VERSION}`);
    return;
  }

  // Parse flags
  const cliFlags = {
    json: false,
    apply: false,
    patchFile: null,
    provider: null,
  };

  const commandTokens = [];
  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg === "--json") {
      cliFlags.json = true;
    } else if (arg === "--apply") {
      cliFlags.apply = true;
    } else if (arg === "--patch") {
      const nextArg = rawArgs[i + 1];
      if (nextArg && !nextArg.startsWith("-")) {
        cliFlags.patchFile = nextArg;
        i++;
      } else {
        cliFlags.patchFile = "patch.diff";
      }
    } else if (arg.startsWith("--patch=")) {
      cliFlags.patchFile = arg.split("=")[1] || "patch.diff";
    } else if (arg === "--provider") {
      cliFlags.provider = rawArgs[++i];
    } else if (arg.startsWith("--provider=")) {
      cliFlags.provider = arg.split("=")[1];
    } else {
      commandTokens.push(arg);
    }
  }

  // Check stdin first
  const pipedInput = await readStdin();
  if (pipedInput.trim()) {
    if (!cliFlags.json) {
      console.log(`${colors.cyan}Analyzing error trace via RunFix AI...${colors.reset}\n`);
    }
    try {
      const result = await queryRunFixApi(pipedInput, { provider: cliFlags.provider });
      await handleResult(result, cliFlags);
    } catch (err) {
      console.error(`${colors.red}RunFix Error:${colors.reset} ${err.message}`);
      process.exit(1);
    }
    return;
  }

  if (commandTokens.length > 0) {
    await runCommandAndTriage(commandTokens, cliFlags);
    return;
  }

  console.log(`${colors.yellow}No command or piped input received.${colors.reset} Run ${colors.bold}npx runfix --help${colors.reset} for usage.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
