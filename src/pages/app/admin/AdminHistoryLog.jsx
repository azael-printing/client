import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
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

export default function AdminHistoryLog() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const res = await http.get("/api/history?limit=300");
      setRows(res.data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load system history");
      setRows([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function exportPdf() {
    exportTableToPdf({
      title: "Admin History Log",
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
    <div className="rounded-[24px] border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/10 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[30px] font-extrabold leading-none text-primary">History Log</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">All system activity for admin.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportPdf}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
          >
            Export PDF
          </button>
          <button
            onClick={load}
            className="rounded-xl bg-bgLight px-4 py-2 text-sm font-bold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {err ? <div className="mt-4 text-sm font-semibold text-red-600">{err}</div> : null}

      <div className="mt-6 overflow-auto rounded-2xl border border-zinc-100">
        <table className="min-w-[1180px] w-full table-fixed text-sm">
          <thead className="bg-zinc-50 text-left text-zinc-900">
            <tr>
              <th className="px-4 py-3 font-extrabold whitespace-nowrap w-[210px]">Time</th>
              <th className="px-4 py-3 font-extrabold whitespace-nowrap w-[120px]">Job</th>
              <th className="px-4 py-3 font-extrabold">Actor</th>
              <th className="px-4 py-3 font-extrabold whitespace-nowrap w-[220px]">Action</th>
              <th className="px-4 py-3 font-extrabold">From → To</th>
              <th className="px-4 py-3 font-extrabold">Note</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {slice.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 font-semibold text-zinc-500">
                  No history records.
                </td>
              </tr>
            ) : (
              slice.map((row, index) => (
                <tr key={row.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-zinc-800">{new Date(row.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-extrabold text-primary">{displayEntryId(row, index, (pageSafe - 1) * pageSize)}</td>
                  <td className="px-4 py-3 font-medium text-zinc-800">{row.actorRole || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-extrabold text-zinc-900">{row.action || "-"}</td>
                  <td className="px-4 py-3 font-medium text-zinc-800">{row.fromStatus || "-"} → {row.toStatus || "-"}</td>
                  <td className="px-4 py-3 font-medium text-zinc-800">{row.note || "-"}</td>
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
