import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import {
  roleActionClass,
  rolePageCardClass,
  roleTableClass,
  roleTableWrapClass,
  roleTdClass,
  roleThClass,
  roleTheadClass,
  roleTitleClass,
} from "../../../components/common/rolePageUi";
import { auditLog } from "../../api/cs.api";

function AuditTable({ title, err, rows, page, totalPages, onChange, onRefresh }) {
  return (
    <div className={rolePageCardClass}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className={roleTitleClass}>{title}</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">
            Latest visible role-side activity snapshot.
          </p>
        </div>
        <button onClick={onRefresh} className={roleActionClass("neutral")}>
          Refresh
        </button>
      </div>

      {err ? <div className="mt-4 text-sm font-semibold text-red-600">{err}</div> : null}

      <div className={roleTableWrapClass}>
        <table className={roleTableClass}>
          <thead className={roleTheadClass}>
            <tr>
              <th className={`${roleThClass} w-[210px]`}>Time</th>
              <th className={`${roleThClass} w-[120px]`}>Job</th>
              <th className={`${roleThClass} w-[140px]`}>Actor</th>
              <th className={`${roleThClass} w-[220px]`}>Action</th>
              <th className={roleThClass}>From → To</th>
              <th className={roleThClass}>Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm font-semibold text-zinc-500">
                  No records.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
                  <td className={roleTdClass}>{new Date(row.createdAt).toLocaleString()}</td>
                  <td className={`${roleTdClass} text-primary`}>{row.jobId}</td>
                  <td className={roleTdClass}>{row.actorRole || "-"}</td>
                  <td className={`${roleTdClass} font-semibold text-zinc-900`}>
                    {row.action || "-"}
                  </td>
                  <td className={roleTdClass}>
                    {row.fromStatus || "-"} → {row.toStatus || "-"}
                  </td>
                  <td className={roleTdClass}>{row.note || "-"}</td>
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

  useEffect(() => {
    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <AuditTable
      title="Audit Log"
      err={err}
      rows={slice}
      page={pageSafe}
      totalPages={totalPages}
      onChange={setPage}
      onRefresh={load}
    />
  );
}
