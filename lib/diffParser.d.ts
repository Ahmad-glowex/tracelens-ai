export interface DiffLine {
  id: number;
  type: "hunk" | "add" | "delete" | "context" | "header";
  content: string;
  oldNum?: number | string;
  newNum?: number | string;
}

export declare function cleanDiffText(diff: string): string;
export declare function parseUnifiedDiff(diff: string): DiffLine[];
