import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, Lightbulb, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';

export const FeedbackCenter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const feedbackText = `### CoinMarketCap Pro API Feedback: RWASentry Submission

#### 1. What the API Made Possible
- **Unified Multi-Asset Class RWA Tracking**: The new \`/v5/real-world-assets/*\` suite brings together tokenized US Treasuries, Commodities, Equities, and Real Estate under a standardized schema. Previously, developers had to parse disparate EVM/Solana contracts and custom oracles.
- **Dedicated Issuer Directory (\`/v5/real-world-assets/issuers\`)**: Linking individual tokens back to verified institutional entities (Securitize, Ondo, Backed Finance) made automated institutional due diligence and counterparty scoring feasible in real time.
- **Secondary Market Liquidity Discovery (\`/v5/real-world-assets/market-pairs/list\`)**: Allowed our terminal to compute real-time NAV de-peg spreads and secondary market turnover ratios across DEX pools.

#### 2. Where the API Got in the Way (Constructive Feedback for CMC Product Team)
1. **Separation of \`rwa_id\` and \`crypto_id\`**:
   - In \`/v5/real-world-assets/map\`, assets use an \`rwa_id\` namespace distinct from standard \`crypto_id\`. When developers attempt to cross-query standard endpoints (like \`/v1/cryptocurrency/quotes/latest\` or historical charts), mapping between \`rwa_id\` and \`crypto_id\` requires an extra resolution step. A unified \`crypto_id\` cross-reference field inside the RWA object would eliminate duplicate queries.
2. **Missing Standardized Yield / APY in Quotes**:
   - Tokenized Treasuries (BUIDL, USDY, OUSG) and private credit tokens are fundamentally yield-bearing assets. Currently, developers must calculate yield approximations or rely on external sources. Adding an explicit \`yield_apy\` or \`interest_rate_7d\` field directly inside \`/v5/real-world-assets/quotes/latest\` would make CMC the undisputed standard for on-chain fixed income.
3. **Primary Redemption NAV vs Secondary Trading Price**:
   - The quote price currently tracks aggregated exchange prices. Having an official \`underlying_nav\` field alongside \`price\` would allow instant, out-of-the-box de-peg calculations without hardcoded NAV assumptions.
4. **WebSocket Streaming for RWA Market Pairs**:
   - For secondary DEX arbitrage and de-peg monitoring, WebSocket streaming for \`/v5/real-world-assets/market-pairs/list\` would allow instant alerting for institutional treasury desks.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(feedbackText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#12172E] p-6 rounded-2xl border border-[#1E2548] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#3861FB]/10 text-[#3861FB]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">CoinMarketCap API Feedback & Evaluation</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3861FB]/10 text-[#3861FB] border border-[#3861FB]/30">
              Mandatory Hackathon Deliverable
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Direct product assessment for the CoinMarketCap developer team: where the new RWA API unlocked superpowers and where developer friction occurred.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#3861FB] hover:bg-[#2A4FD8] text-white text-xs font-semibold shadow-md shadow-[#3861FB]/20 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Feedback Memo!' : 'Copy for DoraHacks'}</span>
        </button>
      </div>

      {/* Structured Feedback Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Superpowers Unlocked */}
        <div className="terminal-card rounded-2xl border border-emerald-500/20 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <h3>What the CMC API Made Possible</h3>
          </div>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
              <h4 className="font-semibold text-white mb-1">Standardized Multi-Asset Class Schema</h4>
              <p className="text-slate-400">
                The <code className="text-[#3861FB]">/v5/real-world-assets/*</code> endpoints allowed us to build a unified screener across US Treasuries, Commodities, and Equities without writing custom smart contract indexers for 15+ different protocols.
              </p>
            </div>
            <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
              <h4 className="font-semibold text-white mb-1">Institutional Issuer Directory</h4>
              <p className="text-slate-400">
                The <code className="text-[#3861FB]">/v5/real-world-assets/issuers</code> endpoint enabled automated issuer counterparty transparency, linking on-chain tokens to legal entities, custodians, and token rosters.
              </p>
            </div>
            <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
              <h4 className="font-semibold text-white mb-1">Secondary DEX Liquidity Discovery</h4>
              <p className="text-slate-400">
                Access to <code className="text-[#3861FB]">/v5/real-world-assets/market-pairs/list</code> enabled real-time secondary liquidity audits and slippage estimation for large institutional allocations.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Friction & Recommendations */}
        <div className="terminal-card rounded-2xl border border-amber-500/20 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <h3>Where the API Got in the Way (CMC Recommendations)</h3>
          </div>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
              <h4 className="font-semibold text-white mb-1">1. \`rwa_id\` vs \`crypto_id\` Namespace Gap</h4>
              <p className="text-slate-400">
                RWA assets live in a separate \`rwa_id\` namespace. Querying historical charts or standard cryptocurrency metadata requires manual ID cross-referencing. Adding a direct \`crypto_id\` link inside the RWA object would eliminate developer friction.
              </p>
            </div>
            <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
              <h4 className="font-semibold text-white mb-1">2. Missing Yield / APY Field in Quotes</h4>
              <p className="text-slate-400">
                For tokenized T-Bills (BUIDL, USDY, OUSG), yield is the primary metric investors seek. Providing a standardized \`yield_apy\` field directly in \`/quotes/latest\` would make CMC the undisputed leader for tokenized fixed income.
              </p>
            </div>
            <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
              <h4 className="font-semibold text-white mb-1">3. Underlying NAV vs Secondary Price</h4>
              <p className="text-slate-400">
                Having an official \`underlying_nav\` field alongside \`price\` would allow instant de-peg spread calculations without requiring external NAV assumptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
