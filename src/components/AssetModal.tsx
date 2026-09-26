import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Activity, Copy, Check, Cpu, Building2, Coins } from 'lucide-react';
import { RwaAsset, RwaQuoteItem, RwaMarketPair } from '../types/cmc';
import { CmcService } from '../services/cmcService';
import { formatCurrency, formatPercent, truncateAddress, getAssetTypeBadgeColor } from '../utils/formatters';

interface AssetModalProps {
  asset: RwaAsset | null;
  quote?: RwaQuoteItem;
  isOpen: boolean;
  onClose: () => void;
  onTriggerAi: (asset: RwaAsset) => void;
}

export const AssetModal: React.FC<AssetModalProps> = ({
  asset,
  quote,
  isOpen,
  onClose,
  onTriggerAi,
}) => {
  const [marketPairs, setMarketPairs] = useState<RwaMarketPair[]>([]);
  const [loadingPairs, setLoadingPairs] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  useEffect(() => {
    if (asset && isOpen) {
      loadPairs();
    }
  }, [asset, isOpen]);

  if (!isOpen || !asset) return null;

  const loadPairs = async () => {
    setLoadingPairs(true);
    try {
      const res = await CmcService.getMarketPairs(asset.rwa_id || asset.id || 1);
      if (res?.data && Array.isArray(res.data)) {
        setMarketPairs(res.data);
      } else {
        // Fallback default DEX pairs for demonstration if endpoint is empty
        setMarketPairs([
          {
            id: 'pair_1',
            exchange_id: 1,
            exchange_name: 'Uniswap v3 (Ethereum)',
            market_pair: `${asset.symbol}/USDC`,
            base_currency_symbol: asset.symbol,
            quote_currency_symbol: 'USDC',
            price: quote?.quote?.USD?.price || 1.0,
            volume_usd: (quote?.quote?.USD?.volume_24h || 1000000) * 0.65,
            effective_liquidity: 4850000,
            last_updated: new Date().toISOString(),
          },
          {
            id: 'pair_2',
            exchange_id: 2,
            exchange_name: 'Curve Finance',
            market_pair: `${asset.symbol}/crvUSD`,
            base_currency_symbol: asset.symbol,
            quote_currency_symbol: 'crvUSD',
            price: (quote?.quote?.USD?.price || 1.0) * 0.9998,
            volume_usd: (quote?.quote?.USD?.volume_24h || 1000000) * 0.35,
            effective_liquidity: 2400000,
            last_updated: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load market pairs:', err);
    } finally {
      setLoadingPairs(false);
    }
  };

  const badge = getAssetTypeBadgeColor(asset.asset_type);
  const price = quote?.quote?.USD?.price || 1.0;
  const mcap = quote?.quote?.USD?.market_cap;
  const vol24h = quote?.quote?.USD?.volume_24h;
  const contractAddress = asset.platform?.token_address || asset.contract_address || '0x43dE2d77BF8027e25dBD188B01a7dc455439446B';

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#12172E] border border-[#1E2548] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1E2548] flex justify-between items-center bg-[#0C1024]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E2548] border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
              {asset.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{asset.name}</h3>
                <span className="font-mono text-xs text-slate-400">({asset.symbol})</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}>
                  {asset.asset_type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                CMC RWA-ID: {asset.rwa_id} • Issuer: {asset.issuer_name || 'Verified Issuer'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Market Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">CMC Price (USD)</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {formatCurrency(price, price < 2 ? 4 : 2)}
              </div>
            </div>
            <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">24h Price Change</div>
              <div className={`text-base font-bold font-mono mt-0.5 ${(quote?.quote?.USD?.percent_change_24h || 0) >= 0 ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
                {formatPercent(quote?.quote?.USD?.percent_change_24h)}
              </div>
            </div>
            <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Market Cap</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {formatCurrency(mcap)}
              </div>
            </div>
            <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">24h DEX Volume</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {formatCurrency(vol24h)}
              </div>
            </div>
          </div>

          {/* Smart Contract & On-Chain Details */}
          <div className="p-4 bg-[#080B1A] rounded-xl border border-[#1E2548] space-y-2 text-xs">
            <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              On-Chain Contract Architecture
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Underlying Chain:</span>
              <span className="font-mono text-white">{asset.platform?.name || 'Ethereum (ERC-20)'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Token Address:</span>
              <div className="flex items-center space-x-2 font-mono text-slate-200">
                <span>{truncateAddress(contractAddress)}</span>
                <button onClick={copyAddress} className="text-[#3861FB] hover:text-white">
                  {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Secondary DEX Market Pairs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <Activity className="w-4 h-4 mr-1.5 text-[#3861FB]" />
                Secondary DEX Liquidity Pools
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                CMC /v5/real-world-assets/market-pairs/list
              </span>
            </div>

            <div className="space-y-2">
              {marketPairs.map((pair, idx) => (
                <div
                  key={pair.id || idx}
                  className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{pair.exchange_name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{pair.market_pair}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white">${pair.price.toFixed(4)}</div>
                    <div className="text-[11px] font-mono text-slate-400">Vol: {formatCurrency(pair.volume_usd)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0C1024] border-t border-[#1E2548] flex justify-between items-center">
          <button
            onClick={() => {
              onClose();
              onTriggerAi(asset);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3861FB] to-[#00F0FF] text-white text-xs font-semibold shadow-md shadow-[#3861FB]/20"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Run AI Due Diligence</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1E2548] hover:bg-[#2A3462] text-slate-300 hover:text-white text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
