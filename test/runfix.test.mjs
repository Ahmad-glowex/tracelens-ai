import test from "node:test";
import assert from "node:assert/strict";
import { execSync, spawn } from "node:child_process";
import * as readline from "node:readline";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { scrubSensitiveData, SCRUB_RULES } = require("../lib/index.js");

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
