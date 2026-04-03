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
import { http } from "../../api/http";
import { formatJobId } from "../../../utils/jobFormatting";
import { exportTableToPdf } from "../../../utils/exportPdf";

function displayEntryId(row, index, offset = 0) {
  const raw = row?.job?.jobNo ?? row?.jobNo ?? "";
  const value = String(raw || "").trim();
  if (/^AZ-?\d+$/i.test(value)) return `AZ-${value.replace(/\D/g, "").padStart(4, "0")}`;
  if (/^\d+$/.test(value)) return formatJobId(value);
  return `AZHL-${String(offset + index + 1).padStart(3, "0")}`;
}

export default function FinanceAudit() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const res = await http.get("/api/history?limit=200");
      setRows(res.data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load history log");
      setRows([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function exportPdf() {
    exportTableToPdf({
      title: "Finance History Log",
      headers: ["Time", "Job", "Actor", "Action", "From → To", "Note"],
      rows: rows.map((row, index) => [
        new Date(row.createdAt).toLocaleString(),
        displayEntryId(row, index),
        row.actorRole || "-",
        row.action || "-",
        `${row.fromStatus || "-"} → ${row.toStatus || "-"}`,
        row.note || "-",
      ]),
    });
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className={rolePageCardClass}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className={roleTitleClass}>History Log</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">
            Uniform table spacing and export controls for finance-side history.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportPdf} className={roleActionClass("primary")}>
            Export PDF
          </button>
          <button onClick={load} className={roleActionClass("neutral")}>
            Refresh
          </button>
        </div>
      </div>

      {err ? <div className="mt-3 text-sm font-semibold text-red-600">{err}</div> : null}

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
            {slice.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm font-semibold text-zinc-500">
                  No records.
                </td>
              </tr>
            ) : (
              slice.map((row, index) => (
                <tr key={row.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
                  <td className={roleTdClass}>{new Date(row.createdAt).toLocaleString()}</td>
                  <td className={`${roleTdClass} text-primary`}>
                    {displayEntryId(row, index, (pageSafe - 1) * pageSize)}
                  </td>
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

      <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
