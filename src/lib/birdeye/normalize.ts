import type { BirdeyeToken } from "./types"

export function extractTokenList(payload: unknown): unknown[] {
  const p = payload as any
  if (Array.isArray(p)) return p
  if (Array.isArray(p?.data)) return p.data
  if (Array.isArray(p?.data?.items)) return p.data.items
  if (Array.isArray(p?.data?.tokens)) return p.data.tokens
  if (Array.isArray(p?.data?.list)) return p.data.list
  return []
}

export function normalizeToken(raw: any): BirdeyeToken {
  return {
    address: String(raw.address ?? raw.token_address ?? raw.mint ?? ""),
    symbol: raw.symbol ?? raw.tokenSymbol,
    name: raw.name ?? raw.tokenName,
    logoURI: raw.logoURI ?? raw.logo_uri ?? raw.icon,
    liquidity: numberOrUndefined(raw.liquidity ?? raw.liquidityUSD),
    volume24hUSD: numberOrUndefined(raw.volume24hUSD ?? raw.v24hUSD ?? raw.volume_24h_usd),
    priceChange24hPercent: numberOrUndefined(raw.priceChange24hPercent ?? raw.priceChange24h ?? raw.price_change_24h_percent),
    createdAt: raw.createdAt ?? raw.created_at ?? raw.blockUnixTime,
  }
}

function numberOrUndefined(value: unknown): number | undefined {
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}
