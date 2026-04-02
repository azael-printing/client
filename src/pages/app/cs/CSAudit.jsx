import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { auditLog } from "../../api/cs.api";

export default function CSAudit() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const items = await auditLog(300);
      setRows(items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load audit log");
      setRows([]);
    }
  }

  useEffect(() => { load(); }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Audit Log</h2>
        <button onClick={load} className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button>
      </div>
      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}
      <div className="mt-4 overflow-auto rounded-2xl border border-zinc-200">
        <table className="min-w-full text-sm">
          <thead className="text-left text-zinc-500 bg-bgLight">
            <tr>
              <th className="py-2 px-3">Time</th><th className="py-2 px-3">JobId</th><th className="py-2 px-3">Actor</th><th className="py-2 px-3">Action</th><th className="py-2 px-3">From → To</th><th className="py-2 px-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.id} className="border-t border-zinc-200 hover:bg-zinc-50 transition-colors">
                <td className="py-2 px-3">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="py-2 px-3 font-bold text-primary">{r.jobId}</td>
                <td className="py-2 px-3">{r.actorRole || "-"} / {r.actorId || "-"}</td>
                <td className="py-2 px-3 font-bold">{r.action}</td>
                <td className="py-2 px-3">{r.fromStatus || "-"} → {r.toStatus || "-"}</td>
                <td className="py-2 px-3">{r.note || "-"}</td>
              </tr>
            ))}
            {slice.length === 0 && <tr><td colSpan={6} className="py-4 px-3 text-zinc-500">No records.</td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
