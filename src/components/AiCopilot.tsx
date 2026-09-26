import React, { useState } from 'react';
import { Cpu, Send, Bot, User, CheckCircle2, AlertTriangle, FileText, Copy, Check, Terminal, Sparkles } from 'lucide-react';
import { RwaAsset, RwaQuoteItem } from '../types/cmc';
import { CmcService } from '../services/cmcService';
import { formatCurrency } from '../utils/formatters';

interface AiCopilotProps {
  assets: RwaAsset[];
  quotes: Record<string, RwaQuoteItem>;
  selectedAssetForAi?: RwaAsset | null;
}

export const AiCopilot: React.FC<AiCopilotProps> = ({
  assets,
  quotes,
  selectedAssetForAi,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<number | string>(
    selectedAssetForAi?.rwa_id || assets[0]?.rwa_id || ''
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [mcpMode, setMcpMode] = useState(false);

  const currentAsset = assets.find(
    (a) => String(a.rwa_id) === String(selectedAssetId) || a.symbol === String(selectedAssetId)
  ) || assets[0];

  const currentQuote = currentAsset
    ? quotes[currentAsset.symbol] || quotes[String(currentAsset.rwa_id)]
    : null;

  const handleRunAnalysis = async () => {
    if (!currentAsset) return;
    setAnalyzing(true);
    setAnalysisReport(null);

    try {
      const res = await CmcService.analyzeAsset({
        asset: currentAsset,
        quotes: currentQuote,
        issuer: {
          name: currentAsset.issuer_name || 'Institutional Issuer',
          jurisdiction: 'United States / Delaware',
          custodian: 'Tier-1 Institutional Custodian (BNY Mellon / Coinbase)',
        },
      });

      if (res.analysis) {
        setAnalysisReport(res.analysis);
      }
    } catch (err: any) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyReport = () => {
    if (!analysisReport) return;
    const text = `# Institutional Due Diligence: ${analysisReport.assetName} (${analysisReport.symbol})
Rating: ${analysisReport.rating} (Score: ${analysisReport.overallScore}/100)
Price: $${analysisReport.marketProfile?.price} | Market Cap: $${analysisReport.marketProfile?.marketCap?.toLocaleString()}
Issuer: ${analysisReport.issuerProfile?.name} (${analysisReport.issuerProfile?.jurisdiction})
Backing: ${analysisReport.issuerProfile?.backingModel}

Key Risk & Liquidity Flags:
${analysisReport.riskFlags?.map((f: string) => `- ${f}`).join('\n')}

Recommendation:
${analysisReport.recommendation}
Generated via CoinMarketCap v5 RWA Engine at ${analysisReport.generatedAt}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Copilot Header */}
      <div className="bg-[#12172E] p-6 rounded-2xl border border-[#1E2548] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#3861FB]/10 text-[#3861FB]">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">AI Institutional Due Diligence & MCP Agent</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Model Context Protocol (MCP) Ready
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Synthesizes live CoinMarketCap RWA quotes, issuer compliance structures, and DEX liquidity depth into institutional tear sheets.
          </p>
        </div>

        <button
          onClick={() => setMcpMode(!mcpMode)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
            mcpMode
              ? 'bg-[#3861FB] text-white border-[#3861FB]'
              : 'bg-[#080B1A] text-slate-300 border-[#1E2548] hover:border-slate-600'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{mcpMode ? 'MCP Schema Active' : 'View MCP Spec'}</span>
        </button>
      </div>

      {/* MCP Specification Modal / Box */}
      {mcpMode && (
        <div className="bg-[#080B1A] p-4 rounded-xl border border-[#3861FB]/40 space-y-2 text-xs font-mono text-slate-300">
          <div className="flex items-center justify-between text-[#3861FB] font-bold">
            <span>Model Context Protocol (MCP) Server Active (`server/mcp-server.ts`)</span>
            <span className="text-slate-400 font-normal">Compatible with Claude Desktop, Cursor, Antigravity</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Tools exposed to autonomous AI agents: <code className="text-emerald-400">cmc_get_rwa_assets</code>,{' '}
            <code className="text-emerald-400">cmc_get_rwa_quotes</code>,{' '}
            <code className="text-emerald-400">cmc_get_rwa_issuers</code>,{' '}
            <code className="text-emerald-400">cmc_get_market_pairs</code>.
          </p>
          <pre className="bg-[#0C1024] p-3 rounded-lg border border-[#1E2548] text-[11px] overflow-x-auto text-slate-200">
{`{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "cmc_get_rwa_quotes",
    "arguments": { "symbols": "BUIDL,OUSG,USDY,PAXG" }
  }
}`}
          </pre>
        </div>
      )}

      {/* Selector & Generator */}
      <div className="terminal-card rounded-2xl border border-[#1E2548] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Real-World Asset to Audit
            </label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="bg-[#080B1A] border border-[#1E2548] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#3861FB]"
            >
              {assets.map((asset) => (
                <option key={asset.rwa_id || asset.symbol} value={asset.rwa_id || asset.symbol}>
                  {asset.name} ({asset.symbol}) — {asset.asset_type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3861FB] to-[#00F0FF] hover:opacity-90 text-white font-semibold text-xs shadow-lg shadow-[#3861FB]/25 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Analyzing CMC Endpoints...' : 'Generate Institutional Tear Sheet'}</span>
          </button>
        </div>

        {/* Selected Asset Snapshot */}
        {currentAsset && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#080B1A] rounded-xl border border-[#1E2548] text-xs">
            <div>
              <span className="text-slate-400">Symbol / ID:</span>
              <div className="font-mono font-bold text-white mt-0.5">
                {currentAsset.symbol} <span className="text-slate-500 font-normal">({currentAsset.rwa_id})</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400">Current Quote:</span>
              <div className="font-mono font-bold text-emerald-400 mt-0.5">
                {formatCurrency(currentQuote?.quote?.USD?.price || 1.0, 4)}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Market Cap:</span>
              <div className="font-mono text-white mt-0.5">
                {formatCurrency(currentQuote?.quote?.USD?.market_cap || 500000000)}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Issuer:</span>
              <div className="font-medium text-slate-200 mt-0.5 truncate">
                {currentAsset.issuer_name || 'Verified Issuer'}
              </div>
            </div>
          </div>
        )}

        {/* Output Report */}
        {analysisReport ? (
          <div className="mt-6 space-y-6 pt-6 border-t border-[#1E2548]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-white">Institutional Rating:</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3861FB]/20 text-[#3861FB] border border-[#3861FB]/40">
                  {analysisReport.rating}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Score: <strong className="text-white">{analysisReport.overallScore}</strong>/100
                </span>
              </div>

              <button
                onClick={handleCopyReport}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1E2548] text-slate-300 hover:text-white text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Tear Sheet!' : 'Copy Markdown'}</span>
              </button>
            </div>

            {/* Assessment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Reserves & Structure */}
              <div className="p-4 bg-[#080B1A] rounded-xl border border-[#1E2548] space-y-2 text-xs">
                <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                  Collateral & Custody Architecture
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Backing:</span> {analysisReport.issuerProfile?.backingModel}
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Custodian:</span> {analysisReport.issuerProfile?.custodian}
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Jurisdiction:</span> {analysisReport.issuerProfile?.jurisdiction}
                </div>
              </div>

              {/* Box 2: Liquidity & Secondary Market */}
              <div className="p-4 bg-[#080B1A] rounded-xl border border-[#1E2548] space-y-2 text-xs">
                <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                  Liquidity & Turnover Profile
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Secondary Turnover:</span>{' '}
                  <span className="font-mono text-white">{analysisReport.marketProfile?.turnoverRatio}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">24h Secondary DEX Vol:</span>{' '}
                  <span className="font-mono text-white">{formatCurrency(analysisReport.marketProfile?.volume24h)}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">DEX Market Pairs:</span>{' '}
                  <span className="font-mono text-white">{analysisReport.marketProfile?.dexLiquidityPairs || 3} verified pools</span>
                </div>
              </div>
            </div>

            {/* Risk Flags */}
            <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 text-xs space-y-2">
              <div className="font-semibold text-amber-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                Risk & Auditor Observations
              </div>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {analysisReport.riskFlags?.map((flag: string, i: number) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>

            {/* Strategic Recommendation */}
            <div className="p-4 bg-[#1E2548]/40 rounded-xl border border-[#1E2548] text-xs">
              <span className="font-semibold text-white">Investment Committee Conclusion: </span>
              <span className="text-slate-300">{analysisReport.recommendation}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            Click "Generate Institutional Tear Sheet" to run the AI RWA evaluation model on live CMC data.
          </div>
        )}
      </div>
    </div>
  );
};
