# DoraHacks Submission Form: RWASentry

## 1. Project Name
**RWASentry — Institutional Real-World Assets Terminal & MCP Agent**

## 2. Selected Track
**Real World Assets (RWA)**  
*(Also features full integration with the **AI Agents & Automation** track via Model Context Protocol / MCP)*

## 3. Short Description / Tagline
The first institutional RWA analytics terminal, de-peg radar, and autonomous AI due-diligence copilot powered natively by CoinMarketCap's newest `/v5/real-world-assets/*` Pro API suite.

## 4. Project Links
- **Live Deployed Web Application:** [https://cmc-rwasentry.vercel.app](https://cmc-rwasentry.vercel.app)
- **Public GitHub Repository:** [https://github.com/JimmyOgb/CMC](https://github.com/JimmyOgb/CMC)

## 5. Problem & Solution
### Problem:
Tokenized Real-World Assets (US Treasuries, Gold, Equities, Real Estate) now exceed $12B+ in market capitalization. However:
- Institutional investors suffer from fragmentation across disparate issuers (Securitize/BlackRock, Ondo, Backed, Superstate) and smart contract schemas.
- Secondary market DEX liquidity often trades at unpredictable premiums or discounts against underlying NAV, exposing treasuries to de-peg and liquidation slippage.
- AI agents lack standardized tools to query verified RWA metadata, issuer compliance dossiers, and secondary liquidity depth.

### Solution:
**RWASentry** solves this by unifying all tokenized real-world assets into a high-density, Bloomberg/Linear-grade terminal:
1. **Multi-Asset Screener:** Search and rank tokenized assets across 6 categories.
2. **NAV De-Peg & Liquidity Radar:** Real-time monitoring of secondary market price deviations relative to nominal NAV.
3. **Issuer Transparency Hub:** Complete profiles on issuers, custody partners (BNY Mellon, Coinbase), legal jurisdictions, and token rosters.
4. **AI Due Diligence Copilot:** Generates instant institutional tear sheets with collateral ratings, liquidity turnover analysis, and risk scoring.
5. **Model Context Protocol (MCP) Server (`cmc-mcp`):** Standard MCP interface allowing Claude Desktop, Cursor, and autonomous agents to query live CMC RWA tools.
6. **Live Telemetry & Telemetry Inspector:** Zero-mock console displaying live HTTP status, latency, headers, and credit consumption.

## 5. CoinMarketCap Endpoints Used
1. `/v5/real-world-assets/assets/list` — Multi-asset class screener and category filtering
2. `/v5/real-world-assets/map` — RWA asset ID resolution and namespace mapping
3. `/v5/real-world-assets/quotes/latest` — Real-time price, market cap, and 24h volume
4. `/v5/real-world-assets/issuers/list` — Directory of verified institutional issuers
5. `/v5/real-world-assets/issuers` — In-depth issuer details, custodian info, and token roster
6. `/v5/real-world-assets/market-pairs/list` — Secondary DEX pool liquidity and slippage analysis
7. `/v1/global-metrics/quotes/latest` — Macro market metrics and aggregate TVL
8. `/v1/key/info` — Live API key validation and quota auditing

## 6. Feedback for the CoinMarketCap Product Team

### What the API Made Possible:
- The `/v5/real-world-assets/*` suite is a game-changer. Unifying US Treasuries, Commodities, and Equities into a single clean schema saved weeks of custom indexing across 15+ blockchain protocols.
- The dedicated `/issuers` endpoint is fantastic for institutional compliance, making automated counterparty scoring possible.

### Where the API Got in the Way (Constructive Feedback):
1. **`rwa_id` vs `crypto_id` Namespace:** RWA assets use a distinct `rwa_id`. Cross-referencing against standard historical charts or cryptocurrency metadata requires manual lookup. Adding a `crypto_id` link inside the RWA object will streamline developer workflows.
2. **Yield / APY Field:** Tokenized Treasuries (BUIDL, USDY, OUSG) are yield products. Providing a standardized `yield_apy` field directly in `/quotes/latest` would make CMC the undisputed standard for on-chain fixed income.
3. **Official NAV Benchmark:** Providing an explicit `underlying_nav` field alongside `price` will enable immediate, automated de-peg calculations.

## 7. Submission Checklist
- [x] Public GitHub repository with MIT license
- [x] Working terminal demo with live API integration
- [x] Standalone Model Context Protocol (`cmc-mcp`) server
- [x] Live API call evidence (code and response payloads)
- [x] Endpoints named explicitly
- [x] Constructive product feedback memo for the CMC team
- [x] X/Twitter video post with `#BuildwithCMC`
