import { describe, expect, it } from "vitest"
import { scoreToken } from "./scoring"

describe("scoreToken", () => {
  it("rewards liquidity and positive momentum", () => {
    const score = scoreToken({ address: "A", liquidity: 100000, volume24hUSD: 50000, priceChange24hPercent: 15 })
    expect(score.total).toBeGreaterThan(60)
    expect(score.reasons.join(" ")).toContain("liquidity")
  })

  it("penalizes missing address", () => {
    const score = scoreToken({ address: "" })
    expect(score.total).toBeLessThan(40)
    expect(score.warnings).toContain("Missing token address")
  })

  it("penalizes mintable tokens", () => {
    const score = scoreToken({ address: "A", liquidity: 100000 }, { address: "A", isMintable: true, raw: {} })
    expect(score.warnings.some(w => w.includes("Mint authority"))).toBe(true)
  })

  it("penalizes freezable tokens", () => {
    const score = scoreToken({ address: "A", liquidity: 100000 }, { address: "A", isFreezable: true, raw: {} })
    expect(score.warnings.some(w => w.includes("Freeze authority"))).toBe(true)
  })

  it("penalizes high holder concentration", () => {
    const score = scoreToken({ address: "A" }, { address: "A", top10HolderPercent: 80, raw: {} })
    expect(score.warnings.some(w => w.includes("concentration"))).toBe(true)
  })

  it("caps score between 0 and 100", () => {
    const high = scoreToken({ address: "A", liquidity: 999999, volume24hUSD: 999999, priceChange24hPercent: 999 })
    expect(high.total).toBeLessThanOrEqual(100)

    const low = scoreToken({ address: "", liquidity: 0 }, { address: "", isMintable: true, isFreezable: true, top10HolderPercent: 99, raw: {} })
    expect(low.total).toBeGreaterThanOrEqual(0)
  })
})
