import { RadarDashboard } from "@/components/RadarDashboard"
import { getBirdeyeClient } from "@/lib/birdeye/client"
import { buildRadar } from "@/lib/radar/buildRadar"

// Fetch radar data server-side for initial load
async function getRadarData() {
  try {
    if (!process.env.BIRDEYE_API_KEY) {
      // Demo data when no API key
      return {
        generatedAt: new Date().toISOString(),
        endpointsUsed: [],
        items: [],
      }
    }
    return await buildRadar(getBirdeyeClient())
  } catch {
    // Return empty data if API fails
    return {
      generatedAt: new Date().toISOString(),
      endpointsUsed: [],
      items: [],
    }
  }
}

export default async function Home() {
  const data = await getRadarData()
  return <RadarDashboard initialData={data} />
}
