import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { formatJobId } from "../../../utils/jobFormatting";
import { listFinanceJobs } from "../../api/finance.api";

function money(v) { return `ETB ${Number(v || 0).toLocaleString()}`; }

export default function FinanceDoneTracking() {
  const [jobs, setJobs] = useState([]); const [err, setErr] = useState(""); const [page, setPage] = useState(1); const pageSize = 10;
  async function load() { try { setErr(""); const a = await listFinanceJobs("READY_FOR_DELIVERY"); const b = await listFinanceJobs("DELIVERED"); setJobs([...a,...b].sort((x,y)=>new Date(y.createdAt)-new Date(x.createdAt))); } catch (e) { setErr(e?.response?.data?.message || "Failed to load done jobs"); } }
  useEffect(() => { load(); }, []);
  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize)); const pageSafe = Math.min(page, totalPages); const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);
  return <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"><div className="flex items-center justify-between"><h2 className="text-2xl font-extrabold text-primary">Finance — Done Tracking</h2><button onClick={load} className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button></div>{err && <div className="mt-3 text-red-600 font-bold">{err}</div>}<div className="mt-4 overflow-auto rounded-2xl border border-zinc-200"><table className="min-w-full text-sm"><thead className="text-left text-zinc-600 bg-bgLight"><tr><th className="py-2 px-3">Job#</th><th className="py-2 px-3">Customer</th><th className="py-2 px-3">Work</th><th className="py-2 px-3">Total</th><th className="py-2 px-3">Status</th></tr></thead><tbody>{slice.map((j)=><tr key={j.id} className="border-t border-zinc-200 hover:bg-zinc-50 transition-colors"><td className="py-2 px-3 font-bold text-primary">{formatJobId(j.jobNo)}</td><td className="py-2 px-3">{j.customerName}</td><td className="py-2 px-3">{j.workType}</td><td className="py-2 px-3">{money(j.total || j.totalAmount || j.grandTotal || 0)}</td><td className="py-2 px-3">{j.status}</td></tr>)}{slice.length===0&&<tr><td colSpan={5} className="py-4 px-3 text-zinc-600">No done jobs yet.</td></tr>}</tbody></table></div><Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} /></div>;
}
