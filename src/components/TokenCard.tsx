"use client"

import type { BirdeyeToken } from "@/lib/birdeye/types"
import type { RadarScore } from "@/lib/radar/scoring"

type Props = {
  token: BirdeyeToken
  score: RadarScore
  source: "trending" | "new_listing"
}

function sourceLabel(source: Props["source"]) {
  return source === "trending" ? "Trending" : "New Listing"
}

function shortMoney(value?: number) {
  if (value === undefined || Number.isNaN(value)) return null
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${Math.round(value).toLocaleString()}`
}

function scoreTone(total: number) {
  if (total >= 70) return "from-[#00c98b] to-[#82f8fd] text-[#00191a] shadow-[0_0_28px_rgba(0,201,139,0.28)]"
  if (total >= 40) return "from-[#f7c543] to-[#ffaa7b] text-[#241500] shadow-[0_0_28px_rgba(247,197,67,0.22)]"
  return "from-[#e95f6a] to-[#fe8c4e] text-white shadow-[0_0_28px_rgba(233,95,106,0.22)]"
}

export function TokenCard({ token, score, source }: Props) {
  const address = token.address || "unknown"
  const liquidity = shortMoney(token.liquidity)
  const volume = shortMoney(token.volume24hUSD)

  return (
    <article
      className="group birdeye-card relative overflow-hidden rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:border-[#00c98b]/45 hover:shadow-[0_30px_90px_rgba(0,201,139,0.16)]"
      aria-label={`Token ${token.symbol || address} with score ${score.total}`}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#00c98b]/10 blur-3xl transition group-hover:bg-[#03a9b0]/20" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#82f8fd]/15 bg-[#00191a]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#82f8fd]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00c98b] shadow-[0_0_14px_#00c98b]" />
            {sourceLabel(source)}
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            {token.symbol || address.slice(0, 8)}
          </h3>
          {token.name && <p className="mt-1 text-sm text-[#adb4c1]">{token.name}</p>}
          <p className="mt-2 max-w-[15rem] truncate font-mono text-[11px] text-[#59d4a4]/80">
            {address}
          </p>
        </div>
        <div className={`rounded-2xl bg-gradient-to-br ${scoreTone(score.total)} px-4 py-3 text-center`}>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Score</div>
          <div className="text-2xl font-black leading-none">{score.total}</div>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#82f8fd]/10 bg-[#00191a]/55 p-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#939eae]">Liquidity</p>
          <p className="mt-1 font-mono text-sm font-semibold text-white">{liquidity ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-[#82f8fd]/10 bg-[#00191a]/55 p-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#939eae]">24h Volume</p>
          <p className="mt-1 font-mono text-sm font-semibold text-white">{volume ?? "—"}</p>
        </div>
      </div>

      {score.reasons.length > 0 && (
        <div className="relative mt-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c98b]">Positive signals</p>
          <div className="flex flex-wrap gap-2">
            {score.reasons.map((reason) => (
              <span key={reason} className="rounded-full border border-[#00c98b]/25 bg-[#00c98b]/10 px-2.5 py-1 text-xs text-[#82f8fd]">
                {reason}
              </span>
            ))}
          </div>
        </div>
      )}

      {score.warnings.length > 0 && (
        <div className="relative mt-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f17c81]">Risk warnings</p>
          <div className="flex flex-wrap gap-2">
            {score.warnings.map((warning) => (
              <span key={warning} className="rounded-full border border-[#e95f6a]/30 bg-[#e95f6a]/10 px-2.5 py-1 text-xs text-[#ffaa7b]">
                {warning}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
