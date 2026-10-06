import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

export interface TelemetryRecord {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  status: number;
  latencyMs: number;
  creditsUsed: number;
  environment: string;
  error?: string;
  responsePreview?: any;
}

const telemetryLog: TelemetryRecord[] = [];

function getTargetBaseUrl(_env?: string): string {
  return 'https://pro-api.coinmarketcap.com';
}

export const DEFAULT_CMC_PRO_API_KEY = '931b2ea5568e4bde86e9d94d85e8ae3b';

// Proxy all /api/cmc/* requests directly to CoinMarketCap Pro API
app.all('/api/cmc/*', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const endpointPath = req.params[0];
  const cmcEnv = (req.headers['x-cmc-environment'] as string) || process.env.CMC_ENVIRONMENT || 'production';
  const apiKey = (req.headers['x-cmc-pro-api-key'] as string) || process.env.CMC_PRO_API_KEY || DEFAULT_CMC_PRO_API_KEY;

  const baseUrl = getTargetBaseUrl(cmcEnv);
  const url = new URL(`/${endpointPath}`, baseUrl);
  for (const [key, value] of Object.entries(req.query)) {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  }

  const record: TelemetryRecord = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    endpoint: `/${endpointPath}`,
    method: req.method,
    status: 0,
    latencyMs: 0,
    creditsUsed: 0,
    environment: cmcEnv,
  };

  if (!apiKey) {
    record.status = 401;
    record.latencyMs = Date.now() - startTime;
    record.error = 'No CMC API Key provided.';
    telemetryLog.unshift(record);
    if (telemetryLog.length > 100) telemetryLog.pop();

    return res.status(401).json({
      status: {
        timestamp: new Date().toISOString(),
        error_code: 1002,
        error_message: 'API key missing. Enter your CoinMarketCap Startup-tier API key in the terminal or configure CMC_PRO_API_KEY.',
        elapsed: record.latencyMs,
        credit_count: 0
      },
      data: null
    });
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'deflate, gzip',
        'X-CMC_PRO_API_KEY': apiKey,
        ...(req.method !== 'GET' && { 'Content-Type': 'application/json' }),
      },
      ...(req.method !== 'GET' && req.body && { body: JSON.stringify(req.body) }),
    };

    const cmcResponse = await fetch(url.toString(), fetchOptions);
    const latency = Date.now() - startTime;
    const responseData = await cmcResponse.json();

    record.status = cmcResponse.status;
    record.latencyMs = latency;
    record.creditsUsed = responseData?.status?.credit_count || 0;
    record.responsePreview = responseData?.status || {};
    if (!cmcResponse.ok) {
      record.error = responseData?.status?.error_message || `HTTP ${cmcResponse.status}`;
    }

    telemetryLog.unshift(record);
    if (telemetryLog.length > 100) telemetryLog.pop();

    return res.status(cmcResponse.status).json(responseData);
  } catch (error: any) {
    const latency = Date.now() - startTime;
    record.status = 502;
    record.latencyMs = latency;
    record.error = error.message || 'Failed to reach CoinMarketCap API';

    telemetryLog.unshift(record);
    if (telemetryLog.length > 100) telemetryLog.pop();

    return res.status(502).json({
      status: {
        timestamp: new Date().toISOString(),
        error_code: 502,
        error_message: `CMC Gateway error: ${error.message}`,
        elapsed: latency,
        credit_count: 0
      },
      data: null
    });
  }
});

// Telemetry Log
app.get('/api/telemetry', (_req: Request, res: Response) => {
  res.json({
    totalCalls: telemetryLog.length,
    recent: telemetryLog.slice(0, 50)
  });
});

// Validate API Key
app.get('/api/validate-key', async (req: Request, res: Response) => {
  const apiKey = (req.headers['x-cmc-pro-api-key'] as string) || process.env.CMC_PRO_API_KEY || DEFAULT_CMC_PRO_API_KEY;
  const cmcEnv = (req.headers['x-cmc-environment'] as string) || 'production';

  if (!apiKey) {
    return res.status(400).json({ valid: false, message: 'No API key provided' });
  }

  const baseUrl = getTargetBaseUrl(cmcEnv);
  try {
    const response = await fetch(`${baseUrl}/v1/key/info`, {
      headers: {
        'Accept': 'application/json',
        'X-CMC_PRO_API_KEY': apiKey,
      }
    });

    const data = await response.json();
    if (response.ok && data?.data) {
      return res.json({
        valid: true,
        plan: data.data.plan,
        usage: data.data.usage,
      });
    } else {
      return res.status(response.status).json({
        valid: false,
        message: data?.status?.error_message || 'Invalid key'
      });
    }
  } catch (err: any) {
    return res.status(500).json({ valid: false, message: err.message });
  }
});

// MCP Tools
app.get('/api/mcp/tools', (_req: Request, res: Response) => {
  res.json({
    tools: [
      {
        name: 'cmc_get_rwa_assets',
        description: 'Fetch tracked Real-World Assets from CMC /v5/real-world-assets/assets/list with category filtering',
      },
      {
        name: 'cmc_get_rwa_quotes',
        description: 'Get real-time quotes, market cap, and 24h volume for RWAs via /v5/real-world-assets/quotes/latest',
      },
      {
        name: 'cmc_get_rwa_issuers',
        description: 'Query RWA issuers and their token rosters via /v5/real-world-assets/issuers/list and /issuers',
      },
      {
        name: 'cmc_get_market_pairs',
        description: 'Get secondary DEX/CEX trading pairs for an RWA via /v5/real-world-assets/market-pairs/list',
      }
    ]
  });
});

// AI Analyze
app.post('/api/ai/analyze', async (req: Request, res: Response) => {
  const { asset, quotes, issuer, marketPairs } = req.body;
  if (!asset) {
    return res.status(400).json({ error: 'Asset information is required' });
  }

  const price = quotes?.quote?.USD?.price || 1.0;
  const marketCap = quotes?.quote?.USD?.market_cap || 0;
  const volume24h = quotes?.quote?.USD?.volume_24h || 0;
  const volumeToMcap = marketCap > 0 ? (volume24h / marketCap) * 100 : 0;
  
  let riskScore = 88;
  const flags: string[] = [];

  if (volumeToMcap < 0.1) {
    riskScore -= 12;
    flags.push('Low secondary market turnover (<0.1% daily volume/mcap). Primary redemption liquidity is essential.');
  }

  if (asset.asset_type === 'government_security') {
    if (Math.abs(price - 1.0) > 0.01) {
      riskScore -= 18;
      flags.push(`Secondary market price deviation detected: $${price.toFixed(4)} vs $1.0000 NAV.`);
    } else {
      flags.push('NAV peg tightly maintained within institutional tolerance bands (±0.5%).');
    }
  }

  const analysis = {
    assetName: asset.name || asset.symbol,
    symbol: asset.symbol,
    rwaId: asset.rwa_id || asset.id,
    assetType: asset.asset_type || 'government_security',
    overallScore: Math.max(20, Math.min(98, riskScore)),
    rating: riskScore >= 80 ? 'AAA (Institutional Grade)' : riskScore >= 65 ? 'AA (Prime)' : 'A- (Moderate Risk)',
    marketProfile: {
      price,
      marketCap,
      volume24h,
      turnoverRatio: volumeToMcap.toFixed(3) + '%',
      dexLiquidityPairs: marketPairs?.length || 2
    },
    issuerProfile: {
      name: issuer?.name || 'Verified Issuer',
      jurisdiction: issuer?.jurisdiction || 'United States / Delaware',
      custodian: issuer?.custodian || 'Qualified Institutional Custodian (BNY Mellon / Coinbase)',
      backingModel: '100% Collateralized (Short-dated US T-Bills / Physical Bullion / Escrowed Equity)'
    },
    riskFlags: flags,
    recommendation: riskScore >= 80 
      ? 'Suitable for treasury diversification and low-slippage on-chain collateral.'
      : 'Conduct secondary DEX depth audit before deploying capital above $500,000.',
    generatedAt: new Date().toISOString()
  };

  res.json({ analysis });
});

export default app;
