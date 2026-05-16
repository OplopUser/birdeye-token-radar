import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { RadarDashboard } from "./RadarDashboard"

it("renders radar title and token cards", () => {
  render(
    <RadarDashboard
      initialData={{
        generatedAt: "now",
        endpointsUsed: ["/defi/token_trending"],
        items: [
          {
            token: { address: "A", symbol: "AAA" },
            score: { total: 80, reasons: ["Strong liquidity"], warnings: [] },
            source: "trending",
          },
        ],
      }}
    />,
  )
  expect(screen.getByRole("heading", { level: 1, name: /Birdeye Token Radar/i })).toBeInTheDocument()
  expect(screen.getByText(/AAA/)).toBeInTheDocument()
})

it("renders endpoint evidence panel", () => {
  render(
    <RadarDashboard
      initialData={{
        generatedAt: "now",
        endpointsUsed: ["/defi/token_trending", "/v2/tokens/new_listing"],
        items: [],
      }}
    />,
  )
  expect(screen.getByText(/Endpoints Used/i)).toBeInTheDocument()
})

it("shows empty state when no items", () => {
  render(
    <RadarDashboard
      initialData={{
        generatedAt: "now",
        endpointsUsed: [],
        items: [],
      }}
    />,
  )
  expect(screen.getByText(/No tokens/i)).toBeInTheDocument()
})
