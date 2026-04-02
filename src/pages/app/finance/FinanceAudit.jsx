import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { http } from "../../api/http";
import { formatJobId } from "../../../utils/jobFormatting";

function displayJobId(row) {
  if (row?.job?.jobNo) return formatJobId(row.job.jobNo);
  if (row?.jobNo) return formatJobId(row.jobNo);
  return row?.jobId || "-";
}

export default function FinanceAudit() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const res = await http.get('/api/history?limit=200');
      setRows(res.data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load history log');
      setRows([]);
    }
  }

  useEffect(() => { load(); }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"><div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-primary">History Log</h2><button onClick={load} className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button></div>{err && <div className="mt-3 text-zinc-600 font-bold">{err}</div>}<div className="mt-4 overflow-auto rounded-2xl border border-zinc-200"><table className="min-w-[1160px] w-full text-sm"><thead className="text-left text-zinc-500 bg-bgLight"><tr><th className="py-3 px-4 whitespace-nowrap">Time</th><th className="py-3 px-4 whitespace-nowrap">Job</th><th className="py-3 px-4 whitespace-nowrap">Actor</th><th className="py-3 px-4 whitespace-nowrap">Action</th><th className="py-3 px-4 whitespace-nowrap">From → To</th><th className="py-3 px-4">Note</th></tr></thead><tbody>{slice.map((r)=><tr key={r.id} className="border-t border-zinc-200 hover:bg-zinc-50 transition-colors"><td className="py-3 px-4 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td><td className="py-3 px-4 font-bold text-primary whitespace-nowrap">{displayJobId(r)}</td><td className="py-3 px-4">{r.actorRole || '-'} / {r.actorId || '-'}</td><td className="py-3 px-4 font-bold whitespace-nowrap">{r.action}</td><td className="py-3 px-4">{r.fromStatus || '-'} → {r.toStatus || '-'}</td><td className="py-3 px-4">{r.note || '-'}</td></tr>)}{slice.length===0&&<tr><td colSpan={6} className="py-4 px-3 text-zinc-500">No records.</td></tr>}</tbody></table></div><Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} /></div>;
}
