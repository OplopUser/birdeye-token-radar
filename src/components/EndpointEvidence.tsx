export function EndpointEvidence({ endpoints, generatedAt }: { endpoints: string[]; generatedAt: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:bg-gray-900">
      <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Endpoints Used</h3>
      <ul className="space-y-1">
        {endpoints.map((ep) => (
          <li key={ep} className="text-xs font-mono text-gray-600 dark:text-gray-400">
            GET <span className="text-blue-600">{ep}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-gray-500">
        Last generated: {new Date(generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
