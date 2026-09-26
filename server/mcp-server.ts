#!/usr/bin/env node
/**
 * CoinMarketCap Model Context Protocol (MCP) Server
 * Exposes live CMC Pro API endpoints (RWA, Quotes, Issuers, Market Pairs) as AI Agent tools
 */
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.CMC_PRO_API_KEY || '';
const BASE_URL = process.env.CMC_ENVIRONMENT === 'sandbox' 
  ? 'https://sandbox-api.coinmarketcap.com' 
  : 'https://pro-api.coinmarketcap.com';

async function callCmc(endpoint: string, params: Record<string, string | number> = {}) {
  const url = new URL(endpoint, BASE_URL);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.append(k, String(v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X-CMC_PRO_API_KEY': API_KEY,
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`CMC API HTTP ${res.status}: ${errorText}`);
  }
  return await res.json();
}

const TOOLS = [
  {
    name: 'cmc_get_rwa_assets',
    description: 'Fetch tracked Real-World Assets from CMC /v5/real-world-assets/assets/list with category filtering',
    inputSchema: {
      type: 'object',
      properties: {
        asset_type: {
          type: 'string',
          enum: ['government_security', 'commodity', 'stock', 'etf', 'real_estate', 'currency'],
          description: 'Category of Real World Asset'
        },
        limit: { type: 'number', description: 'Maximum number of items to return' }
      }
    }
  },
  {
    name: 'cmc_get_rwa_quotes',
    description: 'Get real-time quotes, market cap, and 24h volume for RWAs via /v5/real-world-assets/quotes/latest',
    inputSchema: {
      type: 'object',
      properties: {
        rwa_ids: { type: 'string', description: 'Comma separated CMC RWA IDs' },
        symbols: { type: 'string', description: 'Comma-separated symbols (e.g. BUIDL,OUSG,PAXG)' }
      }
    }
  },
  {
    name: 'cmc_get_rwa_issuers',
    description: 'Query RWA issuers and their token rosters via /v5/real-world-assets/issuers/list and /issuers',
    inputSchema: {
      type: 'object',
      properties: {
        issuer_id: { type: 'string', description: 'Specific issuer ID (optional)' }
      }
    }
  },
  {
    name: 'cmc_get_market_pairs',
    description: 'Get secondary DEX/CEX trading pairs for an RWA via /v5/real-world-assets/market-pairs/list',
    inputSchema: {
      type: 'object',
      properties: {
        rwa_id: { type: 'string', description: 'CMC RWA ID' }
      },
      required: ['rwa_id']
    }
  }
];

// Handle MCP JSON-RPC protocol
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};
      let resultData: any;

      if (!API_KEY) {
        throw new Error('CMC_PRO_API_KEY environment variable is not configured.');
      }

      switch (toolName) {
        case 'cmc_get_rwa_assets':
          resultData = await callCmc('/v5/real-world-assets/assets/list', args);
          break;
        case 'cmc_get_rwa_quotes':
          resultData = await callCmc('/v5/real-world-assets/quotes/latest', args);
          break;
        case 'cmc_get_rwa_issuers':
          if (args.issuer_id) {
            resultData = await callCmc('/v5/real-world-assets/issuers', { issuer_id: args.issuer_id });
          } else {
            resultData = await callCmc('/v5/real-world-assets/issuers/list', args);
          }
          break;
        case 'cmc_get_market_pairs':
          resultData = await callCmc('/v5/real-world-assets/market-pairs/list', { rwa_id: args.rwa_id });
          break;
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }

      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(resultData, null, 2)
            }
          ]
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else {
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        id,
        result: {}
      }) + '\n');
    }
  } catch (err: any) {
    process.stdout.write(JSON.stringify({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32603, message: err.message }
    }) + '\n');
  }
});
