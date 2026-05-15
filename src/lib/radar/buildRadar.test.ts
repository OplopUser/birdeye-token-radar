import { describe, expect, it } from "vitest"
import { buildRadar } from "./buildRadar"

describe("buildRadar", () => {
  it("combines trending and new listings into scored items", async () => {
    const client = {
      getTrendingTokens: async () => ({ data: { items: [{ address: "A", symbol: "AAA", liquidity: 100000 }] } }),
      getNewListings: async () => ({ data: { items: [{ address: "B", symbol: "BBB", liquidity: 50000 }] } }),
      getTokenSecurity: async () => ({ data: { isMintable: false } }),
    }
    const radar = await buildRadar(client as any)
    expect(radar.items.map((x) => x.token.address)).toEqual(["A", "B"])
    expect(radar.endpointsUsed).toContain("/defi/token_trending")
  })

  it("deduplicates tokens by address", async () => {
    const client = {
      getTrendingTokens: async () => ({ data: { items: [{ address: "A", symbol: "AAA", liquidity: 100000 }] } }),
      getNewListings: async () => ({ data: { items: [{ address: "A", symbol: "AAA", liquidity: 100000 }] } }),
      getTokenSecurity: async () => ({ data: { isMintable: false } }),
    }
    const radar = await buildRadar(client as any)
    expect(radar.items).toHaveLength(1)
  })

  it("includes generatedAt timestamp", async () => {
    const client = {
      getTrendingTokens: async () => ({ data: { items: [] } }),
      getNewListings: async () => ({ data: { items: [] } }),
      getTokenSecurity: async () => ({ data: {} }),
    }
    const radar = await buildRadar(client as any)
    expect(radar.generatedAt).toBeDefined()
  })
})
