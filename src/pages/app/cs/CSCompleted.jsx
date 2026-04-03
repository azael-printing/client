import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
import { http } from "../../api/http";
import { formatJobId } from "../../../utils/jobFormatting";
import { csWorkflow, listJobsByStatus } from "../../api/cs.api";

export default function CSCompleted() {
  const dialog = useDialog();
  const [jobs, setJobs] = useState([]);
  const [approvedIds, setApprovedIds] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const [ready, delivered, historyRes] = await Promise.all([
        listJobsByStatus("READY_FOR_DELIVERY"),
        listJobsByStatus("DELIVERED"),
        http.get("/api/history?limit=500").catch(() => ({ data: { items: [] } })),
      ]);
      const approved = (historyRes.data.items || [])
        .filter((item) => item.action === "FINANCE_APPROVE_DELIVERY")
        .map((item) => item.jobId);
      setApprovedIds(approved);
      setJobs([...ready, ...delivered].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load completed jobs");
      setApprovedIds([]);
    }
  }

  useEffect(() => { load(); }, []);

  async function markDelivered(jobId) {
    try {
      await csWorkflow(jobId, "CS_MARK_DELIVERED");
      dialog.toast("Marked delivered", "success");
      load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Failed", "error");
    }
  }

  const approvedSet = useMemo(() => new Set(approvedIds), [approvedIds]);
  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-primary">Completed</h2><button onClick={load} className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button></div>
      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}
      <div className="mt-4 overflow-auto rounded-2xl border border-zinc-200"><table className="min-w-[1080px] w-full table-fixed text-sm"><thead className="text-left text-zinc-500 bg-bgLight"><tr><th className="py-3 px-4 w-[110px] whitespace-nowrap">Job#</th><th className="py-3 px-4 w-[180px] whitespace-nowrap">Customer</th><th className="py-3 px-4 w-[160px] whitespace-nowrap">Work</th><th className="py-3 px-4 w-[180px] whitespace-nowrap">Status</th><th className="py-3 px-4 whitespace-nowrap">Action</th></tr></thead><tbody>{slice.map((j)=>{const isApproved=approvedSet.has(j.id); return <tr key={j.id} className="border-t border-zinc-200 hover:bg-zinc-50 transition-colors"><td className="py-3 px-4 font-bold text-primary whitespace-nowrap">{formatJobId(j.jobNo)}</td><td className="py-3 px-4 whitespace-nowrap truncate">{j.customerName}</td><td className="py-3 px-4 whitespace-nowrap truncate">{j.workType}</td><td className="py-3 px-4 font-bold whitespace-nowrap">{j.status === "DELIVERED" ? "DELIVERED" : isApproved ? "DELIVERY APPROVED" : j.status}</td><td className="py-3 px-4 whitespace-nowrap">{j.status === "READY_FOR_DELIVERY" && isApproved ? <button onClick={() => markDelivered(j.id)} className="inline-flex items-center justify-center min-w-[120px] px-3 py-2 rounded-xl bg-success text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Delivered</button> : j.status === "DELIVERED" ? <span className="inline-flex items-center justify-center min-w-[120px] px-3 py-2 rounded-xl bg-green-100 text-green-700 font-semibold">Delivered</span> : <span className="inline-flex items-center justify-center min-w-[120px] px-3 py-2 rounded-xl bg-bgLight text-zinc-600 font-semibold">Waiting finance</span>}</td></tr>})}{slice.length===0&&<tr><td colSpan={5} className="py-4 px-3 text-zinc-500">No completed jobs.</td></tr>}</tbody></table></div>
      <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
