"use client"

import { useState } from "react"
import type { RadarData } from "@/lib/radar/buildRadar"
import { TokenCard } from "./TokenCard"
import { EndpointEvidence } from "./EndpointEvidence"

type Props = { initialData: RadarData }

export function RadarDashboard({ initialData }: Props) {
  const [data, setData] = useState<RadarData>(initialData)
  const [minScore, setMinScore] = useState(0)
  const [hideWarnings, setHideWarnings] = useState(false)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/radar")
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refresh")
    } finally {
      setLoading(false)
    }
  }

  const filtered = data.items.filter((item) => {
    if (item.score.total < minScore) return false
    if (hideWarnings && item.score.warnings.length > 0) return false
    if (search) {
      const s = search.toLowerCase()
      return (
        item.token.symbol?.toLowerCase().includes(s) ||
        item.token.address.toLowerCase().includes(s) ||
        item.token.name?.toLowerCase().includes(s)
      )
    }
    return true
  })

  const highSignal = data.items.filter((item) => item.score.total >= 70).length
  const warnings = data.items.reduce((sum, item) => sum + item.score.warnings.length, 0)

  return (
    <main className="relative mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="relative overflow-hidden rounded-[2rem] border border-[#82f8fd]/15 bg-[#00191a]/80 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(0,201,139,0.24),transparent_30%),radial-gradient(circle_at_82%_6%,rgba(5,135,212,0.26),transparent_28%),linear-gradient(135deg,rgba(1,73,76,0.86),rgba(0,25,26,0.68))]" />
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full border border-[#82f8fd]/15 bg-[#03a9b0]/10 blur-2xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00c98b]/30 bg-[#00c98b]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#82f8fd]">
              <span className="h-2 w-2 rounded-full bg-[#00c98b] shadow-[0_0_18px_#00c98b]" />
              BIP Sprint 4 · Solana intelligence
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Birdeye Sprint Radar
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#adb4c1] sm:text-lg">
              A Birdeye-native token command center for new listings, trending momentum, liquidity checks,
              and security signals — styled like a high-contrast crypto data terminal instead of a starter app.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/65 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#939eae]">Tokens</p>
              <p className="mt-1 font-mono text-2xl font-black text-white">{data.items.length}</p>
            </div>
            <div className="rounded-2xl border border-[#00c98b]/20 bg-[#00c98b]/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#59d4a4]">High signal</p>
              <p className="mt-1 font-mono text-2xl font-black text-[#82f8fd]">{highSignal}</p>
            </div>
            <div className="rounded-2xl border border-[#f7c543]/20 bg-[#f7c543]/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#ffd885]">Warnings</p>
              <p className="mt-1 font-mono text-2xl font-black text-[#ffd885]">{warnings}</p>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="mt-5 rounded-2xl border border-[#e95f6a]/30 bg-[#e95f6a]/10 p-4 text-sm text-[#ffaa7b]" role="alert">
          {error}
        </div>
      )}

      <section className="birdeye-card sticky top-3 z-10 mt-5 rounded-3xl p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_15rem_11rem_auto] lg:items-center">
          <label className="relative block">
            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-[#939eae]">Search market</span>
            <input
              id="search"
              type="text"
              placeholder="Symbol, name, or address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#82f8fd]/15 bg-[#00191a]/80 px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-[#939eae]/55 focus:border-[#00c98b] focus:shadow-[0_0_0_3px_rgba(0,201,139,0.14)]"
            />
          </label>
          <label className="block">
            <span className="mb-2 flex justify-between text-[10px] font-black uppercase tracking-[0.24em] text-[#939eae]">
              Min score <b className="font-mono text-[#82f8fd]">{minScore}</b>
            </span>
            <input
              id="minScore"
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-[#00c98b]"
            />
          </label>
          <label className="flex h-full items-end gap-3 rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/55 px-4 py-3 text-sm text-[#adb4c1]">
            <input className="h-4 w-4 accent-[#00c98b]" type="checkbox" checked={hideWarnings} onChange={(e) => setHideWarnings(e.target.checked)} />
            Hide warnings
          </label>
          <button
            onClick={refresh}
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-[#00c98b] to-[#03a9b0] px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#00191a] shadow-[0_18px_48px_rgba(0,201,139,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </section>

      <section className="mt-6">
        {filtered.length === 0 ? (
          <div className="birdeye-card rounded-[2rem] p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#82f8fd]/15 bg-[#00c98b]/10 text-2xl">◉</div>
            <p className="text-2xl font-black text-white">No tokens found</p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#939eae]">
              Add a Birdeye API key for live data, refresh the radar, or lower the score threshold. The interface is ready for live token intelligence.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <TokenCard key={item.token.address} token={item.token} score={item.score} source={item.source} />
            ))}
          </div>
        )}
      </section>

      {data.endpointsUsed.length > 0 && (
        <div className="mt-6">
          <EndpointEvidence endpoints={data.endpointsUsed} generatedAt={data.generatedAt} />
        </div>
      )}

      <footer className="py-10 text-center font-mono text-xs text-[#939eae]">
        Built for Birdeye Data 4-Week BIP Competition Sprint 4 · Powered by Birdeye API
      </footer>
    </main>
  )
}
