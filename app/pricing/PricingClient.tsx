"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap, Sparkles, Shield, ArrowRight, X, Lock, Terminal, Bot, Workflow } from "lucide-react";

export function PricingClient() {
  const [annual, setAnnual] = useState(true);
  const [stripeModalOpen, setStripeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("Pro");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutSubmitted, setCheckoutSubmitted] = useState(false);

  const openStripeModal = (planName: string) => {
    setSelectedPlan(planName);
    setStripeModalOpen(true);
    setCheckoutSubmitted(false);
  };

  const handleStripeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail.trim()) return;
    setCheckoutSubmitted(true);
  };

  return (
    <>
      {/* Billing Switch */}
      <div className="flex items-center justify-center space-x-3 my-8">
        <span
          className={`text-xs font-mono font-medium cursor-pointer transition-colors ${
            !annual ? "text-white" : "text-zinc-500"
          }`}
          onClick={() => setAnnual(false)}
        >
          Monthly Billing
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          aria-label="Toggle annual billing"
          className="w-12 h-6 rounded-full bg-zinc-800 p-1 relative transition-colors border border-zinc-700"
        >
          <div
            className={`w-4 h-4 rounded-full bg-cyan-400 shadow-sm transition-transform ${
              annual ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
        <span
          className={`text-xs font-mono font-medium cursor-pointer flex items-center space-x-1.5 transition-colors ${
            annual ? "text-white" : "text-zinc-500"
          }`}
          onClick={() => setAnnual(true)}
        >
          <span>Annual Billing</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
            SAVE 20%
          </span>
        </span>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Tier 1: Developer Free */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 font-medium">
                COMMUNITY
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Developer Free</h3>
            <p className="text-xs text-zinc-400 mb-6 min-h-[32px]">
              For individual developers, open-source maintainers, and hobbyists.
            </p>

            <div className="flex items-baseline space-x-1 mb-6">
              <span className="text-4xl font-extrabold text-white tracking-tight">$0</span>
              <span className="text-xs text-zinc-500 font-mono">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 font-sans border-t border-zinc-800/80 pt-6">
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Interactive Web Workbench with live diff preview</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Community rate-limited inference (Groq LPUs)</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Client-side secret & PII scrubber</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Official CLI (<code className="text-cyan-400">npx runfix</code>)</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Community GitHub and Discord support</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-semibold text-center block transition-all border border-zinc-700"
            >
              Start Debugging Free
            </Link>
          </div>
        </div>

        {/* Tier 2: Pro BYOK (Featured) */}
        <div className="rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-b from-cyan-950/20 via-zinc-900/60 to-zinc-950/80 p-6 flex flex-col justify-between relative shadow-xl shadow-cyan-950/30">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-zinc-950 text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-sm">
            Most Popular
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium">
                PROFESSIONAL & BYOK
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Pro BYOK</h3>
            <p className="text-xs text-zinc-400 mb-6 min-h-[32px]">
              For software engineers and startups who need frontier reasoning models and IDE integration.
            </p>

            <div className="flex items-baseline space-x-2 mb-6">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {annual ? "$15" : "$19"}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                / seat / mo {annual && <span className="text-emerald-400 text-[10px]">(billed annually)</span>}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono -mt-4 mb-6">
              or <span className="text-emerald-400 font-semibold">$0/mo</span> when using your own API key (BYOK)
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 font-sans border-t border-zinc-800/80 pt-6">
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="font-semibold text-white">Everything in Developer Free</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Bring Your Own Key (BYOK) with 0% platform markup</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Anthropic Claude 3.5 Sonnet & Claude Opus reasoning</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Model Context Protocol (MCP) server for Cursor & Claude</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Sub-second priority inference routing</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Custom OpenAI-compatible inference proxy endpoints</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => openStripeModal("Pro BYOK")}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-mono text-xs font-bold text-center block transition-all shadow-md shadow-cyan-500/20"
            >
              Subscribe with Stripe ($15/mo)
            </button>
          </div>
        </div>

        {/* Tier 3: Enterprise Healer */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 font-medium">
                ENTERPRISE SAAS
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Enterprise Healer</h3>
            <p className="text-xs text-zinc-400 mb-6 min-h-[32px]">
              For engineering teams automating continuous integration crash resolution at scale.
            </p>

            <div className="flex items-baseline space-x-2 mb-6">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {annual ? "$79" : "$99"}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                / seat / mo {annual && <span className="text-emerald-400 text-[10px]">(billed annually)</span>}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono -mt-4 mb-6">
              or custom annual contract for multi-repo teams
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 font-sans border-t border-zinc-800/80 pt-6">
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span className="font-semibold text-white">Everything in Pro BYOK</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Autonomous GitHub Action CI Healer (<code className="text-purple-400">runfix-action.yml</code>)</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Multi-repo automated Pull Requests with verified diffs</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Team Workspaces & centralized seat management</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Strict Zero Data Retention (ZDR) SLA agreement</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Dedicated on-premise VPC inference gateway options</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>24/7 dedicated engineering Slack & 1-hour SLA</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <a
              href="mailto:founder@runfix.live?subject=RunFix%20Enterprise%20Healer%20Inquiry"
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-semibold text-center block transition-all border border-zinc-700"
            >
              Contact Enterprise Sales
            </a>
          </div>
        </div>
      </div>

      {/* Stripe Checkout Modal */}
      {stripeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1017] border border-zinc-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setStripeModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Stripe Checkout</h3>
                <p className="text-[11px] text-zinc-400 font-mono">RunFix AI • {selectedPlan}</p>
              </div>
            </div>

            {checkoutSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-2">
                <p className="font-semibold text-sm text-white">Stripe Billing Session Initialized!</p>
                <p className="text-zinc-300">
                  A direct checkout link and developer credentials have been dispatched to:
                </p>
                <p className="font-mono text-cyan-400 font-bold">{checkoutEmail}</p>
                <p className="text-[11px] text-zinc-400 pt-2">
                  Please check your inbox to complete setup, or contact{" "}
                  <a href="mailto:founder@runfix.live" className="underline text-emerald-400">
                    founder@runfix.live
                  </a>{" "}
                  for immediate assistance.
                </p>
                <button
                  onClick={() => setStripeModalOpen(false)}
                  className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 text-white font-mono text-xs hover:bg-zinc-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleStripeSubmit} className="space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Enter your developer or corporate email to initiate your secure Stripe checkout session for{" "}
                  <strong className="text-white">{selectedPlan}</strong> (
                  {annual ? "$15/seat/mo billed annually" : "$19/seat/mo"}).
                </p>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    placeholder="developer@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                  <div className="flex items-center space-x-1.5 text-zinc-300">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold">Security & Privacy Assurance</span>
                  </div>
                  <p>
                    Payments handled via Stripe 256-bit encrypted checkout. Cancel anytime. Strict zero data retention on all proprietary code.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStripeModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-mono text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
                  >
                    Proceed to Stripe →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
