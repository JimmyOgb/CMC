import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, CheckCircle2, AlertCircle, Copy, Check, Play, ExternalLink, ShieldCheck } from 'lucide-react';
import { CmcService } from '../services/cmcService';
import { TelemetryCall } from '../types/cmc';

export const ApiInspector: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<TelemetryCall | null>(null);
  const [customEndpoint, setCustomEndpoint] = useState('v5/real-world-assets/quotes/latest?symbols=BUIDL,OUSG,USDY');
  const [customResponse, setCustomResponse] = useState<any>(null);
  const [runningCustom, setRunningCustom] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const fetchTelemetry = async () => {
    try {
      const res = await CmcService.getTelemetry();
      if (res?.recent) {
        setTelemetry(res.recent);
        if (!selectedCall && res.recent.length > 0) {
          setSelectedCall(res.recent[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch telemetry:', err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRunCustom = async () => {
    setRunningCustom(true);
    setCustomResponse(null);
    try {
      const [endpoint, queryString] = customEndpoint.split('?');
      const params: Record<string, string> = {};
      if (queryString) {
        const searchParams = new URLSearchParams(queryString);
        searchParams.forEach((val, key) => {
          params[key] = val;
        });
      }

      const res = await CmcService.fetchEndpoint(endpoint, params);
      setCustomResponse(res);
      fetchTelemetry();
    } catch (err: any) {
      setCustomResponse({ error: err.message });
    } finally {
      setRunningCustom(false);
    }
  };

  const getCurlSnippet = (endpoint: string) => {
    const key = CmcService.getApiKey() || 'YOUR_CMC_PRO_API_KEY';
    const baseUrl = CmcService.getEnvironment() === 'sandbox'
      ? 'https://sandbox-api.coinmarketcap.com'
      : 'https://pro-api.coinmarketcap.com';
    return `curl -X GET "${baseUrl}/${endpoint}" \\
  -H "X-CMC_PRO_API_KEY: ${key}" \\
  -H "Accept: application/json"`;
  };

  const copyCurl = () => {
    const text = getCurlSnippet(customEndpoint);
    navigator.clipboard.writeText(text);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#12172E] p-6 rounded-2xl border border-[#1E2548] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#3861FB]/10 text-[#3861FB]">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Live API Telemetry & Call Inspector</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Zero-Mock Evidence
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time telemetry showing live HTTP status codes, latency, headers, and credit consumption directly against CoinMarketCap Pro API.
          </p>
        </div>

        <button
          onClick={fetchTelemetry}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-[#1E2548] text-slate-300 hover:text-white border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Interactive API Runner */}
      <div className="terminal-card rounded-2xl border border-[#1E2548] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
            <Play className="w-3.5 h-3.5 text-[#16C784] mr-1.5" />
            Live Endpoint Test Runner
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyCurl}
              className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#080B1A] text-slate-300 border border-[#1E2548] hover:border-slate-600 flex items-center space-x-1"
            >
              {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCurl ? 'Copied cURL' : 'Copy cURL'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center bg-[#080B1A] border border-[#1E2548] rounded-xl px-3 text-xs font-mono">
            <span className="text-slate-500 select-none mr-2">GET</span>
            <input
              type="text"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              placeholder="e.g. v5/real-world-assets/map?limit=10"
              className="flex-1 bg-transparent py-2.5 text-white focus:outline-none"
            />
          </div>
          <button
            onClick={handleRunCustom}
            disabled={runningCustom}
            className="px-5 py-2.5 rounded-xl bg-[#3861FB] hover:bg-[#2A4FD8] text-white text-xs font-semibold shadow-md shadow-[#3861FB]/25 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${runningCustom ? 'animate-spin' : ''}`} />
            <span>{runningCustom ? 'Executing...' : 'Execute Call'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
          <span className="text-slate-500 py-0.5">Presets:</span>
          {[
            'v5/real-world-assets/assets/list?limit=15',
            'v5/real-world-assets/map?limit=25',
            'v5/real-world-assets/issuers/list?limit=10',
            'v5/real-world-assets/quotes/latest?symbols=BUIDL,OUSG,PAXG',
            'v1/global-metrics/quotes/latest',
          ].map((preset) => (
            <button
              key={preset}
              onClick={() => setCustomEndpoint(preset)}
              className="px-2 py-0.5 rounded bg-[#080B1A] text-slate-300 border border-[#1E2548] hover:border-[#3861FB] hover:text-[#3861FB] transition-colors"
            >
              /{preset.split('?')[0].split('/').slice(-2).join('/')}
            </button>
          ))}
        </div>

        {/* Custom Runner Response */}
        {customResponse && (
          <div className="mt-3 bg-[#080B1A] p-4 rounded-xl border border-[#1E2548] space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center">
                Status: <strong className={customResponse.httpStatus === 200 ? 'text-emerald-400 ml-1' : 'text-rose-400 ml-1'}>
                  {customResponse.httpStatus || 200}
                </strong>
                <span className="mx-2">•</span>
                Latency: <strong className="text-white ml-1">{customResponse.latencyMs}ms</strong>
                <span className="mx-2">•</span>
                Credits Used: <strong className="text-[#3861FB] ml-1">{customResponse.status?.credit_count || 1}</strong>
              </span>
            </div>
            <pre className="max-h-72 overflow-y-auto text-slate-200 text-[11px] leading-relaxed">
              {JSON.stringify(customResponse.raw || customResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Real-time Telemetry Feed Table */}
      <div className="terminal-card rounded-2xl border border-[#1E2548] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1E2548] flex items-center justify-between bg-[#0C1024]/50">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Live Gateway Activity Feed ({telemetry.length} calls recorded)
          </span>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5" />
            Live WebSocket/HTTP Relay
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E2548] bg-[#080B1A] text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Method & Endpoint</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Environment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2548]/40 font-mono text-[11px]">
              {telemetry.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    No calls recorded yet. Make a request via the terminal or runner above!
                  </td>
                </tr>
              ) : (
                telemetry.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#1E2548]/40 cursor-pointer transition-colors"
                    onClick={() => setSelectedCall(item)}
                  >
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      <span className="text-[#3861FB] mr-1.5">{item.method}</span>
                      {item.endpoint}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status >= 200 && item.status < 300
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {item.status || 200}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{item.latencyMs}ms</td>
                    <td className="py-3 px-4 text-[#3861FB]">{item.creditsUsed}</td>
                    <td className="py-3 px-4 text-slate-400 capitalize">{item.environment}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
