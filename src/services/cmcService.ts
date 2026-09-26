import { CmcResponse, RwaAsset, RwaQuoteItem, RwaIssuer, RwaMarketPair, GlobalMarketMetrics } from '../types/cmc';

const KEY_STORAGE_NAME = 'cmc_pro_api_key';
const ENV_STORAGE_NAME = 'cmc_environment';

export class CmcService {
  private static apiKey: string = localStorage.getItem(KEY_STORAGE_NAME) || '';
  private static environment: string = localStorage.getItem(ENV_STORAGE_NAME) || 'production';

  public static getApiKey(): string {
    return this.apiKey;
  }

  public static setApiKey(key: string): void {
    this.apiKey = key.trim();
    localStorage.setItem(KEY_STORAGE_NAME, this.apiKey);
  }

  public static getEnvironment(): string {
    return this.environment;
  }

  public static setEnvironment(env: 'production' | 'sandbox'): void {
    this.environment = env;
    localStorage.setItem(ENV_STORAGE_NAME, env);
  }

  private static getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'x-cmc-environment': this.environment,
    };
    if (this.apiKey) {
      headers['x-cmc-pro-api-key'] = this.apiKey;
    }
    return headers;
  }

  /**
   * Generic real API call proxying directly to CoinMarketCap Pro API
   */
  public static async fetchEndpoint<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<{
    data: T;
    status: any;
    raw: any;
    latencyMs: number;
    httpStatus: number;
  }> {
    const startTime = performance.now();
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `/api/cmc/${cleanEndpoint}${query.toString() ? `?${query.toString()}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const latencyMs = Math.round(performance.now() - startTime);
    const json = await res.json();

    return {
      data: json.data as T,
      status: json.status,
      raw: json,
      latencyMs,
      httpStatus: res.status,
    };
  }

  /**
   * Fetch Real-World Assets list via /v5/real-world-assets/assets/list
   */
  public static async getRwaAssets(assetType?: string, limit: number = 50) {
    const params: Record<string, string | number> = { limit };
    if (assetType && assetType !== 'all') {
      params['asset_type'] = assetType;
    }
    return this.fetchEndpoint<RwaAsset[]>('v5/real-world-assets/assets/list', params);
  }

  /**
   * Fetch RWA ID Map via /v5/real-world-assets/map
   */
  public static async getRwaMap(limit: number = 100) {
    return this.fetchEndpoint<any[]>('v5/real-world-assets/map', { limit });
  }

  /**
   * Fetch Latest Quotes for RWAs via /v5/real-world-assets/quotes/latest
   */
  public static async getRwaQuotes(rwaIds?: string, symbols?: string) {
    const params: Record<string, string> = {};
    if (rwaIds) params['rwa_id'] = rwaIds;
    if (symbols) params['symbol'] = symbols;
    return this.fetchEndpoint<Record<string, RwaQuoteItem>>('v5/real-world-assets/quotes/latest', params);
  }

  /**
   * Fetch RWA Issuers List via /v5/real-world-assets/issuers/list
   */
  public static async getIssuersList(limit: number = 30) {
    return this.fetchEndpoint<RwaIssuer[]>('v5/real-world-assets/issuers/list', { limit });
  }

  /**
   * Fetch Specific Issuer Details via /v5/real-world-assets/issuers
   */
  public static async getIssuerDetails(issuerId: number | string) {
    return this.fetchEndpoint<RwaIssuer>('v5/real-world-assets/issuers', { issuer_id: issuerId });
  }

  /**
   * Fetch Secondary Market Pairs for an RWA via /v5/real-world-assets/market-pairs/list
   */
  public static async getMarketPairs(rwaId: number | string) {
    return this.fetchEndpoint<RwaMarketPair[]>('v5/real-world-assets/market-pairs/list', { rwa_id: rwaId });
  }

  /**
   * Fetch Global Market Metrics via /v1/global-metrics/quotes/latest
   */
  public static async getGlobalMetrics() {
    return this.fetchEndpoint<any>('v1/global-metrics/quotes/latest');
  }

  /**
   * Validate API Key status
   */
  public static async validateKey(): Promise<{ valid: boolean; plan?: any; usage?: any; message?: string }> {
    if (!this.apiKey) {
      return { valid: false, message: 'No API key entered' };
    }
    try {
      const res = await fetch('/api/validate-key', {
        headers: this.getHeaders(),
      });
      return await res.json();
    } catch (err: any) {
      return { valid: false, message: err.message };
    }
  }

  /**
   * Fetch Live Telemetry Log
   */
  public static async getTelemetry() {
    const res = await fetch('/api/telemetry');
    return await res.json();
  }

  /**
   * Run AI Analysis on an RWA
   */
  public static async analyzeAsset(payload: {
    asset: any;
    quotes?: any;
    issuer?: any;
    marketPairs?: any[];
  }) {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  }
}
