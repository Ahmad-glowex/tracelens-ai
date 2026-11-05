export interface ScrubResult {
  scrubbed: string;
  redactedCount: number;
  redactedTypes: string[];
}

export interface PatternRule {
  type: string;
  pattern: RegExp;
  replacement: string | ((substring: string, ...args: string[]) => string);
}

export interface DiffLine {
  id: number;
  type: "hunk" | "add" | "delete" | "context" | "header";
  content: string;
  oldNum?: number | string;
  newNum?: number | string;
}

export declare const SCRUB_RULES: PatternRule[];

export declare function scrubSensitiveData(rawText: string): ScrubResult;

export declare function cleanDiffText(diff: string): string;

export declare function parseUnifiedDiff(diff: string): DiffLine[];
