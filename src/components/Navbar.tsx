import React from 'react';
import { ShieldCheck, Key, Terminal, Cpu, Activity, Building, BarChart3, HelpCircle, ExternalLink, Sparkles } from 'lucide-react';
import { CmcService } from '../services/cmcService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenKeyModal: () => void;
  hasKey: boolean;
  environment: string;
  onToggleEnv: () => void;
  telemetryCount: number;
  onReplayIntro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenKeyModal,
  hasKey,
  environment,
  onToggleEnv,
  telemetryCount,
  onReplayIntro,
}) => {
  const tabs = [
    { id: 'overview', label: 'Terminal Overview', icon: BarChart3 },
    { id: 'screener', label: 'RWA Screener', icon: ShieldCheck },
    { id: 'issuers', label: 'Issuers & Rosters', icon: Building },
    { id: 'depeg', label: 'De-Peg & Liquidity', icon: Activity },
    { id: 'copilot', label: 'AI Risk Copilot', icon: Cpu },
    { id: 'telemetry', label: 'API Inspector', icon: Terminal, badge: telemetryCount },
    { id: 'feedback', label: 'CMC Feedback', icon: HelpCircle },
  ];

  return (
    <header className="border-b border-[#1E2548] bg-[#0C1024]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner for Hackathon branding */}
      <div className="bg-gradient-to-r from-[#3861FB]/20 via-[#1E2548]/40 to-[#00F0FF]/10 px-4 py-1.5 text-xs flex justify-between items-center border-b border-[#1E2548]/60">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#3861FB] text-white">
            #BuildwithCMC
          </span>
          <span className="text-slate-300 font-medium">
            CoinMarketCap Pro API Hackathon • Track: <strong className="text-white">Real World Assets (RWA)</strong>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
            Zero-Mock Mode Active (Live CMC Pro API)
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://coinmarketcap.com/api/documentation/pro-api-reference/real-world-assets"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white flex items-center text-[11px] transition-colors"
          >
            CMC RWA Docs <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          <a
            href="https://dorahacks.io/hackathon/coinmarketcap-api-202609/detail"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white flex items-center text-[11px] transition-colors"
          >
            DoraHacks <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3861FB] to-[#00F0FF] p-0.5 flex items-center justify-center shadow-lg shadow-[#3861FB]/20">
              <div className="w-full h-full bg-[#080B1A] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#3861FB]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white font-sans">
                  RWA<span className="text-[#3861FB]">Sentry</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1E2548] text-slate-300 border border-slate-700">
                  v5.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Institutional RWA Terminal & MCP Agent</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#3861FB] text-white shadow-md shadow-[#3861FB]/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E2548]/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#1E2548] text-[#3861FB]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar (Cinematic Intro, Environment & API Key) */}
          <div className="flex items-center space-x-2.5">
            {/* Cinematic 3D Intro Button */}
            <button
              onClick={onReplayIntro}
              title="Play 3D Anime Cinematic Introduction"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#3861FB]/50 bg-[#3861FB]/15 hover:bg-[#3861FB] text-white flex items-center space-x-1.5 font-medium transition-all shadow-md shadow-[#3861FB]/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF] animate-spin" />
              <span className="hidden sm:inline">Cinematic 3D</span>
            </button>

            {/* Environment Toggle */}
            <button
              onClick={onToggleEnv}
              title="Toggle API Environment: Production vs Sandbox"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#1E2548] bg-[#12172E] text-slate-300 hover:border-slate-600 flex items-center space-x-1.5 font-mono"
            >
              <span className={`w-2 h-2 rounded-full ${environment === 'production' ? 'bg-[#16C784]' : 'bg-[#F5AC37]'}`} />
              <span className="capitalize">{environment}</span>
            </button>

            {/* API Key Status / Config */}
            <button
              onClick={onOpenKeyModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                hasKey
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{hasKey ? 'Autonomous Pro Active' : 'Enter CMC API Key'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
