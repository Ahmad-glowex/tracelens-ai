export interface PatchVerification {
  ok: boolean;
  parseable: boolean;
  applies: boolean;
  addCount: number;
  delCount: number;
  targetFile: string | null;
  reason: string | null;
}

export function verifyPatch(
  diff: string,
  options?: { cwd?: string; timeoutMs?: number }
): Promise<PatchVerification>;
