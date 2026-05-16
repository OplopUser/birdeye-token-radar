"use client"

import { useState } from "react"
import type { RadarData } from "@/lib/radar/buildRadar"
import { TokenCard } from "./TokenCard"
import { EndpointEvidence } from "./EndpointEvidence"

type Props = { initialData: RadarData }

const ORBIT_POINTS = [
  { left: "51%", top: "18%" },
  { left: "72%", top: "33%" },
  { left: "62%", top: "66%" },
  { left: "34%", top: "70%" },
  { left: "24%", top: "38%" },
  { left: "48%", top: "48%" },
]

export function RadarDashboard({ initialData }: Props) {
  const [data, setData] = useState<RadarData>(initialData)
  const [minScore, setMinScore] = useState(0)
  const [hideWarnings, setHideWarnings] = useState(false)
  const [searchDraft, setSearchDraft] = useState("")
  const [executedSearch, setExecutedSearch] = useState("")
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

  const executeSearch = async () => {
    setExecutedSearch(searchDraft.trim())
    await refresh()
  }

  const filtered = data.items.filter((item) => {
    if (item.score.total < minScore) return false
    if (hideWarnings && item.score.warnings.length > 0) return false
    if (executedSearch) {
      const s = executedSearch.toLowerCase()
      return (
        item.token.symbol?.toLowerCase().includes(s) ||
        item.token.address.toLowerCase().includes(s) ||
        item.token.name?.toLowerCase().includes(s)
      )
    }
    return true
  })

  const highSignal = data.items.filter((item) => item.score.total >= 70).length
  const warningCount = data.items.reduce((sum, item) => sum + item.score.warnings.length, 0)
  const orbitItems = filtered.slice(0, ORBIT_POINTS.length)

  return (
    <main className="relative mx-auto min-h-screen max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="grid gap-5">
          <header className="relative overflow-hidden rounded-[2.25rem] border border-[#82f8fd]/15 bg-[#00191a]/78 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.38)] sm:p-7">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 skew-x-[-14deg] border-l border-[#82f8fd]/10 bg-gradient-to-br from-[#00c98b]/12 via-[#03a9b0]/8 to-transparent lg:block" />
            <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-end">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-[#00c98b]/30 bg-[#00c98b]/10 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#82f8fd]">BIP Sprint 4</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#939eae]">not a portfolio · a triage instrument</span>
                </div>
                <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em] text-white sm:text-7xl lg:text-8xl">
                  Birdeye Sprint Radar
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-[#adb4c1] sm:text-base">
                  A signal-first scanner for fresh Solana listings. The interface is built around a radar sweep,
                  not another SaaS card wall: spot momentum, inspect risk, then refresh the Birdeye trace.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 xl:grid-cols-1">
                {[
                  ["tokens", data.items.length],
                  ["signals", highSignal],
                  ["warnings", warningCount],
                ].map(([label, value]) => (
                  <div key={label} className="border-l border-[#82f8fd]/16 bg-[#00191a]/45 px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#939eae]">{label}</p>
                    <p className="mt-1 font-mono text-3xl font-black text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          {error && <div className="rounded-2xl border border-[#e95f6a]/30 bg-[#e95f6a]/10 p-4 text-sm text-[#ffaa7b]" role="alert">{error}</div>}

          <section className="grid gap-5 xl:grid-cols-[minmax(25rem,0.92fr)_minmax(0,1.08fr)]">
            <div className="birdeye-panel relative min-h-[520px] overflow-hidden rounded-[2.25rem] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#00c98b]">Live sweep</p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-white">Market radar</h2>
                </div>
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="rounded-full border border-[#00c98b]/35 bg-[#00c98b]/10 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#82f8fd] transition hover:bg-[#00c98b]/20 disabled:opacity-50"
                >
                  {loading ? "sweeping" : "refresh"}
                </button>
              </div>

              <div className="radar-disc relative mx-auto mt-8 aspect-square max-w-[440px] overflow-hidden rounded-full border border-[#82f8fd]/20 shadow-[inset_0_0_60px_rgba(0,0,0,0.45),0_0_80px_rgba(0,201,139,0.12)]">
                <div className="radar-sweep absolute left-1/2 top-1/2 h-1/2 w-px origin-bottom bg-gradient-to-t from-[#00c98b] to-transparent shadow-[0_0_22px_#00c98b]" />
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#82f8fd]/10" />
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#82f8fd]/10" />
                {orbitItems.map((item, index) => {
                  const point = ORBIT_POINTS[index]
                  return (
                    <div key={item.token.address} className="signal-pulse absolute -translate-x-1/2 -translate-y-1/2" style={point}>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#00c98b]/40 bg-[#00191a]/85 text-center shadow-[0_0_26px_rgba(0,201,139,0.25)]">
                        <span className="font-mono text-[10px] font-black text-[#82f8fd]">{item.score.total}</span>
                      </div>
                    </div>
                  )
                })}
                {orbitItems.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                    <div className="mb-5 h-4 w-4 rounded-full bg-[#00c98b] shadow-[0_0_34px_#00c98b]" />
                    <p className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Scanner idle</p>
                    <p className="mt-2 max-w-xs text-xs leading-5 text-[#939eae]">No token signals are visible without live Birdeye data or looser filters.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="birdeye-panel rounded-[2.25rem] p-5">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#00c98b]">Signal tape</p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-white">Token queue</h2>
                </div>
                <span className="font-mono text-xs text-[#939eae]">{filtered.length} shown</span>
              </div>
              {filtered.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#82f8fd]/18 bg-[#00191a]/55 p-8 text-center">
                  <p className="text-xl font-black text-white">No tokens found</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#939eae]">Set a Birdeye API key, refresh, or lower the minimum score. Empty state stays honest — no fake tokens.</p>
                </div>
              ) : (
                <div>{filtered.map((item) => <TokenCard key={item.token.address} token={item.token} score={item.score} source={item.source} />)}</div>
              )}
            </div>
          </section>

          {data.endpointsUsed.length > 0 && <EndpointEvidence endpoints={data.endpointsUsed} generatedAt={data.generatedAt} />}
        </section>

        <aside className="birdeye-panel h-fit rounded-[2.25rem] p-5 lg:sticky lg:top-5">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#00c98b]">Controls</p>
          <div className="mt-5 space-y-5">
            <form
              className="block"
              onSubmit={(event) => {
                event.preventDefault()
                void executeSearch()
              }}
            >
              <label htmlFor="search">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#939eae]">search</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="search"
                  type="text"
                  placeholder="symbol / address"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  className="min-w-0 flex-1 border-0 border-b border-[#82f8fd]/20 bg-transparent px-0 py-3 font-mono text-sm text-white outline-none placeholder:text-[#939eae]/55 focus:border-[#00c98b]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full border border-[#00c98b]/40 bg-[#00c98b]/12 px-4 py-2 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-[#82f8fd] transition hover:bg-[#00c98b]/24 disabled:opacity-50"
                >
                  {loading ? "run" : "search"}
                </button>
              </div>
              {executedSearch && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#59d4a4]">
                  active query: {executedSearch}
                </p>
              )}
            </form>
            <label className="block">
              <span className="mb-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#939eae]">
                minimum score <b className="text-[#82f8fd]">{minScore}</b>
              </span>
              <input id="minScore" type="range" min={0} max={100} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-full accent-[#00c98b]" />
            </label>
            <label className="flex items-center justify-between gap-4 border-y border-[#82f8fd]/12 py-4 text-sm text-[#adb4c1]">
              <span>Hide warnings</span>
              <input className="h-5 w-5 accent-[#00c98b]" type="checkbox" checked={hideWarnings} onChange={(e) => setHideWarnings(e.target.checked)} />
            </label>
            <div className="rounded-2xl bg-[#00191a]/55 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#939eae]">trace</p>
              <p className="mt-2 text-sm leading-6 text-[#adb4c1]">Powered by Birdeye Data API. Endpoint evidence appears when live API calls return data.</p>
            </div>
          </div>
        </aside>
      </div>

      <footer className="py-8 text-center font-mono text-xs text-[#939eae]">
        Birdeye Data 4-Week BIP Competition Sprint 4 · Radar cockpit redesign
      </footer>
    </main>
  )
}
