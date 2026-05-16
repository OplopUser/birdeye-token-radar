"use client"

import type { BirdeyeToken } from "@/lib/birdeye/types"
import type { RadarScore } from "@/lib/radar/scoring"

type Props = {
  token: BirdeyeToken
  score: RadarScore
  source: "trending" | "new_listing"
}

function shortMoney(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "—"
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${Math.round(value).toLocaleString()}`
}

function sourceLabel(source: Props["source"]) {
  return source === "trending" ? "TREND" : "NEW"
}

function tone(total: number) {
  if (total >= 70) return "text-[#00c98b] border-[#00c98b]/35 bg-[#00c98b]/10"
  if (total >= 40) return "text-[#f7c543] border-[#f7c543]/35 bg-[#f7c543]/10"
  return "text-[#e95f6a] border-[#e95f6a]/35 bg-[#e95f6a]/10"
}

export function TokenCard({ token, score, source }: Props) {
  const address = token.address || "unknown"
  return (
    <article
      className="group grid gap-3 border-b border-[#82f8fd]/10 px-1 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_5rem_6rem_6rem] sm:items-center"
      aria-label={`Token ${token.symbol || address} with score ${score.total}`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-black tracking-[0.18em] ${tone(score.total)}`}>
            {sourceLabel(source)}
          </span>
          <h3 className="truncate text-xl font-black tracking-[-0.03em] text-white group-hover:text-[#82f8fd]">
            {token.symbol || address.slice(0, 8)}
          </h3>
          {token.name && <span className="truncate text-sm text-[#939eae]">{token.name}</span>}
        </div>
        <p className="mt-1 truncate font-mono text-[11px] text-[#59d4a4]/75">{address}</p>
        {(score.reasons.length > 0 || score.warnings.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {score.reasons.slice(0, 2).map((reason) => (
              <span key={reason} className="rounded-full bg-[#00c98b]/10 px-2 py-0.5 text-[11px] text-[#82f8fd]">{reason}</span>
            ))}
            {score.warnings.slice(0, 2).map((warning) => (
              <span key={warning} className="rounded-full bg-[#e95f6a]/10 px-2 py-0.5 text-[11px] text-[#ffaa7b]">{warning}</span>
            ))}
          </div>
        )}
      </div>
      <div className="font-mono sm:text-right">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#939eae]">score</p>
        <p className="text-2xl font-black text-white">{score.total}</p>
      </div>
      <div className="font-mono sm:text-right">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#939eae]">liquidity</p>
        <p className="text-sm font-bold text-[#82f8fd]">{shortMoney(token.liquidity)}</p>
      </div>
      <div className="font-mono sm:text-right">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#939eae]">volume</p>
        <p className="text-sm font-bold text-[#82f8fd]">{shortMoney(token.volume24hUSD)}</p>
      </div>
    </article>
  )
}
