import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { auditLog } from "../../api/designer.api";

function AuditTable({ title, err, rows, page, totalPages, onChange, onRefresh }) {
  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/10 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[30px] font-extrabold leading-none text-primary">{title}</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">Latest visible role-side activity snapshot.</p>
        </div>
        <button onClick={onRefresh} className="rounded-xl bg-bgLight px-4 py-2 text-sm font-bold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button>
      </div>
      {err ? <div className="mt-4 text-sm font-semibold text-red-600">{err}</div> : null}
      <div className="mt-6 overflow-auto rounded-2xl border border-zinc-100">
        <table className="min-w-[1080px] w-full table-fixed text-sm">
          <thead className="bg-zinc-50 text-left text-zinc-900">
            <tr>
              <th className="w-[210px] whitespace-nowrap px-4 py-3 font-extrabold">Time</th>
              <th className="w-[120px] whitespace-nowrap px-4 py-3 font-extrabold">Job</th>
              <th className="w-[140px] whitespace-nowrap px-4 py-3 font-extrabold">Actor</th>
              <th className="w-[220px] whitespace-nowrap px-4 py-3 font-extrabold">Action</th>
              <th className="px-4 py-3 font-extrabold">From → To</th>
              <th className="px-4 py-3 font-extrabold">Note</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 font-semibold text-zinc-500">No records.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-800">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-extrabold text-primary">{r.jobId}</td>
                  <td className="px-4 py-3 font-medium text-zinc-800">{r.actorRole || "-"}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-extrabold text-zinc-900">{r.action || "-"}</td>
                  <td className="px-4 py-3 font-medium text-zinc-800">{r.fromStatus || "-"} → {r.toStatus || "-"}</td>
                  <td className="px-4 py-3 font-medium text-zinc-800">{r.note || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={onChange} />
    </div>
  );
}

export default function DesignerAudit() {
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

  return <AuditTable title="Designer Audit Log" err={err} rows={slice} page={pageSafe} totalPages={totalPages} onChange={setPage} onRefresh={load} />;
}
