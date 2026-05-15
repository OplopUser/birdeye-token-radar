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

export default function SubmissionPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Submission Readiness
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Birdeye Sprint Radar &mdash; BIP Sprint 4 submission details
        </p>
      </header>

      {/* Product summary */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Product Summary</h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          <strong>Birdeye Sprint Radar</strong> is a full-stack Next.js web app that uses the Birdeye Data API
          to discover newly listed and trending Solana tokens. Each token receives a transparent, explainable
          radar score based on liquidity, 24-hour volume, price momentum, and on-chain security checks
          (mint authority, freeze authority, holder concentration). The dashboard provides real-time filtering,
          search, and an endpoint evidence panel showing exactly which API calls powered the results.
        </p>
      </section>

      {/* Endpoints used */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Birdeye Endpoints Used</h2>
        <ul className="mt-3 space-y-3">
          {ENDPOINTS_USED.map((ep) => (
            <li key={ep.path} className="rounded-lg border border-gray-100 p-3 dark:border-gray-700">
              <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                GET {ep.path}
              </code>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{ep.description}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          Base URL: <code>https://public-api.birdeye.so</code> &middot; Chain header: <code>x-chain: solana</code>
        </p>
      </section>

      {/* API call evidence */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">API Call Evidence</h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Each dashboard load makes multiple Birdeye API calls:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-gray-600 dark:text-gray-400">
          <li>1 call to <code>/defi/token_trending</code> (trending tokens)</li>
          <li>1 call to <code>/v2/tokens/new_listing</code> (new listings)</li>
          <li>Up to 10 calls to <code>/defi/token_security</code> (top tokens by score)</li>
          <li>Each refresh cycle = up to 12 calls</li>
        </ul>
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          To document 50+ calls for the bounty, run:
        </p>
        <pre className="mt-2 rounded bg-gray-100 p-3 text-sm font-mono dark:bg-gray-800">
          BIRDEYE_API_KEY=your_key npm run birdeye:warmup
        </pre>
        <p className="mt-1 text-xs text-gray-500">
          This script exercises the API and writes a summary log to <code>data/api-call-log.json</code>.
          It includes a <code>--dry-run</code> mode for environments without API credentials.
        </p>
      </section>

      {/* GitHub / Demo links */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Links</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <strong>GitHub repo:</strong>{" "}
            <span className="text-gray-500 italic">[replace with your repo URL]</span>
          </li>
          <li>
            <strong>Demo URL:</strong>{" "}
            <span className="text-gray-500 italic">[replace with your Vercel/deployment URL]</span>
          </li>
        </ul>
      </section>

      {/* X post template */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">X / Twitter Post Template</h2>
        <pre className="mt-3 rounded bg-gray-100 p-4 text-sm font-mono leading-relaxed text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          {X_POST_TEMPLATE}
        </pre>
        <p className="mt-2 text-xs text-gray-500">
          Replace <code>&lt;demo-url&gt;</code> and <code>&lt;repo-url&gt;</code> with your actual links.
          Tag <strong>@birdeye_data</strong> and use <strong>#BirdeyeAPI</strong>.
        </p>
      </section>

      {/* Instructions for judges */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">How to Run &amp; Evaluate</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm text-gray-700 dark:text-gray-300">
          <li>
            Clone the repository and run <code>npm install</code>
          </li>
          <li>
            Copy <code>.env.example</code> to <code>.env.local</code> and add your <code>BIRDEYE_API_KEY</code>
          </li>
          <li>
            Run the dev server: <code>npm run dev</code>
          </li>
          <li>
            Open <code>http://localhost:3000</code> to see the live radar dashboard
          </li>
          <li>
            Open <code>http://localhost:3000/submission</code> to view this submission page
          </li>
          <li>
            Run tests: <code>npm run test</code> (23 unit tests)
          </li>
          <li>
            Run typecheck: <code>npm run typecheck</code>
          </li>
          <li>
            Build for production: <code>npm run build</code>
          </li>
        </ol>
      </section>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-400">
        <Link href="/" className="underline hover:text-gray-600">
          &larr; Back to Dashboard
        </Link>
        <span className="ml-4">
          Built for Birdeye Data 4-Week BIP Competition Sprint 4
        </span>
      </footer>
    </main>
  );
}
