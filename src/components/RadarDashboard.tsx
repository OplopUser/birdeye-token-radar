"use client"

import { useState, useEffect } from "react"
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

  return (
    <main className="mx-auto max-w-6xl p-4">
      {/* Hero */}
      <header className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold sm:text-3xl">Birdeye Sprint Radar</h1>
        <p className="mt-1 text-sm opacity-90">
          Discover new &amp; trending Solana tokens with transparent safety + momentum scoring.
        </p>
        <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
          BIP Sprint 4
        </span>
      </header>

      {/* Error state */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <label htmlFor="search" className="text-sm font-medium text-gray-600">Search:</label>
        <input
          id="search"
          type="text"
          placeholder="Symbol or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
        />
        <label htmlFor="minScore" className="text-sm font-medium text-gray-600">Min score:</label>
        <input
          id="minScore"
          type="range"
          min={0}
          max={100}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="w-24"
        />
        <span className="text-sm font-mono text-gray-700">{minScore}</span>
        <label className="flex items-center gap-1 text-sm text-gray-600">
          <input type="checkbox" checked={hideWarnings} onChange={(e) => setHideWarnings(e.target.checked)} />
          Hide warnings
        </label>
        <button
          onClick={refresh}
          disabled={loading}
          className="ml-auto rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Token grid */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
          <p className="text-lg font-medium">No tokens found</p>
          <p className="mt-1 text-sm">Try adjusting your filters or refresh the data.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <TokenCard key={item.token.address} token={item.token} score={item.score} source={item.source} />
          ))}
        </div>
      )}

      {/* Endpoint evidence */}
      {data.endpointsUsed.length > 0 && (
        <div className="mt-6">
          <EndpointEvidence endpoints={data.endpointsUsed} generatedAt={data.generatedAt} />
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-400">
        Built for Birdeye Data 4-Week BIP Competition Sprint 4 &middot; Data from Birdeye API
      </footer>
    </main>
  )
}
