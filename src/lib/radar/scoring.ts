import type { BirdeyeToken, TokenSecurity } from "../birdeye/types"

export type RadarScore = { total: number; reasons: string[]; warnings: string[] }

export function scoreToken(token: BirdeyeToken, security?: TokenSecurity): RadarScore {
  let total = 30
  const reasons: string[] = []
  const warnings: string[] = []

  if (!token.address) warnings.push("Missing token address")
  if ((token.liquidity ?? 0) >= 100_000) { total += 25; reasons.push("Strong liquidity") }
  else if ((token.liquidity ?? 0) >= 10_000) { total += 15; reasons.push("Moderate liquidity") }
  else warnings.push("Low or unknown liquidity")

  if ((token.volume24hUSD ?? 0) >= 50_000) { total += 15; reasons.push("Strong 24h volume") }
  if ((token.priceChange24hPercent ?? 0) > 10) { total += 15; reasons.push("Positive momentum") }
  if ((token.priceChange24hPercent ?? 0) < -20) { total -= 15; warnings.push("Sharp negative momentum") }

  if (security?.isMintable) { total -= 20; warnings.push("Mint authority may still be enabled") }
  if (security?.isFreezable) { total -= 15; warnings.push("Freeze authority may still be enabled") }
  if ((security?.top10HolderPercent ?? 0) > 70) { total -= 15; warnings.push("High top-holder concentration") }

  return { total: Math.max(0, Math.min(100, Math.round(total))), reasons, warnings }
}
