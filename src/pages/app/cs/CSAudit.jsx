import { useEffect, useState } from "react";
import { auditLog } from "../../api/cs.api";

export default function CSAudit() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

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

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-primary">Audit Log</h2>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

      <div className="mt-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">JobId</th>
              <th className="py-2 pr-4">Actor</th>
              <th className="py-2 pr-4">Action</th>
              <th className="py-2 pr-4">From → To</th>
              <th className="py-2 pr-4">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-zinc-200">
                <td className="py-2 pr-4">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="py-2 pr-4 font-bold text-primary">{r.jobId}</td>
                <td className="py-2 pr-4">
                  {r.actorRole || "-"} / {r.actorId || "-"}
                </td>
                <td className="py-2 pr-4 font-bold">{r.action}</td>
                <td className="py-2 pr-4">
                  {r.fromStatus || "-"} → {r.toStatus || "-"}
                </td>
                <td className="py-2 pr-4">{r.note || "-"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-zinc-500">
                  No records.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
