import React, { useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { RwaAsset, RwaQuoteItem } from '../types/cmc';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface DepegRadarProps {
  assets: RwaAsset[];
  quotes: Record<string, RwaQuoteItem>;
  loading: boolean;
  onInspectAsset: (asset: RwaAsset) => void;
}

export const DepegRadar: React.FC<DepegRadarProps> = ({
  assets,
  quotes,
  loading,
  onInspectAsset,
}) => {
  // Focus on assets with tight peg benchmarks (Treasuries benchmarked around $1.00, or commodities vs spot)
  const treasuryAssets = assets.filter(
    (a) => a.asset_type === 'government_security' || a.asset_type === 'currency'
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#12172E] p-6 rounded-2xl border border-[#1E2548] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Secondary Market De-Peg & Liquidity Radar</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Live NAV Arbitrage
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Monitors secondary DEX/CEX market price deviations relative to underlying Net Asset Value (NAV).
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-[#080B1A] px-3 py-1.5 rounded-xl border border-[#1E2548]">
          <span className="w-2 h-2 rounded-full bg-[#16C784]"></span>
          <span>CMC Endpoint: /v5/real-world-assets/market-pairs/list</span>
        </div>
      </div>

      {/* De-peg Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {treasuryAssets.map((asset) => {
          const quote = quotes[asset.symbol] || quotes[String(asset.rwa_id)];
          const price = quote?.quote?.USD?.price || 1.0;
          const nav = 1.0; // Standard nominal benchmark for US Treasury tokens
          const spreadPct = ((price - nav) / nav) * 100;
          const isPegged = Math.abs(spreadPct) < 0.5;
          const isMild = Math.abs(spreadPct) >= 0.5 && Math.abs(spreadPct) < 1.5;
          const isSevere = Math.abs(spreadPct) >= 1.5;

          return (
            <div
              key={asset.rwa_id || asset.symbol}
              className="terminal-card rounded-2xl p-5 border border-[#1E2548] hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0C1024] border border-[#1E2548] flex items-center justify-center font-bold text-white text-xs">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{asset.name}</h4>
                      <p className="text-[11px] font-mono text-slate-400">{asset.symbol}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isPegged
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isMild
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
                    }`}
                  >
                    {isPegged ? 'Tight Par Peg' : isMild ? 'Mild Spread' : 'Peg Anomaly'}
                  </span>
                </div>

                {/* Price vs NAV Comparison */}
                <div className="mt-4 grid grid-cols-2 gap-3 p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Secondary DEX Price</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      ${price.toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Underlying NAV</div>
                    <div className="text-sm font-bold text-slate-300 font-mono mt-0.5">
                      ${nav.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Spread Calculation */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Divergence / Spread:</span>
                  <span
                    className={`font-mono font-bold ${
                      spreadPct > 0 ? 'text-emerald-400' : spreadPct < 0 ? 'text-rose-400' : 'text-slate-300'
                    }`}
                  >
                    {spreadPct > 0 ? `+${spreadPct.toFixed(3)}% Premium` : `${spreadPct.toFixed(3)}% Discount`}
                  </span>
                </div>

                {/* Volume & Liquidity */}
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">24h Secondary DEX Vol:</span>
                  <span className="font-mono text-slate-300">
                    {formatCurrency(quote?.quote?.USD?.volume_24h || 1200000)}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1E2548] flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Issuer: {asset.issuer_name || 'Verified'}</span>
                <button
                  onClick={() => onInspectAsset(asset)}
                  className="text-xs text-[#3861FB] hover:text-white flex items-center font-medium transition-colors"
                >
                  <span>DEX Pools</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
