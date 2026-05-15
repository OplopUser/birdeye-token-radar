"use client"

import type { BirdeyeToken } from "@/lib/birdeye/types"
import type { RadarScore } from "@/lib/radar/scoring"

type Props = {
  token: BirdeyeToken
  score: RadarScore
  source: "trending" | "new_listing"
}

function scoreColor(total: number) {
  if (total >= 70) return "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
  if (total >= 40) return "border-amber-500 bg-amber-50 dark:bg-amber-950"
  return "border-red-500 bg-red-50 dark:bg-red-950"
}

function scoreBadgeColor(total: number) {
  if (total >= 70) return "bg-emerald-500 text-white"
  if (total >= 40) return "bg-amber-500 text-white"
  return "bg-red-500 text-white"
}

export function TokenCard({ token, score, source }: Props) {
  return (
    <div
      className={`rounded-lg border-2 p-4 ${scoreColor(score.total)} shadow-sm transition-shadow hover:shadow-md`}
      role="article"
      aria-label={`Token ${token.symbol || token.address} with score ${score.total}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg">
          {token.symbol || token.address.slice(0, 8)}
        </h3>
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${scoreBadgeColor(score.total)}`}>
          {score.total}
        </span>
      </div>

      {token.name && <p className="text-sm text-gray-600 mb-1">{token.name}</p>}

      <div className="flex gap-2 mb-2">
        <span className="text-xs rounded bg-blue-100 px-2 py-0.5 text-blue-800">
          {source === "trending" ? "Trending" : "New Listing"}
        </span>
        {token.liquidity !== undefined && (
          <span className="text-xs rounded bg-purple-100 px-2 py-0.5 text-purple-800">
            Liq: ${token.liquidity >= 1_000_000 ? (token.liquidity / 1_000_000).toFixed(1) + "M" : token.liquidity >= 1_000 ? (token.liquidity / 1_000).toFixed(1) + "K" : token.liquidity}
          </span>
        )}
        {token.volume24hUSD !== undefined && (
          <span className="text-xs rounded bg-indigo-100 px-2 py-0.5 text-indigo-800">
            Vol: ${token.volume24hUSD >= 1_000_000 ? (token.volume24hUSD / 1_000_000).toFixed(1) + "M" : token.volume24hUSD >= 1_000 ? (token.volume24hUSD / 1_000).toFixed(1) + "K" : token.volume24hUSD}
          </span>
        )}
      </div>

      {score.reasons.length > 0 && (
        <div className="mb-1">
          <p className="text-xs font-medium text-emerald-700">Positives:</p>
          {score.reasons.map((r) => (
            <span key={r} className="inline-block text-xs rounded-full bg-emerald-100 px-2 py-0.5 mr-1 mb-1 text-emerald-800">
              {r}
            </span>
          ))}
        </div>
      )}

      {score.warnings.length > 0 && (
        <div>
          <p className="text-xs font-medium text-red-700">Warnings:</p>
          {score.warnings.map((w) => (
            <span key={w} className="inline-block text-xs rounded-full bg-red-100 px-2 py-0.5 mr-1 mb-1 text-red-800">
              {w}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
