import { describe, expect, it } from "vitest"
import { extractTokenList, normalizeToken } from "./normalize"

describe("Birdeye normalizers", () => {
  it("extracts arrays from data.items", () => {
    expect(extractTokenList({ data: { items: [{ address: "A", symbol: "AAA" }] } })).toHaveLength(1)
  })

  it("extracts arrays from data.tokens", () => {
    expect(extractTokenList({ data: { tokens: [{ address: "B", symbol: "BBB" }] } })).toHaveLength(1)
  })

  it("extracts arrays from data.list", () => {
    expect(extractTokenList({ data: { list: [{ address: "C" }] } })).toHaveLength(1)
  })

  it("extracts arrays from data directly", () => {
    expect(extractTokenList({ data: [{ address: "D" }] })).toHaveLength(1)
  })

  it("handles bare array", () => {
    expect(extractTokenList([{ address: "E" }])).toHaveLength(1)
  })

  it("returns empty for unknown shape", () => {
    expect(extractTokenList({ foo: "bar" })).toEqual([])
  })

  it("normalizes common token fields", () => {
    expect(normalizeToken({ address: "A", symbol: "SOLX", liquidity: 100, v24hUSD: 50 })).toMatchObject({
      address: "A",
      symbol: "SOLX",
      liquidity: 100,
      volume24hUSD: 50,
    })
  })

  it("normalizes snake_case fields", () => {
    expect(normalizeToken({ token_address: "B", tokenSymbol: "X", liquidityUSD: 200, volume_24h_usd: 300, price_change_24h_percent: -5 })).toMatchObject({
      address: "B",
      symbol: "X",
      liquidity: 200,
      volume24hUSD: 300,
      priceChange24hPercent: -5,
    })
  })
})
