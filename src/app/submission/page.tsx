import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Setup | Birdeye Token Radar",
  description: "Birdeye Token Radar setup details, API coverage, and local run instructions.",
};

const ENDPOINTS_USED = [
  { path: "/defi/token_trending", description: "Trending Solana tokens with price, volume, and liquidity movement" },
  { path: "/v2/tokens/new_listing", description: "Fresh Solana listings with token metadata" },
  { path: "/defi/token_security", description: "Mint authority, freeze authority, ownership, and holder concentration checks" },
];

const X_POST_TEMPLATE = `Using Birdeye Data API to track Solana token movement.

Birdeye Token Radar combines trending tokens, new listings, liquidity signals, and token security checks into a single watchlist.

Live app: <demo-url>
Source: <repo-url>`;

function Panel({ children, title, eyebrow }: { children: ReactNode; title: string; eyebrow: string }) {
  return (
    <section className="birdeye-card rounded-3xl p-6">
      <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#00c98b]">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-[#adb4c1]">{children}</div>
    </section>
  );
}

export default function SubmissionPage() {
  return (
    <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 overflow-hidden rounded-[2rem] border border-[#82f8fd]/15 bg-[#00191a]/80 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
        <div className="inline-flex rounded-full border border-[#00c98b]/30 bg-[#00c98b]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#82f8fd]">
          Birdeye Data API
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">Radar setup</h1>
        <p className="mt-4 max-w-2xl text-[#adb4c1]">
          Everything needed to run Birdeye Token Radar with live Solana market data: API coverage, credentials, local commands, and link placeholders.
        </p>
      </header>

      <div className="grid gap-5">
        <Panel eyebrow="Product" title="What it does">
          <p>
            <strong className="text-white">Birdeye Token Radar</strong> is a Next.js app for monitoring new and trending Solana tokens with Birdeye Data API. Tokens are ranked with a readable score based on liquidity, 24-hour volume, price movement, and security checks.
          </p>
        </Panel>

        <Panel eyebrow="API coverage" title="Birdeye endpoints">
          <ul className="grid gap-3 md:grid-cols-3">
            {ENDPOINTS_USED.map((endpoint) => (
              <li key={endpoint.path} className="rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/65 p-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#03a9b0]">GET</span>
                <code className="mt-2 block break-all font-mono text-sm text-[#82f8fd]">{endpoint.path}</code>
                <p className="mt-3 text-xs leading-5 text-[#939eae]">{endpoint.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-xs text-[#59d4a4]">
            Base URL: https://public-api.birdeye.so · Chain header: x-chain: solana
          </p>
        </Panel>

        <Panel eyebrow="Evidence" title="API call log">
          <ul className="space-y-2 text-[#adb4c1]">
            <li>• 1 call to <code className="text-[#82f8fd]">/defi/token_trending</code> for trending tokens</li>
            <li>• 1 call to <code className="text-[#82f8fd]">/v2/tokens/new_listing</code> for new listings</li>
            <li>• Up to 10 calls to <code className="text-[#82f8fd]">/defi/token_security</code> for scored tokens</li>
            <li>• Each refresh can produce up to 12 Birdeye API calls</li>
          </ul>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/80 p-4 font-mono text-sm text-[#82f8fd]">
{`BIRDEYE_API_KEY=your_key npm run birdeye:warmup`}
          </pre>
          <p className="mt-2 text-xs text-[#939eae]">
            The warmup script writes a summary to <code>data/api-call-log.json</code>. Without credentials it runs in dry-run mode.
          </p>
        </Panel>

        <Panel eyebrow="Links" title="App links">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/65 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#939eae]">GitHub repo</p>
              <p className="mt-2 italic text-[#adb4c1]"><a href="https://github.com/OplopUser/birdeye-token-radar" target="_blank" rel="noopener noreferrer" className="underline decoration-[#00c98b]/50 underline-offset-4 hover:text-[#82f8fd]">github.com/OplopUser/birdeye-token-radar</a></p>
            </div>
            <div className="rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/65 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#939eae]">Live app</p>
              <p className="mt-2 italic text-[#adb4c1]"><a href="https://birdeye-data-4-week-bip-competition.vercel.app" target="_blank" rel="noopener noreferrer" className="underline decoration-[#00c98b]/50 underline-offset-4 hover:text-[#82f8fd]">birdeye-data-4-week-bip-competition.vercel.app</a></p>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Share copy" title="X post">
          <pre className="overflow-x-auto rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/80 p-4 font-mono text-sm leading-7 text-[#82f8fd]">
            {X_POST_TEMPLATE}
          </pre>
          <p className="mt-2 text-xs text-[#939eae]">
            Replace the links, tag <strong className="text-white">@birdeye_data</strong>, and include <strong className="text-white">#BirdeyeAPI</strong> if you post it.
          </p>
        </Panel>

        <Panel eyebrow="Run locally" title="Local setup">
          <ol className="list-decimal space-y-2 pl-6">
            <li>Run <code className="text-[#82f8fd]">npm install</code></li>
            <li>Copy <code className="text-[#82f8fd]">.env.example</code> to <code className="text-[#82f8fd]">.env.local</code></li>
            <li>Add <code className="text-[#82f8fd]">BIRDEYE_API_KEY</code></li>
            <li>Run <code className="text-[#82f8fd]">npm run dev</code></li>
            <li>Open <code className="text-[#82f8fd]">http://localhost:3000</code></li>
          </ol>
        </Panel>
      </div>

      <footer className="py-10 text-center font-mono text-xs text-[#939eae]">
        <Link href="/" className="text-[#82f8fd] underline decoration-[#00c98b]/50 underline-offset-4 hover:text-white">
          ← Back to radar
        </Link>
        <span className="ml-4">Birdeye market data for Solana tokens</span>
      </footer>
    </main>
  );
}
