/**
 * RunFix AI - Unified Diff Parser & Patch Utility
 *
 * Parses RFC 5322 unified diffs into structured line records with dual line gutters,
 * hunk headers, and git metadata for high-precision developer rendering.
 */

export interface DiffLine {
  id: number;
  type: "hunk" | "add" | "delete" | "context" | "header";
  content: string;
  oldNum?: number | string;
  newNum?: number | string;
}

/**
 * Strips markdown code fences (```diff ... ```) and trims trailing newlines
 */
export function cleanDiffText(diff: string): string {
  if (!diff) return "";
  let clean = diff.trim();
  // Strip opening markdown code fence if present
  clean = clean.replace(/^```(?:diff|patch)?\s*\n?/i, "");
  // Strip closing markdown code fence if present
  clean = clean.replace(/\n?```\s*$/i, "");
  return clean.trimEnd();
}

/**
 * Parses unified diff string into an array of structured DiffLine items
 */
export function parseUnifiedDiff(diff: string): DiffLine[] {
  const cleaned = cleanDiffText(diff);
  if (!cleaned) return [];

  const lines = cleaned.split("\n");
  const parsed: DiffLine[] = [];
  let oldLine = 1;
  let newLine = 1;
  let hasParsedHunk = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];

    if (raw.startsWith("@@")) {
      const match = raw.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (match) {
        oldLine = Math.max(1, parseInt(match[1], 10));
        newLine = Math.max(1, parseInt(match[2], 10));
      } else if (!hasParsedHunk) {
        oldLine = 1;
        newLine = 1;
      }
      hasParsedHunk = true;
      parsed.push({
        id: i,
        type: "hunk",
        content: raw,
        oldNum: "…",
        newNum: "…",
      });
    } else if (
      raw.startsWith("---") ||
      raw.startsWith("+++") ||
      raw.startsWith("diff --git") ||
      raw.startsWith("index ") ||
      raw.startsWith("new file mode") ||
      raw.startsWith("deleted file mode") ||
      raw.startsWith("similarity index") ||
      raw.startsWith("rename ") ||
      raw.startsWith("Binary files ") ||
      raw.startsWith("\\")
    ) {
      parsed.push({
        id: i,
        type: "header",
        content: raw,
        oldNum: "",
        newNum: "",
      });
    } else if (raw.startsWith("+")) {
      parsed.push({
        id: i,
        type: "add",
        content: raw.substring(1),
        oldNum: "",
        newNum: newLine++,
      });
    } else if (raw.startsWith("-")) {
      parsed.push({
        id: i,
        type: "delete",
        content: raw.substring(1),
        oldNum: oldLine++,
        newNum: "",
      });
    } else {
      const content = raw.startsWith(" ") ? raw.substring(1) : raw;
      parsed.push({
        id: i,
        type: "context",
        content: content,
        oldNum: oldLine > 0 ? oldLine++ : "",
        newNum: newLine > 0 ? newLine++ : "",
      });
    }
  }

  return parsed;
}
