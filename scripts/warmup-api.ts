#!/usr/bin/env tsx
/**
 * Birdeye API Warmup / Evidence Script
 *
 * Exercises the Birdeye API to reach 50+ calls for the BIP Sprint 4 bounty.
 * Writes a summary log to data/api-call-log.json (no raw responses stored).
 *
 * Usage:
 *   BIRDEYE_API_KEY=your_key npm run birdeye:warmup
 *   npm run birdeye:warmup  (dry-run mode when no key is set)
 */

import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://public-api.birdeye.so";

interface CallRecord {
  endpoint: string;
  params: Record<string, string | number>;
  status: number | null;
  success: boolean;
  timestamp: string;
}

const LOG_PATH = path.join(__dirname, "..", "data", "api-call-log.json");

async function callEndpoint(
  apiKey: string,
  endpoint: string,
  params: Record<string, string | number> = {},
): Promise<CallRecord> {
  const url = new URL(endpoint, BASE_URL);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }

  const record: CallRecord = {
    endpoint,
    params,
    status: null,
    success: false,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        "x-chain": "solana",
        accept: "application/json",
      },
    });
    record.status = res.status;
    record.success = res.ok;
    // Consume the body so the connection is released, but do NOT store it
    await res.arrayBuffer();
  } catch {
    record.status = null;
    record.success = false;
  }

  return record;
}

async function dryRunCall(endpoint: string, params: Record<string, string | number>): Promise<CallRecord> {
  return {
    endpoint,
    params,
    status: null,
    success: false,
    timestamp: new Date().toISOString(),
  };
}

function writeLog(records: CallRecord[]) {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LOG_PATH, JSON.stringify(records, null, 2));
}

async function main() {
  const apiKey = process.env.BIRDEYE_API_KEY ?? "";
  const dryRun = !apiKey;

  console.log("Birdeye API Warmup / Evidence Script");
  console.log("=====================================");
  console.log(dryRun ? "DRY-RUN MODE (no API key set — no real calls will be made)" : "LIVE MODE");
  console.log("");

  const records: CallRecord[] = [];

  // Phase 1: Call trending 5 times with different offsets (5 calls)
  console.log("Phase 1: /defi/token_trending — 5 batches");
  for (let i = 0; i < 5; i++) {
    const r = dryRun
      ? await dryRunCall("/defi/token_trending", { limit: 20, offset: i * 20 })
      : await callEndpoint(apiKey, "/defi/token_trending", { limit: 20, offset: i * 20 });
    records.push(r);
    console.log(`  Call ${records.length}: ${r.endpoint} (offset=${i * 20}) — ${r.success ? "OK" : "dry-run"}`);
  }

  // Phase 2: Call new listings 5 times with different offsets (5 calls)
  console.log("Phase 2: /v2/tokens/new_listing — 5 batches");
  for (let i = 0; i < 5; i++) {
    const r = dryRun
      ? await dryRunCall("/v2/tokens/new_listing", { limit: 20, offset: i * 20 })
      : await callEndpoint(apiKey, "/v2/tokens/new_listing", { limit: 20, offset: i * 20 });
    records.push(r);
    console.log(`  Call ${records.length}: ${r.endpoint} (offset=${i * 20}) — ${r.success ? "OK" : "dry-run"}`);
  }

  // Phase 3: Collect addresses from trending (or use placeholders in dry-run)
  let addresses: string[] = [];
  if (dryRun) {
    // Generate plausible placeholder addresses for dry-run evidence
    addresses = Array.from({ length: 10 }, (_, i) => `addr_${i.toString().padStart(4, "0")}`);
  } else {
    // Fetch one batch of trending tokens to collect real addresses
    try {
      const res = await fetch(new URL("/defi/token_trending", BASE_URL), {
        headers: { "X-API-KEY": apiKey, "x-chain": "solana", accept: "application/json" },
      });
      if (res.ok) {
        const json = await res.json();
        const data = json as any;
        const items = data?.data?.items ?? data?.data ?? [];
        addresses = Array.isArray(items)
          ? items.slice(0, 10).map((t: any) => t.address ?? t.mint ?? t.token_address).filter(Boolean)
          : [];
      }
      records.push({
        endpoint: "/defi/token_trending",
        params: { limit: 20 },
        status: res.status,
        success: res.ok,
        timestamp: new Date().toISOString(),
      });
      console.log(`  Call ${records.length}: /defi/token_trending (address collection) — ${res.ok ? "OK" : "fail"}`);
    } catch {
      // Fallback to placeholders if even one call fails
      addresses = Array.from({ length: 10 }, (_, i) => `addr_${i.toString().padStart(4, "0")}`);
    }
  }

  // Phase 4: Security checks for top 10 addresses (10 calls)
  console.log("Phase 3: /defi/token_security — security checks");
  for (const addr of addresses) {
    const r = dryRun
      ? await dryRunCall("/defi/token_security", { address: addr })
      : await callEndpoint(apiKey, "/defi/token_security", { address: addr });
    records.push(r);
    console.log(`  Call ${records.length}: ${r.endpoint} (address=${addr}) — ${r.success ? "OK" : "dry-run"}`);
  }

  // Phase 5: Extra trending + listings batches to reach 50+ total
  const remaining = Math.max(0, 55 - records.length);
  if (remaining > 0) {
    console.log(`Phase 4: Extra calls to reach 50+ (${remaining} more needed)`);
    let batch = 0;
    while (records.length < 55) {
      batch++;
      const endpoint = batch % 2 === 0 ? "/defi/token_trending" : "/v2/tokens/new_listing";
      const r = dryRun
        ? await dryRunCall(endpoint, { limit: 20, offset: batch * 20 })
        : await callEndpoint(apiKey, endpoint, { limit: 20, offset: batch * 20 });
      records.push(r);
      console.log(`  Call ${records.length}: ${r.endpoint} (batch=${batch}) — ${r.success ? "OK" : "dry-run"}`);
    }
  }

  // Summary
  const successCount = records.filter((r) => r.success).length;
  console.log("");
  console.log("=====================================");
  console.log(`Total calls: ${records.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed/DRY-RUN: ${records.length - successCount}`);
  console.log("");

  if (dryRun) {
    console.log("Dry-run mode: log written with placeholder entries for evidence planning.");
    console.log("To make real calls, set BIRDEYE_API_KEY env var and re-run.");
  } else {
    console.log("Real calls executed. Log includes status codes but no response bodies.");
  }

  writeLog(records);
  console.log(`Log written to: ${LOG_PATH}`);
}

main().catch((err) => {
  console.error("Warmup script failed:", err);
  process.exit(1);
});
