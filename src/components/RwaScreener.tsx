import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ExternalLink, Cpu, Info, ShieldCheck } from 'lucide-react';
import { RwaAsset, RwaQuoteItem } from '../types/cmc';
import { formatCurrency, formatPercent, getAssetTypeBadgeColor } from '../utils/formatters';

interface RwaScreenerProps {
  assets: RwaAsset[];
  quotes: Record<string, RwaQuoteItem>;
  loading: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectAsset: (asset: RwaAsset) => void;
  onTriggerAi: (asset: RwaAsset) => void;
}

export const RwaScreener: React.FC<RwaScreenerProps> = ({
  assets,
  quotes,
  loading,
  selectedCategory,
  setSelectedCategory,
  onSelectAsset,
  onTriggerAi,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'mcap' | 'volume' | 'price' | 'change'>('mcap');
  const [sortAsc, setSortAsc] = useState(false);

  const categories = [
    { id: 'all', label: 'All RWA Assets' },
    { id: 'government_security', label: 'US Treasuries & Bills' },
    { id: 'commodity', label: 'Commodities (Gold/Silver)' },
    { id: 'stock', label: 'Tokenized Equities' },
    { id: 'etf', label: 'Tokenized ETFs' },
    { id: 'real_estate', label: 'Real Estate' },
    { id: 'currency', label: 'Currencies' },
  ];

  // Filtering
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = selectedCategory === 'all' || asset.asset_type === selectedCategory;
    const matchesSearch =
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.issuer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  filteredAssets.sort((a, b) => {
    const quoteA = quotes[a.symbol] || quotes[String(a.rwa_id)];
    const quoteB = quotes[b.symbol] || quotes[String(b.rwa_id)];

    let valA = 0;
    let valB = 0;

    switch (sortField) {
      case 'mcap':
        valA = quoteA?.quote?.USD?.market_cap || 0;
        valB = quoteB?.quote?.USD?.market_cap || 0;
        break;
      case 'volume':
        valA = quoteA?.quote?.USD?.volume_24h || 0;
        valB = quoteB?.quote?.USD?.volume_24h || 0;
        break;
      case 'price':
        valA = quoteA?.quote?.USD?.price || 0;
        valB = quoteB?.quote?.USD?.price || 0;
        break;
      case 'change':
        valA = quoteA?.quote?.USD?.percent_change_24h || 0;
        valB = quoteB?.quote?.USD?.percent_change_24h || 0;
        break;
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  const toggleSort = (field: 'mcap' | 'volume' | 'price' | 'change') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[#12172E] p-4 rounded-2xl border border-[#1E2548]">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#3861FB] text-white'
                  : 'bg-[#080B1A] text-slate-400 hover:text-slate-200 border border-[#1E2548]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search RWA by symbol, issuer..."
            className="w-full bg-[#080B1A] border border-[#1E2548] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3861FB]"
          />
        </div>
      </div>

      {/* RWA Table */}
      <div className="terminal-card rounded-2xl border border-[#1E2548] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E2548] bg-[#0C1024]/75 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Asset</th>
                <th className="py-3.5 px-4">Sector</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('price')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('change')}
                >
                  <div className="flex items-center space-x-1">
                    <span>24h Change</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('mcap')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Market Cap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('volume')}
                >
                  <div className="flex items-center space-x-1">
                    <span>24h DEX/CEX Vol</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Issuer / Chain</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2548]/50 text-xs">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={9} className="py-4 px-4 bg-[#080B1A]/40">
                      <div className="h-4 bg-[#1E2548] rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No Real-World Assets found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset, index) => {
                  const quote = quotes[asset.symbol] || quotes[String(asset.rwa_id)];
                  const price = quote?.quote?.USD?.price;
                  const change24h = quote?.quote?.USD?.percent_change_24h;
                  const mcap = quote?.quote?.USD?.market_cap;
                  const vol = quote?.quote?.USD?.volume_24h;
                  const badge = getAssetTypeBadgeColor(asset.asset_type);

                  return (
                    <tr
                      key={asset.rwa_id || asset.symbol || index}
                      className="hover:bg-[#1A2244]/40 transition-colors cursor-pointer group"
                      onClick={() => onSelectAsset(asset)}
                    >
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#1E2548] border border-slate-700 flex items-center justify-center font-bold text-white text-[11px] group-hover:border-[#3861FB] transition-colors">
                            {asset.symbol ? asset.symbol.slice(0, 3) : 'RWA'}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-[#3861FB] transition-colors">
                              {asset.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {asset.symbol} <span className="text-slate-600">•</span> RWA-ID: {asset.rwa_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {asset.asset_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-white">
                        {price !== undefined ? formatCurrency(price, price < 2 ? 4 : 2) : '$1.0000'}
                      </td>
                      <td
                        className={`py-3.5 px-4 font-mono font-semibold ${
                          (change24h || 0) >= 0 ? 'text-[#16C784]' : 'text-[#EA3943]'
                        }`}
                      >
                        {formatPercent(change24h)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-200">
                        {formatCurrency(mcap)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {formatCurrency(vol)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">
                          {asset.issuer_name || 'Institutional Issuer'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {asset.platform?.name || 'Ethereum / Multi-chain'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onTriggerAi(asset)}
                            title="Run AI Due Diligence with Gemini & CMC MCP"
                            className="p-1.5 rounded-lg bg-[#3861FB]/10 text-[#3861FB] hover:bg-[#3861FB] hover:text-white transition-all"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectAsset(asset)}
                            title="View Asset Details"
                            className="p-1.5 rounded-lg bg-[#1E2548] text-slate-300 hover:text-white transition-all"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
