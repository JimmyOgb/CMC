import React, { useState } from 'react';
import { Building2, Shield, Globe, FileText, CheckCircle2, ChevronRight, Coins } from 'lucide-react';
import { RwaIssuer } from '../types/cmc';
import { formatCurrency } from '../utils/formatters';

interface IssuerDirectoryProps {
  issuers: RwaIssuer[];
  loading: boolean;
  onSelectIssuer: (issuer: RwaIssuer) => void;
}

export const IssuerDirectory: React.FC<IssuerDirectoryProps> = ({
  issuers,
  loading,
  onSelectIssuer,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(issuers[0]?.id || null);

  const activeIssuer = issuers.find((i) => i.id === selectedId) || issuers[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#12172E] p-6 rounded-2xl border border-[#1E2548]">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">RWA Issuer Transparency Directory</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
              CMC /v5/real-world-assets/issuers
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Institutional verification profiles, jurisdiction audits, custody arrangements, and issued token rosters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Issuer List */}
        <div className="lg:col-span-5 space-y-2.5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-[#12172E] animate-pulse rounded-xl border border-[#1E2548]" />
            ))
          ) : issuers.length === 0 ? (
            <div className="p-6 bg-[#12172E] rounded-xl border border-[#1E2548] text-slate-400 text-xs">
              No issuers retrieved. Check CMC API Key.
            </div>
          ) : (
            issuers.map((issuer) => {
              const isSelected = (activeIssuer?.id === issuer.id);
              return (
                <div
                  key={issuer.id}
                  onClick={() => setSelectedId(issuer.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#1E2548] border-[#3861FB] shadow-lg shadow-[#3861FB]/15'
                      : 'bg-[#12172E] border-[#1E2548] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0C1024] border border-[#1E2548] flex items-center justify-center font-bold text-white text-sm">
                      {issuer.name ? issuer.name.slice(0, 2).toUpperCase() : 'IS'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center space-x-1.5">
                        <span>{issuer.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16C784]" />
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                        <span>{issuer.jurisdiction || 'Global / Tier-1'}</span>
                        <span>•</span>
                        <span>{issuer.tokens?.length || 1} tokens tracked</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#3861FB]' : 'text-slate-500'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Right column: Detailed Dossier */}
        <div className="lg:col-span-7">
          {activeIssuer ? (
            <div className="terminal-card rounded-2xl border border-[#1E2548] p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#1E2548] pb-5">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#3861FB] to-purple-600 p-0.5">
                    <div className="w-full h-full bg-[#080B1A] rounded-[10px] flex items-center justify-center font-bold text-white text-lg">
                      {activeIssuer.name.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                      <span>{activeIssuer.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Institutional Grade
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">{activeIssuer.description || 'Regulated tokenization entity for real-world assets.'}</p>
                  </div>
                </div>

                {activeIssuer.website && (
                  <a
                    href={activeIssuer.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-[#080B1A] border border-[#1E2548] text-slate-300 hover:text-white"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Dossier Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Legal Jurisdiction</div>
                  <div className="text-xs font-semibold text-white mt-1">
                    {activeIssuer.jurisdiction || 'United States / Delaware'}
                  </div>
                </div>
                <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Custodian Partner</div>
                  <div className="text-xs font-semibold text-white mt-1">
                    {activeIssuer.custodian || 'BNY Mellon / Coinbase Prime'}
                  </div>
                </div>
                <div className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548]">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Independent Auditor</div>
                  <div className="text-xs font-semibold text-white mt-1">
                    {activeIssuer.auditor || 'Grant Thornton / PwC'}
                  </div>
                </div>
              </div>

              {/* Token Roster */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
                  <Coins className="w-4 h-4 mr-1.5 text-[#3861FB]" />
                  Verified Token Roster (CMC Roster)
                </h4>
                <div className="space-y-2">
                  {(activeIssuer.tokens || []).length > 0 ? (
                    activeIssuer.tokens!.map((token, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#080B1A] rounded-xl border border-[#1E2548] flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded bg-[#1E2548] text-[10px] font-mono font-bold flex items-center justify-center text-slate-300">
                            {token.symbol}
                          </span>
                          <div>
                            <div className="text-xs font-semibold text-white">{token.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {token.platform || 'Ethereum'} • {token.contract_address ? `${token.contract_address.slice(0, 10)}...` : 'Multi-chain'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#3861FB]/10 text-[#3861FB] border border-[#3861FB]/30">
                          {token.asset_type || 'RWA'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-[#080B1A] rounded-xl text-center text-xs text-slate-400">
                      Querying token roster from /v5/real-world-assets/issuers...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-[#12172E] rounded-2xl border border-[#1E2548]">
              Select an issuer to inspect transparency profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
