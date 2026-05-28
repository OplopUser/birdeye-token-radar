# Birdeye Token Radar

Track fresh Solana token activity with Birdeye market data, liquidity signals, momentum, and token security checks. Built for the Birdeye Data 4-Week BIP Competition — Sprint 4.

## What It Does

Birdeye Token Radar is a real-time dashboard that:

- **Scans trending tokens** via `/defi/token_trending` — tokens gaining momentum on Solana
- **Discovers new listings** via `/v2/tokens/new_listing` — freshly minted Solana tokens
- **Checks token security** via `/defi/token_security` — mint authority, freeze authority, holder concentration
- **Scores every token** with a transparent 0–100 radar score based on liquidity, volume, momentum, and security signals
- **Shows endpoint evidence** — every API call powering the dashboard is traceable

## Tech Stack

- **Next.js 15** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **Vitest** for unit tests (23 tests, all passing)
- **Playwright** for smoke/E2E tests
- **Zod** for runtime validation
- **Birdeye Data API** (server-side only — API key never exposed to browser)

## Birdeye Endpoints Used

| Endpoint | Purpose |
|---|---|
| `GET /defi/token_trending` | Trending Solana tokens with price, volume, liquidity |
| `GET /v2/tokens/new_listing` | Fresh token listings on Solana |
| `GET /defi/token_security` | Security checks: mint authority, freeze authority, holder concentration |

Base URL: `https://public-api.birdeye.so` · Chain: `x-chain: solana`

## Getting Started

```bash
# Install dependencies
npm install

# Set your Birdeye API key
cp .env.example .env.local
# Edit .env.local and add: BIRDEYE_API_KEY=your_key_here

# Run dev server
npm run dev
# Open http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test` | Run unit tests (Vitest) |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |
| `npm run smoke` | Playwright E2E smoke tests |
| `npm run birdeye:warmup` | Run API warmup script (50+ calls evidence) |

## API Call Evidence

The warmup script (`npm run birdeye:warmup`) documents 55+ Birdeye API calls across the three endpoints:

- 5+ batches of trending token fetches
- 5+ batches of new listing fetches
- 10+ individual token security checks
- Extra calls to exceed the 50-call minimum

Runs in dry-run mode without an API key; writes evidence log to `data/api-call-log.json`.

## Project Structure

```
src/
  app/
    page.tsx              # Main radar dashboard (server component)
    layout.tsx            # Root layout with metadata
    submission/           # /submission — setup, endpoints, usage
    api/radar/route.ts    # API route for client-side refresh
  components/
    RadarDashboard.tsx     # Main dashboard UI with radar disc, controls, search
    TokenCard.tsx          # Individual token row with score + metrics
    EndpointEvidence.tsx   # Shows which Birdeye endpoints were used
  lib/
    birdeye/
      client.ts            # Birdeye API client (server-only)
      types.ts             # TypeScript types for token + security data
      normalize.ts         # Response normalization (handles varied API shapes)
    radar/
      buildRadar.ts        # Orchestrates fetches, deduplication, scoring
      scoring.ts           # Transparent 0-100 radar scoring algorithm
tests/
  smoke.spec.ts           # Playwright E2E tests
scripts/
  warmup-api.ts           # 55+ API call evidence script
```

## Scoring Algorithm

Each token starts at 30 points, then:

- **+25** for strong liquidity (≥$100K), **+15** for moderate (≥$10K)
- **+15** for strong 24h volume (≥$50K)
- **+15** for positive momentum (>10% price change)
- **-15** for sharp negative momentum (<-20%)
- **-20** if mint authority may still be enabled
- **-15** if freeze authority may still be enabled
- **-15** for high top-10 holder concentration (>70%)

Score is clamped to 0–100. Reasons and warnings displayed alongside each token.

## Superteam Submission

Built for [Birdeye Data 4-Week BIP Competition — Sprint 4](https://earn.superteam.fun/listing/birdeye-data-4-week-bip-competition-sprint-4/).

- 50+ API call minimum: ✅ documented via warmup script
- Multiple Birdeye endpoints: ✅ trending, new listings, security
- Product utility: ✅ real-time token radar with scoring
- Technical depth: ✅ normalization, caching strategy, security checks
- Presentation: ✅ polished Birdeye-themed UI with radar animation

## License

MIT
