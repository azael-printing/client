import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import FinanceSectionCard from "../../../components/common/FinanceSectionCard";
import FinanceTableShell from "../../../components/common/FinanceTableShell";
import { http } from "../../api/http";
import { formatJobId } from "../../../utils/jobFormatting";

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

  useEffect(() => { load(); }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <FinanceSectionCard
      title="History Log"
      action={<button onClick={load} className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button>}
    >
      {err && <div className="mt-3 text-zinc-600 font-bold">{err}</div>}
      <FinanceTableShell
        minWidth={1160}
        rowCount={slice.length}
        emptyText="No records."
        headers={[
          { key: "time", label: "Time" },
          { key: "job", label: "Job" },
          { key: "actor", label: "Actor" },
          { key: "action", label: "Action" },
          { key: "status", label: "From → To" },
          { key: "note", label: "Note" },
        ]}
        colSpan={6}
      >
        {slice.map((r, index) => (
          <tr key={r.id} className="border-t border-zinc-200 hover:bg-zinc-50 transition-colors">
            <td className="py-3 px-4 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td>
            <td className="py-3 px-4 font-bold text-primary whitespace-nowrap">{displayEntryId(r, index, (pageSafe - 1) * pageSize)}</td>
            <td className="py-3 px-4">{r.actorRole || "-"}</td>
            <td className="py-3 px-4 font-bold whitespace-nowrap">{r.action}</td>
            <td className="py-3 px-4">{r.fromStatus || "-"} → {r.toStatus || "-"}</td>
            <td className="py-3 px-4">{r.note || "-"}</td>
          </tr>
        ))}
      </FinanceTableShell>
      <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
    </FinanceSectionCard>
  );
}
