import { describe, expect, it, vi, beforeEach } from "vitest"
import { BirdeyeClient } from "./client"

beforeEach(() => vi.restoreAllMocks())

describe("BirdeyeClient", () => {
  it("adds Birdeye API headers and solana chain header", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
    const client = new BirdeyeClient({ apiKey: "test-key", fetcher: fetchMock as any })
    await client.getTrendingTokens({ limit: 3 })
    const [, init] = fetchMock.mock.calls[0]
    expect(init.headers["X-API-KEY"]).toBe("test-key")
    expect(init.headers["x-chain"]).toBe("solana")
  })

  it("throws a helpful error on non-2xx responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => "bad key" })
    const client = new BirdeyeClient({ apiKey: "bad", fetcher: fetchMock as any })
    await expect(client.getTrendingTokens({ limit: 3 })).rejects.toThrow("Birdeye API error 401")
  })

  it("throws when no API key provided", () => {
    expect(() => new BirdeyeClient({ apiKey: "" })).toThrow("BIRDEYE_API_KEY is required")
  })
})
