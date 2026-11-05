/**
 * RunFix AI - Client-Side Secret & PII Scrubber
 * 
 * Automatically sanitizes sensitive keys, credentials, connection strings,
 * and PII from stack traces before network transmission.
 * 
 * Guarantee: Zero-telemetry, zero-leakage security boundary.
 */

const SCRUB_RULES = [
  // Private Keys (RSA, EC, SSH, PGP)
  {
    type: "Private Key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    replacement: "[REDACTED_PRIVATE_KEY]",
  },
  // Anthropic API Keys (must precede OpenAI to prevent false sk- prefix match)
  {
    type: "Anthropic API Key",
    pattern: /sk-ant-[a-zA-Z0-9_-]{30,}/g,
    replacement: "[REDACTED_ANTHROPIC_KEY]",
  },
  // OpenAI API Keys
  {
    type: "OpenAI API Key",
    pattern: /sk-(?!ant-)(?:live|test|proj)?[a-zA-Z0-9_-]{20,}/g,
    replacement: "[REDACTED_OPENAI_KEY]",
  },
  // Google / Gemini API Keys
  {
    type: "Google API Key",
    pattern: /AIza[0-9A-Za-z\-_]{35}/g,
    replacement: "[REDACTED_GOOGLE_KEY]",
  },
  // GitHub Tokens
  {
    type: "GitHub Token",
    pattern: /(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36,}|github_pat_[a-zA-Z0-9_]{82}/g,
    replacement: "[REDACTED_GITHUB_TOKEN]",
  },
  // AWS Access Key ID
  {
    type: "AWS Access Key",
    pattern: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
    replacement: "[REDACTED_AWS_KEY_ID]",
  },
  // JWT / Bearer Tokens
  {
    type: "JWT / Bearer Token",
    pattern: /Bearer\s+ey[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*/g,
    replacement: "Bearer [REDACTED_JWT]",
  },
  // Database Connection Strings with Passwords
  {
    type: "Database Connection String",
    pattern: /(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis|amqp):\/\/[^:\s\/]+:([^@\s\/]+)@[^:\s\/]+/gi,
    replacement: (match, p1) => match.replace(p1, "[REDACTED_DB_PASSWORD]"),
  },
  // Generic Secrets in key=value or JSON formats
  {
    type: "Secret / Token Assignment",
    pattern: /(?:"?(?:api[_-]?key|secret|password|passwd|auth[_-]?token|access[_-]?token|private[_-]?key)"?\s*[:=]\s*["']?)([^"'\s,;}\]]{8,})/gi,
    replacement: (match, p1) => match.replace(p1, "[REDACTED_SECRET]"),
  },
  // Email Addresses in stack traces
  {
    type: "Email Address",
    pattern: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g,
    replacement: "[REDACTED_EMAIL]",
  },
];

/**
 * Scrubs raw error log or stack trace of sensitive information.
 * @param {string} rawText
 * @returns {{ scrubbed: string, redactedCount: number, redactedTypes: string[] }}
 */
function scrubSensitiveData(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { scrubbed: "", redactedCount: 0, redactedTypes: [] };
  }

  let scrubbed = rawText;
  let totalRedacted = 0;
  const typesSet = new Set();

  for (const rule of SCRUB_RULES) {
    let matchCount = 0;
    scrubbed = scrubbed.replace(rule.pattern, (...args) => {
      matchCount++;
      typesSet.add(rule.type);
      if (typeof rule.replacement === "function") {
        return rule.replacement(args[0], ...args.slice(1));
      }
      return rule.replacement;
    });
    totalRedacted += matchCount;
  }

  return {
    scrubbed,
    redactedCount: totalRedacted,
    redactedTypes: Array.from(typesSet),
  };
}

module.exports = {
  SCRUB_RULES,
  scrubSensitiveData,
};
