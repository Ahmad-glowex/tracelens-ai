import test from "node:test";
import assert from "node:assert/strict";
import { execSync, spawn } from "node:child_process";
import * as readline from "node:readline";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { scrubSensitiveData, SCRUB_RULES, cleanDiffText, parseUnifiedDiff } = require("../lib/index.js");

test("scrubSensitiveData cleans all 10 secret categories", () => {
  const sampleTrace = [
    "-----BEGIN RSA PRIVATE KEY-----",
    "MIIEowIBAAKCAQEA0Y...",
    "-----END RSA PRIVATE KEY-----",
    "Anthropic Key: sk-ant-api03-abcdefghijklmnopqrstuvwxyz123456",
    "OpenAI Key: sk-live987654321012345678901234",
    "Google Key: AIzaSyD1234567890abcdef1234567890abcdef",
    "GitHub Token: ghp_123456789012345678901234567890123456",
    "AWS Key: AKIAIOSFODNN7EXAMPLE",
    "Database: postgresql://admin:SuperSecret123@db.prod.internal:5432/main",
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotLeak",
    'api_key = "super_classified_token_value"',
    "User email: engineer@company.com",
  ].join("\n");

  const result = scrubSensitiveData(sampleTrace);

  assert.ok(result.scrubbed.includes("[REDACTED_PRIVATE_KEY]"));
  assert.ok(result.scrubbed.includes("[REDACTED_ANTHROPIC_KEY]"));
  assert.ok(result.scrubbed.includes("[REDACTED_OPENAI_KEY]"));
  assert.ok(result.scrubbed.includes("[REDACTED_GOOGLE_KEY]"));
  assert.ok(result.scrubbed.includes("[REDACTED_GITHUB_TOKEN]"));
  assert.ok(result.scrubbed.includes("[REDACTED_AWS_KEY_ID]"));
  assert.ok(result.scrubbed.includes("[REDACTED_DB_PASSWORD]"));
  assert.ok(result.scrubbed.includes("Bearer [REDACTED_JWT]"));
  assert.ok(result.scrubbed.includes("[REDACTED_SECRET]"));
  assert.ok(result.scrubbed.includes("[REDACTED_EMAIL]"));

  assert.ok(!result.scrubbed.includes("SuperSecret123"));
  assert.ok(!result.scrubbed.includes("super_classified_token_value"));
  assert.ok(!result.scrubbed.includes("AKIAIOSFODNN7EXAMPLE"));
  assert.ok(result.redactedCount >= 10);
});

test("CLI --version flag prints version", () => {
  const output = execSync("node bin/runfix.mjs --version", { encoding: "utf8" });
  assert.match(output.trim(), /^runfix v1\.1\.0$/);
});

test("CLI --help flag outputs usage and examples", () => {
  const output = execSync("node bin/runfix.mjs --help", { encoding: "utf8" });
  assert.ok(output.includes("RunFix AI CLI"));
  assert.ok(output.includes("npx runfix [command...]"));
  assert.ok(output.includes("npx runfix mcp"));
  assert.ok(output.includes("--json"));
  assert.ok(output.includes("--patch"));
  assert.ok(output.includes("--apply"));
});

test("CLI handles zero-exit commands cleanly with multi-word args", () => {
  const output = execSync("node bin/runfix.mjs node -e \"console.log('test passed')\"", { encoding: "utf8" });
  assert.ok(output.includes("test passed"));
  assert.ok(output.includes("Process exited cleanly with code 0"));
});

test("MCP Server initializes and exposes tools via JSON-RPC stdio", async () => {
  await new Promise((resolve, reject) => {
    const child = spawn("node", ["bin/runfix.mjs", "mcp"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    const rl = readline.createInterface({ input: child.stdout });

    rl.on("line", (line) => {
      if (!line.trim()) return;
      try {
        const msg = JSON.parse(line);
        if (msg.id === 1) {
          assert.equal(msg.result.serverInfo.name, "runfix-mcp");
          child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }) + "\n");
        } else if (msg.id === 2) {
          assert.ok(Array.isArray(msg.result.tools));
          assert.ok(msg.result.tools.some((t) => t.name === "triage_stacktrace"));
          assert.ok(msg.result.tools.some((t) => t.name === "scrub_sensitive_data"));

          child.stdin.write(
            JSON.stringify({
              jsonrpc: "2.0",
              id: 3,
              method: "tools/call",
              params: {
                name: "scrub_sensitive_data",
                arguments: { text: "token=ghp_123456789012345678901234567890123456" },
              },
            }) + "\n"
          );
        } else if (msg.id === 3) {
          assert.ok(msg.result.content[0].text.includes("[REDACTED_GITHUB_TOKEN]"));
          rl.close();
          child.kill("SIGKILL");
          resolve(true);
        }
      } catch (err) {
        reject(err);
      }
    });

    child.on("error", reject);
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }) + "\n");
  });
});

test("parseUnifiedDiff parses standard hunk headers and synchronizes old/new line numbers", () => {
  const diff = [
    "@@ -15,4 +15,5 @@ function test() {",
    " const a = 1;",
    "-const b = 2;",
    "+const b = 20;",
    "+const c = 30;",
    " return a + b;",
  ].join("\n");

  const lines = parseUnifiedDiff(diff);
  assert.equal(lines.length, 6);
  assert.equal(lines[0].type, "hunk");
  assert.equal(lines[0].oldNum, "…");

  // context line 1: old=15, new=15
  assert.equal(lines[1].type, "context");
  assert.equal(lines[1].oldNum, 15);
  assert.equal(lines[1].newNum, 15);

  // deletion line: old=16, new=""
  assert.equal(lines[2].type, "delete");
  assert.equal(lines[2].oldNum, 16);
  assert.equal(lines[2].newNum, "");

  // addition lines: old="", new=16, 17
  assert.equal(lines[3].type, "add");
  assert.equal(lines[3].oldNum, "");
  assert.equal(lines[3].newNum, 16);

  assert.equal(lines[4].type, "add");
  assert.equal(lines[4].oldNum, "");
  assert.equal(lines[4].newNum, 17);

  // context line 2: old=17, new=18
  assert.equal(lines[5].type, "context");
  assert.equal(lines[5].oldNum, 17);
  assert.equal(lines[5].newNum, 18);
});

test("parseUnifiedDiff handles markdown code fences and git metadata headers without throwing", () => {
  const diff = [
    "```diff",
    "diff --git a/src/index.ts b/src/index.ts",
    "index a1b2c3d..e4f5g6h 100644",
    "--- a/src/index.ts",
    "+++ b/src/index.ts",
    "@@ -1,2 +1,2 @@",
    "-console.log('bad');",
    "+console.log('good');",
    "\\ No newline at end of file",
    "```",
  ].join("\n");

  const lines = parseUnifiedDiff(diff);
  // Markdown code fence ``` is stripped cleanly
  assert.ok(!lines.some((l) => l.content.includes("```")));

  // Metadata headers are parsed with type='header' and empty line numbers
  const headers = lines.filter((l) => l.type === "header");
  assert.ok(headers.length >= 5); // diff --git, index, ---, +++, \ No newline
  assert.ok(headers.every((h) => h.oldNum === "" && h.newNum === ""));

  // Check diff hunk & additions/deletions
  const del = lines.find((l) => l.type === "delete");
  const add = lines.find((l) => l.type === "add");
  assert.equal(del.oldNum, 1);
  assert.equal(add.newNum, 1);
});

test("parseUnifiedDiff handles malformed hunk headers gracefully and never generates line 0", () => {
  const malformed = [
    "@@ malformed header without coordinates @@",
    "-oldLine",
    "+newLine",
  ].join("\n");

  const lines = parseUnifiedDiff(malformed);
  assert.equal(lines.length, 3);
  assert.equal(lines[0].type, "hunk");

  const del = lines[1];
  const add = lines[2];

  assert.equal(del.type, "delete");
  assert.equal(del.oldNum, 1); // Starts at 1, NEVER 0
  assert.equal(add.type, "add");
  assert.equal(add.newNum, 1); // Starts at 1, NEVER 0
});

test("cleanDiffText strips diff/patch code blocks and trims trailing newlines", () => {
  const wrapped = "```diff\n@@ -1,1 +1,1 @@\n-a\n+b\n```\n\n";
  const cleaned = cleanDiffText(wrapped);
  assert.equal(cleaned, "@@ -1,1 +1,1 @@\n-a\n+b");
});

