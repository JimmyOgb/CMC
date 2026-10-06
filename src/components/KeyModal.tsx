import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { CmcService, DEFAULT_CMC_PRO_API_KEY } from '../services/cmcService';

interface KeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const KeyModal: React.FC<KeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState(CmcService.getApiKey());
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid?: boolean;
    plan?: any;
    usage?: any;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(CmcService.getApiKey());
      setValidationResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    CmcService.setApiKey(apiKey);
    onKeySaved(apiKey);
    onClose();
  };

  const handleValidate = async () => {
    if (!apiKey.trim()) return;
    setValidating(true);
    setValidationResult(null);

    // Temporarily set to test
    const previous = CmcService.getApiKey();
    CmcService.setApiKey(apiKey.trim());

    try {
      const res = await CmcService.validateKey();
      setValidationResult(res);
      if (res.valid) {
        onKeySaved(apiKey.trim());
      } else {
        CmcService.setApiKey(previous);
      }
    } catch (err: any) {
      setValidationResult({ valid: false, message: err.message });
      CmcService.setApiKey(previous);
    } finally {
      setValidating(false);
    }
  };

  const handleClearKey = () => {
    setApiKey('');
    CmcService.setApiKey('');
    onKeySaved('');
    setValidationResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#12172E] border border-[#1E2548] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1E2548] flex justify-between items-center bg-[#0C1024]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#3861FB]/10 text-[#3861FB]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">CoinMarketCap API Key</h3>
              <p className="text-xs text-slate-400">Zero-Mock Live Gateway Connection</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-[#080B1A] border border-[#1E2548] rounded-xl p-3.5 text-xs text-slate-300">
            <p className="font-semibold text-white mb-1 flex items-center">
              <ShieldCheck className="w-4 h-4 text-[#16C784] mr-1.5" />
              Autonomous CMC Pro Integration Active
            </p>
            Connected autonomously to CoinMarketCap Pro API with key: <code className="text-[#00F0FF] font-mono select-all break-all">{DEFAULT_CMC_PRO_API_KEY}</code>. 
            No manual login is required. You may test connection or configure a custom API key below.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              CMC Pro API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your CoinMarketCap Pro API Key"
                className="w-full bg-[#080B1A] border border-[#1E2548] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3861FB] font-mono"
              />
            </div>
          </div>

          {/* Validation Result Box */}
          {validationResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                validationResult.valid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center font-semibold mb-1">
                {validationResult.valid ? (
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-1.5 text-rose-400" />
                )}
                {validationResult.valid ? 'Key Verified Successfully!' : 'Key Validation Failed'}
              </div>
              {validationResult.valid ? (
                <div className="mt-1 space-y-0.5 text-slate-300 font-mono text-[11px]">
                  <div>Plan: <span className="text-white font-bold">{validationResult.plan?.name || 'Pro'}</span></div>
                  <div>Monthly Credits: <span className="text-white font-bold">{validationResult.plan?.credit_limit_monthly?.toLocaleString()}</span></div>
                  <div>Credits Used: <span className="text-white">{validationResult.usage?.current_month?.credits_used?.toLocaleString() || 0}</span></div>
                </div>
              ) : (
                <p className="text-slate-300 mt-1">{validationResult.message}</p>
              )}
            </div>
          )}

          {/* Quick action option */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1E2548] text-xs">
            <div className="text-slate-400">
              Autonomous Pro Key Active
            </div>
            <div className="space-x-2 flex items-center">
              {apiKey !== DEFAULT_CMC_PRO_API_KEY && (
                <button
                  type="button"
                  onClick={() => {
                    setApiKey(DEFAULT_CMC_PRO_API_KEY);
                    CmcService.setApiKey(DEFAULT_CMC_PRO_API_KEY);
                    onKeySaved(DEFAULT_CMC_PRO_API_KEY);
                    setValidationResult(null);
                  }}
                  className="text-xs px-2.5 py-1 rounded bg-[#3861FB]/20 hover:bg-[#3861FB]/30 text-[#00F0FF] border border-[#3861FB]/40 font-medium transition-colors"
                >
                  Reset Default Key
                </button>
              )}
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="text-xs px-2.5 py-1 rounded bg-[#1E2548] hover:bg-[#2A3462] text-slate-300 font-medium transition-colors"
                >
                  Clear Key
                </button>
              )}
              <a
                href="https://coinmarketcap.com/api"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs text-[#3861FB] hover:underline"
              >
                CMC Portal <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0C1024] border-t border-[#1E2548] flex justify-between items-center">
          <button
            type="button"
            onClick={handleValidate}
            disabled={!apiKey.trim() || validating}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1E2548] text-slate-200 hover:bg-[#2A3462] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${validating ? 'animate-spin' : ''}`} />
            <span>{validating ? 'Validating...' : 'Test Connection'}</span>
          </button>

          <div className="space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#3861FB] hover:bg-[#2A4FD8] text-white shadow-md shadow-[#3861FB]/30"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
