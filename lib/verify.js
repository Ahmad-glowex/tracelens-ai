/**
 * RunFix AI - Patch Verification (CJS)
 *
 * Validates that a model-synthesized unified diff is well-formed and that it
 * actually applies to the caller's working tree (`git apply --check`) before
 * it is handed back to a coding agent.
 */

const { execFile } = require("node:child_process");
const { cleanDiffText, parseUnifiedDiff } = require("./diffParser");

/**
 * Verify a unified diff without mutating anything.
 *
 * @param {string} diff Raw unified diff text (code fences tolerated).
 * @param {{ cwd?: string, timeoutMs?: number }} [options]
 * @returns {Promise<{
 *   ok: boolean,
 *   parseable: boolean,
 *   applies: boolean,
 *   addCount: number,
 *   delCount: number,
 *   targetFile: string|null,
 *   reason: string|null
 * }>}
 */
function verifyPatch(diff, options = {}) {
  const cwd = options.cwd || process.cwd();
  const timeoutMs = options.timeoutMs || 10000;

  const cleaned = cleanDiffText(diff);
  const lines = cleaned ? parseUnifiedDiff(cleaned) : [];

  const addCount = lines.filter((l) => l.type === "add").length;
  const delCount = lines.filter((l) => l.type === "delete").length;
  const hunkHeader = lines.find((l) => l.type === "hunk");
  const firstChange = lines.find((l) => l.type === "add" || l.type === "delete");
  const gitHeader = lines.find((l) => l.type === "header" && /diff --git/.test(l.content));
  const srcHeader = lines.find((l) => l.type === "header" && l.content.startsWith("--- "));
  const targetFile = gitHeader
    ? (gitHeader.content.match(/diff --git a\/(.+?) b\//) || [])[1] || null
    : srcHeader
      ? (srcHeader.content.match(/^--- [ab]\/(.+)$/) || [])[1] || null
      : null;

  if (!cleaned || lines.length === 0) {
    return Promise.resolve({
      ok: false,
      parseable: false,
      applies: false,
      addCount,
      delCount,
      targetFile: null,
      reason: "No diff returned.",
    });
  }

  if (!hunkHeader || !firstChange) {
    return Promise.resolve({
      ok: false,
      parseable: false,
      applies: false,
      addCount,
      delCount,
      targetFile,
      reason: "Diff is missing a valid @@ hunk header or +/- change lines.",
    });
  }

  return new Promise((resolve) => {
    const child = execFile(
      "git",
      ["apply", "--check", "--whitespace=nowarn", "-"],
      { cwd, timeout: timeoutMs },
      (err, _stdout, stderr) => {
        if (err) {
          const detail = String(stderr || err.message).trim().split("\n")[0];
          resolve({
            ok: false,
            parseable: true,
            applies: false,
            addCount,
            delCount,
            targetFile,
            reason: `git apply --check failed: ${detail || "patch does not apply"}`,
          });
          return;
        }
        resolve({
          ok: true,
          parseable: true,
          applies: true,
          addCount,
          delCount,
          targetFile,
          reason: null,
        });
      }
    );
    child.stdin.write(cleaned + "\n");
    child.stdin.end();
  });
}

module.exports = { verifyPatch };
