import { extractTokenList, normalizeToken } from "../birdeye/normalize"
import { scoreToken } from "./scoring"
import type { BirdeyeToken, TokenSecurity } from "../birdeye/types"
import type { RadarScore } from "./scoring"

export type RadarItem = {
  token: BirdeyeToken
  score: RadarScore
  source: "trending" | "new_listing"
}

export type RadarData = {
  generatedAt: string
  endpointsUsed: string[]
  items: RadarItem[]
}

type MockClient = {
  getTrendingTokens: (opts: { limit?: number; offset?: number }) => Promise<unknown>
  getNewListings: (opts: { limit?: number; offset?: number }) => Promise<unknown>
  getTokenSecurity: (address: string) => Promise<unknown>
}

const MAX_SECURITY_FETCHES = 10 // control quota usage

export async function buildRadar(client: MockClient): Promise<RadarData> {
  const endpointsUsed: string[] = []

  // Fetch trending tokens
  const trendingRaw = await client.getTrendingTokens({ limit: 20 })
  endpointsUsed.push("/defi/token_trending")
  const trendingTokens = extractTokenList(trendingRaw).map(normalizeToken)

  // Fetch new listings
  const listingsRaw = await client.getNewListings({ limit: 20 })
  endpointsUsed.push("/v2/tokens/new_listing")
  const listingTokens = extractTokenList(listingsRaw).map(normalizeToken)

  // Deduplicate by address, trending first
  const seen = new Set<string>()
  const items: RadarItem[] = []

  for (const token of trendingTokens) {
    if (!seen.has(token.address) && token.address) {
      seen.add(token.address)
      items.push({ token, score: scoreToken(token), source: "trending" })
    }
  }

  for (const token of listingTokens) {
    if (!seen.has(token.address) && token.address) {
      seen.add(token.address)
      items.push({ token, score: scoreToken(token), source: "new_listing" })
    }
  }

  // Fetch security for top N addresses to control quota
  const addressesToCheck = items.slice(0, MAX_SECURITY_FETCHES).map(i => i.token.address)
  const securityCache = new Map<string, TokenSecurity>()

  for (const address of addressesToCheck) {
    try {
      const secRaw = await client.getTokenSecurity(address)
      const secData = secRaw as any
      endpointsUsed.push("/defi/token_security")
      securityCache.set(address, {
        address,
        isMintable: secData?.data?.is_mintable ?? secData?.isMintable,
        isFreezable: secData?.data?.is_freezable ?? secData?.isFreezable,
        ownerAddress: secData?.data?.owner_address ?? secData?.ownerAddress,
        top10HolderPercent: secData?.data?.top10_holder_percent ?? secData?.top10HolderPercent,
        raw: secRaw,
      })
    } catch {
      // Skip security if endpoint fails
    }
  }

  // Re-score with security data
  for (const item of items) {
    const security = securityCache.get(item.token.address)
    item.score = scoreToken(item.token, security)
  }

  // Sort by score descending
  items.sort((a, b) => b.score.total - a.score.total)

  return {
    generatedAt: new Date().toISOString(),
    endpointsUsed,
    items,
  }
}
