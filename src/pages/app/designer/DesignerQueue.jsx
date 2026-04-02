import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
import { formatJobId } from "../../../utils/jobFormatting";
import { designerWorkflow, listDesignerJobsByStatus } from "../../api/designer.api";
import JobDetailActionPanel from "../../../components/common/JobDetailActionPanel";

function cn(...xs) { return xs.filter(Boolean).join(" "); }

export default function DesignerQueue() {
  const dialog = useDialog();
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  async function load() { try { setErr(""); const [a,b,c] = await Promise.all([listDesignerJobsByStatus("DESIGN_ASSIGNED"), listDesignerJobsByStatus("DESIGN_PENDING"), listDesignerJobsByStatus("DESIGN_WAITING")]); const all = [...a,...b,...c].sort((x,y)=>new Date(y.createdAt)-new Date(x.createdAt)); setJobs(all); if (selected) setSelected(all.find((x)=>x.id===selected.id)||null); } catch (e) { setErr(e?.response?.data?.message || "Failed to load queue"); } }
  useEffect(() => { load(); }, []);
  async function markWaiting(jobId) { try { await designerWorkflow(jobId, "DESIGNER_SET_WAITING"); dialog.toast("Marked waiting", "success"); load(); } catch (e) { dialog.toast(e?.response?.data?.message || "Failed", "error"); } }
  async function start(jobId) { try { await designerWorkflow(jobId, "DESIGNER_START"); dialog.toast("Design started", "success"); load(); } catch (e) { dialog.toast(e?.response?.data?.message || "Failed", "error"); } }
  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize)); const pageSafe = Math.min(page, totalPages); const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);
  return <div className="grid gap-4 lg:grid-cols-[1fr_360px]"><div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"><div className="flex items-center justify-between"><h2 className="text-2xl font-extrabold text-primary">Design Queue</h2><button onClick={load} className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button></div>{err && <div className="mt-3 text-red-600 font-bold">{err}</div>}<div className="mt-4 overflow-auto rounded-2xl border border-zinc-200"><table className="min-w-full text-sm"><thead className="text-left text-zinc-500 bg-bgLight"><tr><th className="py-2 px-3">Job#</th><th className="py-2 px-3">Customer</th><th className="py-2 px-3">Work</th><th className="py-2 px-3">Status</th><th className="py-2 px-3">Actions</th></tr></thead><tbody>{slice.map((j)=><tr key={j.id} onClick={() => setSelected(j)} className={cn("border-t border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors", selected?.id===j.id ? "bg-bgLight":"")}><td className="py-2 px-3 font-extrabold text-primary">{formatJobId(j.jobNo)}</td><td className="py-2 px-3">{j.customerName}</td><td className="py-2 px-3">{j.workType}</td><td className="py-2 px-3 font-bold">{j.status}</td><td className="py-2 px-3 flex gap-2 flex-wrap"><button onClick={(e)=>{e.stopPropagation();markWaiting(j.id);}} className="px-3 py-2 rounded-xl bg-warning text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Mark Waiting</button><button onClick={(e)=>{e.stopPropagation();start(j.id);}} className="px-3 py-2 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Start Design</button></td></tr>)}{slice.length===0&&<tr><td colSpan={5} className="py-4 px-3 text-zinc-500">No queued jobs.</td></tr>}</tbody></table></div><Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} /></div><JobDetailActionPanel selected={selected}>{selected ? <><button onClick={() => markWaiting(selected.id)} className="flex-1 px-4 py-3 rounded-xl bg-warning text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Mark Waiting</button><button onClick={() => start(selected.id)} className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Start Design</button></> : null}</JobDetailActionPanel></div>;
}
