import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
import { formatJobId } from "../../../utils/jobFormatting";
import { csWorkflow, listJobsByStatus } from "../../api/cs.api";
import JobDetailActionPanel from "../../../components/common/JobDetailActionPanel";

function getJobIdFromQuery(search) { const sp = new URLSearchParams(search || ""); return sp.get("jobId") || ""; }
function cn(...xs) { return xs.filter(Boolean).join(" "); }

export default function CSInDesign() {
  const dialog = useDialog();
  const location = useLocation();
  const targetJobId = useMemo(() => getJobIdFromQuery(location.search), [location.search]);
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const [a, b, c, d] = await Promise.all([
        listJobsByStatus("DESIGN_PENDING"),
        listJobsByStatus("DESIGN_WAITING"),
        listJobsByStatus("IN_DESIGN"),
        listJobsByStatus("DESIGN_DONE"),
      ]);
      const all = [...a, ...b, ...c, ...d].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
      setJobs(all);
      if (selected) setSelected(all.find((x) => x.id === selected.id) || null);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load in-design jobs");
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!targetJobId || !jobs.length) return;
    const found = jobs.find((job) => job.id === targetJobId);
    if (found) {
      setSelected(found);
      const idx = jobs.findIndex((job) => job.id === targetJobId);
      setPage(Math.floor(idx / pageSize) + 1);
    }
  }, [targetJobId, jobs]);

  async function approveToProduction(jobId) {
    try {
      await csWorkflow(jobId, "CS_SEND_TO_OPERATOR");
      dialog.toast("Approved to production", "success");
      await load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Failed", "error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-primary">In Design</h2><button onClick={load} className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button></div>
      {err ? <div className="mt-3 text-red-600 font-bold">{err}</div> : null}
      <div className="mt-4 overflow-auto rounded-2xl border border-zinc-200"><table className="min-w-full text-sm"><thead className="text-left text-zinc-500 bg-bgLight"><tr><th className="py-3 px-3">Job#</th><th className="py-3 px-3">Customer</th><th className="py-3 px-3">Work</th><th className="py-3 px-3">Status</th><th className="py-3 px-3">Action</th></tr></thead><tbody>{slice.map((j)=><tr key={j.id} onClick={() => setSelected(j)} className={cn("border-t border-zinc-200 cursor-pointer transition-colors", selected?.id===j.id ? "bg-bgLight":"hover:bg-zinc-50")}><td className="py-3 px-3 font-bold text-primary">{formatJobId(j.jobNo)}</td><td className="py-3 px-3">{j.customerName}</td><td className="py-3 px-3">{j.workType}</td><td className="py-3 px-3 font-bold">{j.status}</td><td className="py-3 px-3">{j.status === 'DESIGN_DONE' ? <button onClick={(e)=>{e.stopPropagation();approveToProduction(j.id);}} className="px-3 py-2 rounded-xl bg-success text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Approve to Production</button> : <span className="text-zinc-500 font-semibold">Waiting design...</span>}</td></tr>)}{slice.length===0&&<tr><td colSpan={5} className="py-4 px-3 text-zinc-500">No design jobs.</td></tr>}</tbody></table></div>
      <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
    </div>
    <JobDetailActionPanel selected={selected}>
      {selected?.status === 'DESIGN_DONE' ? <button onClick={() => approveToProduction(selected.id)} className="w-full px-4 py-3 rounded-xl bg-success text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Approve to Production</button> : <div className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-500">Waiting until design is completed.</div>}
    </JobDetailActionPanel>
  </div>;
}
