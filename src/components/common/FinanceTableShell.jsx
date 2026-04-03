export default function FinanceTableShell({
  minWidth = 860,
  headers = [],
  loading = false,
  emptyText = "No data.",
  rowCount = 0,
  colSpan,
  children,
}) {
  return (
    <div className="mt-5 overflow-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full table-fixed text-sm" style={{ minWidth }}>
        <thead className="bg-bgLight text-left text-zinc-500">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key || header.label}
                className={`px-4 py-3 text-[13px] font-semibold whitespace-nowrap ${header.className || ""}`.trim()}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {loading ? (
            <tr>
              <td colSpan={colSpan || headers.length} className="px-4 py-6 text-sm font-semibold text-zinc-500">
                Loading...
              </td>
            </tr>
          ) : rowCount === 0 ? (
            <tr>
              <td colSpan={colSpan || headers.length} className="px-4 py-6 text-sm font-semibold text-zinc-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
