import Link from "next/link";

export const metadata = {
  title: "Submission | Birdeye Sprint Radar",
  description: "Birdeye BIP Sprint 4 submission details: endpoints used, API call evidence, and X post template.",
};

const ENDPOINTS_USED = [
  { path: "/defi/token_trending", description: "Trending Solana tokens with volume and price-change data" },
  { path: "/v2/tokens/new_listing", description: "Recently listed Solana tokens with metadata" },
  { path: "/defi/token_security", description: "Security checks: mint authority, freeze authority, holder concentration" },
];

const X_POST_TEMPLATE = `Built Birdeye Sprint Radar for the @birdeye_data BIP Sprint 4 using #BirdeyeAPI.
It combines new listings, trending tokens, and security checks into a transparent token radar score.
Demo: <demo-url>
Repo: <repo-url>`;

function Panel({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow: string }) {
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
          BIP Sprint 4 submission pack
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">Submission Readiness</h1>
        <p className="mt-4 max-w-2xl text-[#adb4c1]">
          Birdeye Sprint Radar packages endpoint evidence, call-count proof, repo/demo placeholders, and a launch post into one judge-friendly page.
        </p>
      </header>

      <div className="grid gap-5">
        <Panel eyebrow="Product" title="Product Summary">
          <p>
            <strong className="text-white">Birdeye Sprint Radar</strong> is a full-stack Next.js web app that uses the Birdeye Data API
            to discover newly listed and trending Solana tokens. Each token receives an explainable radar score based on liquidity,
            24-hour volume, price momentum, and on-chain security checks including mint authority, freeze authority, and holder concentration.
          </p>
        </Panel>

        <Panel eyebrow="API coverage" title="Birdeye Endpoints Used">
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

        <Panel eyebrow="Evidence" title="API Call Evidence">
          <ul className="space-y-2 text-[#adb4c1]">
            <li>• 1 call to <code className="text-[#82f8fd]">/defi/token_trending</code> for trending tokens</li>
            <li>• 1 call to <code className="text-[#82f8fd]">/v2/tokens/new_listing</code> for new listings</li>
            <li>• Up to 10 calls to <code className="text-[#82f8fd]">/defi/token_security</code> for top scored tokens</li>
            <li>• Each refresh cycle produces up to 12 Birdeye API calls</li>
          </ul>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/80 p-4 font-mono text-sm text-[#82f8fd]">
{`BIRDEYE_API_KEY=your_key npm run birdeye:warmup`}
          </pre>
          <p className="mt-2 text-xs text-[#939eae]">
            The warmup script writes a summary log to <code>data/api-call-log.json</code> and includes a dry-run path for environments without credentials.
          </p>
        </Panel>

        <Panel eyebrow="Links" title="Demo & Repo">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/65 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#939eae]">GitHub repo</p>
              <p className="mt-2 italic text-[#adb4c1]">[replace with your repo URL]</p>
            </div>
            <div className="rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/65 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#939eae]">Demo URL</p>
              <p className="mt-2 italic text-[#adb4c1]">[replace with your Vercel/deployment URL]</p>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Launch copy" title="X / Twitter Post Template">
          <pre className="overflow-x-auto rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/80 p-4 font-mono text-sm leading-7 text-[#82f8fd]">
            {X_POST_TEMPLATE}
          </pre>
          <p className="mt-2 text-xs text-[#939eae]">
            Replace demo/repo links, tag <strong className="text-white">@birdeye_data</strong>, and use <strong className="text-white">#BirdeyeAPI</strong>.
          </p>
        </Panel>

        <Panel eyebrow="Judge flow" title="How to Run & Evaluate">
          <ol className="list-decimal space-y-2 pl-6">
            <li>Clone the repository and run <code className="text-[#82f8fd]">npm install</code></li>
            <li>Copy <code className="text-[#82f8fd]">.env.example</code> to <code className="text-[#82f8fd]">.env.local</code> and add <code className="text-[#82f8fd]">BIRDEYE_API_KEY</code></li>
            <li>Run <code className="text-[#82f8fd]">npm run dev</code></li>
            <li>Open <code className="text-[#82f8fd]">http://localhost:3000</code> for the live radar dashboard</li>
            <li>Run <code className="text-[#82f8fd]">npm test</code>, <code className="text-[#82f8fd]">npm run typecheck</code>, and <code className="text-[#82f8fd]">npm run build</code></li>
          </ol>
        </Panel>
      </div>

      <footer className="py-10 text-center font-mono text-xs text-[#939eae]">
        <Link href="/" className="text-[#82f8fd] underline decoration-[#00c98b]/50 underline-offset-4 hover:text-white">
          ← Back to Dashboard
        </Link>
        <span className="ml-4">Built for Birdeye Data 4-Week BIP Competition Sprint 4</span>
      </footer>
    </main>
  );
}
