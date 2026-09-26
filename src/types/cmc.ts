export interface CmcStatus {
  timestamp: string;
  error_code: number;
  error_message: string | null;
  elapsed: number;
  credit_count: number;
  notice?: string | null;
}

export interface CmcResponse<T> {
  status: CmcStatus;
  data: T;
}

export type RwaAssetType = 'government_security' | 'commodity' | 'stock' | 'etf' | 'currency' | 'real_estate';

export interface RwaAsset {
  rwa_id: number;
  id?: number;
  name: string;
  symbol: string;
  slug: string;
  asset_type: RwaAssetType;
  issuer_id?: number;
  issuer_name?: string;
  backing_asset?: string;
  yield_rate?: number;
  nav_price?: number;
  market_price?: number;
  status?: string;
  platform?: {
    id: number;
    name: string;
    symbol: string;
    token_address: string;
  };
  contract_address?: string;
  date_added?: string;
  tags?: string[];
}

export interface QuoteCurrencyData {
  price: number;
  volume_24h: number;
  volume_change_24h?: number;
  percent_change_1h?: number;
  percent_change_24h?: number;
  percent_change_7d?: number;
  percent_change_30d?: number;
  market_cap: number;
  market_cap_dominance?: number;
  fully_diluted_market_cap?: number;
  last_updated: string;
}

export interface RwaQuoteItem {
  id: number;
  rwa_id?: number;
  name: string;
  symbol: string;
  slug: string;
  is_active: number;
  is_fiat?: number;
  last_updated: string;
  quote: {
    USD: QuoteCurrencyData;
    [currency: string]: QuoteCurrencyData;
  };
}

export interface RwaIssuerToken {
  rwa_id: number;
  name: string;
  symbol: string;
  asset_type: RwaAssetType;
  contract_address?: string;
  platform?: string;
}

export interface RwaIssuer {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  jurisdiction?: string;
  custodian?: string;
  auditor?: string;
  founded_year?: number;
  total_aum?: number;
  tokens?: RwaIssuerToken[];
}

export interface RwaMarketPair {
  id: string;
  exchange_id: number;
  exchange_name: string;
  market_pair: string;
  base_currency_symbol: string;
  quote_currency_symbol: string;
  price: number;
  volume_usd: number;
  effective_liquidity?: number;
  last_updated: string;
}

export interface GlobalMarketMetrics {
  active_cryptocurrencies: number;
  total_market_cap_usd: number;
  total_volume_24h_usd: number;
  btc_dominance: number;
  eth_dominance: number;
  rwa_market_cap_estimate?: number;
  last_updated: string;
}

export interface TelemetryCall {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  status: number;
  latencyMs: number;
  creditsUsed: number;
  environment: string;
  error?: string;
}
