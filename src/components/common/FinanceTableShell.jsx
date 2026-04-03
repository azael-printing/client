export default function FinanceTableShell({ minWidth = 860, headers = [], loading = false, emptyText = "No data.", rowCount = 0, colSpan, children }) {
  return (
    <div className="mt-6 overflow-auto rounded-2xl border border-zinc-100">
      <table className="w-full table-fixed text-sm" style={{ minWidth }}>
        <thead className="bg-zinc-50 text-zinc-900">
          <tr className="text-left">
            {headers.map((header) => (
              <th key={header.key || header.label} className={`px-4 py-3 font-extrabold whitespace-nowrap ${header.className || ""}`.trim()}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {loading ? (
            <tr><td colSpan={colSpan || headers.length} className="px-4 py-6 text-zinc-500 font-semibold">Loading...</td></tr>
          ) : rowCount === 0 ? (
            <tr><td colSpan={colSpan || headers.length} className="px-4 py-6 text-zinc-500 font-semibold">{emptyText}</td></tr>
          ) : children}
        </tbody>
      </table>
    </div>
  );
}
