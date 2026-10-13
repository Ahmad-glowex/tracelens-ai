/**
 * TraceLens AI — System Configuration
 * Built-in default AI provider configuration.
 * When a user does not provide their own custom API key, TraceLens automatically
 * uses this built-in configuration so the platform is 100% real-time functional.
 */
const TRACELENS_CONFIG = {
  // Built-in Provider: 'groq' or 'gemini'
  defaultProvider: 'groq',

  // Built-in Model
  defaultModel: 'llama-3.3-70b-versatile',

  // Built-in Default API Key (Groq or Gemini)
  // When set, all users get immediate real-time AI diagnoses with zero setup friction!
  defaultApiKey: '',

  // System Flags
  isPublicBeta: true,
  unlimitedFree: true
};

// Export to window
if (typeof window !== 'undefined') {
  window.TRACELENS_CONFIG = TRACELENS_CONFIG;
}
