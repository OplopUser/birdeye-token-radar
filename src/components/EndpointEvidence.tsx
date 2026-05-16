export function EndpointEvidence({ endpoints, generatedAt }: { endpoints: string[]; generatedAt: string }) {
  return (
    <section className="birdeye-card rounded-3xl p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#00c98b]">Birdeye API trace</p>
          <h3 className="mt-1 text-xl font-black tracking-tight text-white">Endpoints Used</h3>
        </div>
        <p className="font-mono text-xs text-[#939eae]">
          Last generated: {new Date(generatedAt).toLocaleString()}
        </p>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {endpoints.map((endpoint) => (
          <li key={endpoint} className="rounded-2xl border border-[#82f8fd]/12 bg-[#00191a]/65 p-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#03a9b0]">GET</span>
            <code className="mt-2 block break-all font-mono text-sm text-[#82f8fd]">{endpoint}</code>
          </li>
        ))}
      </ul>
    </section>
  )
}
