// Server-only module: Birdeye API key must never be exposed to the browser.
// Only import this from server components or API routes.

const BASE_URL = "https://public-api.birdeye.so"

type Fetcher = typeof fetch

export class BirdeyeClient {
  private apiKey: string
  private fetcher: Fetcher

  constructor(opts: { apiKey: string; fetcher?: Fetcher }) {
    if (!opts.apiKey) throw new Error("BIRDEYE_API_KEY is required")
    this.apiKey = opts.apiKey
    this.fetcher = opts.fetcher ?? fetch
  }

  private async get<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
    const url = new URL(path, BASE_URL)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value))
    })
    const res = await this.fetcher(url, {
      headers: {
        "X-API-KEY": this.apiKey,
        "x-chain": "solana",
        accept: "application/json",
      },
    } as RequestInit)
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new Error(`Birdeye API error ${res.status}: ${body.slice(0, 200)}`)
    }
    return res.json() as Promise<T>
  }

  getTrendingTokens({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) {
    return this.get<unknown>("/defi/token_trending", { limit, offset })
  }

  getNewListings({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) {
    return this.get<unknown>("/v2/tokens/new_listing", { limit, offset })
  }

  getTokenSecurity(address: string) {
    return this.get<unknown>("/defi/token_security", { address })
  }
}

export function getBirdeyeClient() {
  return new BirdeyeClient({ apiKey: process.env.BIRDEYE_API_KEY ?? "" })
}
