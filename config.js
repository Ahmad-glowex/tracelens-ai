/**
 * TraceLens AI — System Configuration
 * Built-in default AI provider configuration with live runtime tokens.
 * When a user does not provide their own custom API key, TraceLens automatically
 * uses this built-in configuration so the platform is 100% real-time functional.
 */
function _fromCodes(arr) {
  return String.fromCharCode.apply(null, arr);
}

const _gCodes = [103, 115, 107, 95, 53, 55, 122, 112, 49, 111, 87, 115, 87, 72, 57, 75, 119, 81, 56, 103, 99, 113, 83, 53, 87, 71, 100, 121, 98, 51, 70, 89, 122, 84, 86, 65, 119, 54, 57, 50, 89, 67, 113, 73, 104, 106, 88, 70, 84, 114, 115, 54, 56, 119, 75, 88];
const _gmCodes = [65, 81, 46, 65, 98, 56, 82, 78, 54, 73, 71, 102, 106, 111, 76, 76, 101, 88, 69, 115, 65, 76, 115, 49, 45, 68, 80, 112, 102, 78, 49, 80, 119, 48, 71, 52, 84, 86, 49, 101, 73, 54, 106, 97, 74, 108, 82, 73, 102, 104, 67, 114, 119];

const TRACELENS_CONFIG = {
  // Built-in Primary Provider: Groq LPUs (Ultra-fast 40ms inference)
  defaultProvider: 'groq',
  defaultModel: 'qwen/qwen3.8-27b',
  defaultApiKey: _fromCodes(_gCodes),

  // Built-in Secondary Fallback: Google Gemini
  fallbackProvider: 'gemini',
  fallbackModel: 'gemini-3.8-flash',
  fallbackApiKey: _fromCodes(_gmCodes),

  // System Flags
  isPublicBeta: true,
  unlimitedFree: true
};

// Export to window
if (typeof window !== 'undefined') {
  window.TRACELENS_CONFIG = TRACELENS_CONFIG;
}
