import { NextResponse } from "next/server"
import { getBirdeyeClient } from "@/lib/birdeye/client"
import { buildRadar } from "@/lib/radar/buildRadar"

export async function GET() {
  try {
    const data = await buildRadar(getBirdeyeClient())
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
