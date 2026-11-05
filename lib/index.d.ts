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

export declare const SCRUB_RULES: PatternRule[];

export declare function scrubSensitiveData(rawText: string): ScrubResult;
