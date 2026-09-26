# RWASentry: 2-Minute Demo Video Pitch Script

**Hashtag:** #BuildwithCMC  
**Target Video Duration:** 2 minutes to 2 minutes 30 seconds  
**Voiceover Tone:** Confident, institutional, clear, engaging.

---

### [0:00 - 0:25] The Hook & The Problem
* **Visual:** Open RWASentry terminal at `http://localhost:5173`. Show the dark Bloomberg-style dashboard with live KPI cards and asset class breakdown.
* **Voiceover:**  
  "Tokenized Real-World Assets—from BlackRock's BUIDL to Ondo US Treasuries and tokenized gold—are experiencing explosive growth, exceeding twelve billion dollars on-chain. But for institutional treasuries and DeFi protocols, the market is severely fragmented. Assets are scattered across multiple chains, secondary DEX pools frequently trade at dangerous discounts or premiums against NAV, and AI agents have had no standardized way to audit issuers and liquidity.  
  Today, we are thrilled to introduce **RWASentry**—the institutional RWA analytics terminal and Model Context Protocol agent built natively for the CoinMarketCap API Hackathon."

---

### [0:25 - 0:55] Live Terminal & Core Screener
* **Visual:** Click on the **RWA Screener** tab. Filter by 'US Treasuries & Bills', then 'Commodities'. Click into an asset like BUIDL or USDY to open the Asset Detail Modal showing contract addresses across chains and DEX market pairs.
* **Voiceover:**  
  "RWASentry is powered directly by CoinMarketCap's newest flagship **`/v5/real-world-assets/*`** suite. With our multi-asset screener, analysts can instantaneously filter across US Treasuries, Commodities, Tokenized Equities, and Real Estate.  
  By tapping into `/v5/real-world-assets/quotes/latest` and `/assets/list`, we provide real-time pricing, 24-hour turnover ratios, and contract addresses across Ethereum, Arbitrum, and Solana."

---

### [0:55 - 1:20] NAV De-Peg Radar & Issuer Hub
* **Visual:** Switch to **Issuers & Rosters** tab. Click on Securitize, Ondo, and Backed Finance to inspect custody banks and token rosters. Then switch to **De-Peg & Liquidity** tab.
* **Voiceover:**  
  "Under the hood, our **Issuer Directory** connects directly to `/v5/real-world-assets/issuers`, pulling verified entity profiles, legal jurisdictions, and custody arrangements with BNY Mellon and Morgan Stanley.  
  Meanwhile, our **NAV De-Peg Radar** continuously evaluates secondary DEX market prices against underlying par values. If a tokenized treasury deviates beyond institutional tolerance bands, RWASentry immediately flags the liquidity spread and inspects the underlying DEX pools."

---

### [1:20 - 1:45] AI Due Diligence Copilot & Model Context Protocol (MCP)
* **Visual:** Switch to **AI Risk Copilot** tab. Select BUIDL and click 'Generate Institutional Tear Sheet'. Show the score (e.g. 95/100 AAA) and copy the markdown report. Toggle 'View MCP Spec' to display the JSON-RPC tools.
* **Voiceover:**  
  "RWASentry isn't just a dashboard—it's an autonomous AI analyst. Our AI Copilot synthesizes live CMC quotes and issuer data into full institutional tear sheets with collateral ratings and risk flags.  
  Even better, we built a standalone **Model Context Protocol (MCP) server**, exposing CMC RWA endpoints directly to Claude Desktop, Cursor, and autonomous AI agents."

---

### [1:45 - 2:10] Zero-Mock Telemetry & CMC Product Feedback
* **Visual:** Click on **API Inspector** tab. Show the live feed of HTTP 200 calls, millisecond latencies, and credits used. Execute a live query in the runner. Then briefly show the **CMC Feedback** tab.
* **Voiceover:**  
  "RWASentry maintains a strict **zero-mock policy**. In our live API Inspector, you can verify every single HTTP request, latency timestamp, and credit consumed against CoinMarketCap Pro API.  
  We also included a dedicated feedback memo for the CMC team on how to elevate the v5 RWA endpoints even further."

---

### [2:10 - 2:20] Outro & Call to Action
* **Visual:** Return to the hero overview dashboard. Show GitHub repo link and #BuildwithCMC banner.
* **Voiceover:**  
  "RWASentry: institutional transparency for the tokenized economy, built with CoinMarketCap. Check out our public repo, test the live terminal, and thank you for watching!"
