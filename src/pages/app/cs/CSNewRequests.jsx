import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
import { formatJobId } from "../../../utils/jobFormatting";
import { csWorkflow, listJobsByStatus } from "../../api/cs.api";

export default function CSNewRequests() {
  const dialog = useDialog();
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const a = await listJobsByStatus("NEW_REQUEST");
      const b = await listJobsByStatus("FINANCE_WAITING_APPROVAL");
      const c = await listJobsByStatus("FINANCE_APPROVED");
      setJobs([...a, ...b, ...c].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load new requests");
    }
  }

  useEffect(() => { load(); }, []);

  async function sendDesigner(jobId) {
    try { await csWorkflow(jobId, "CS_SEND_TO_DESIGNER"); dialog.toast("Sent to designer", "success"); load(); } catch (e) { dialog.toast(e?.response?.data?.message || "Failed", "error"); }
  }
  async function sendOperator(jobId) {
    try { await csWorkflow(jobId, "CS_SEND_TO_OPERATOR"); dialog.toast("Sent to operator", "success"); load(); } catch (e) { dialog.toast(e?.response?.data?.message || "Failed", "error"); }
  }

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-extrabold text-primary">New Requests</h2><button onClick={load} className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button></div>
      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}
      <div className="mt-4 overflow-auto rounded-2xl border border-zinc-200"><table className="min-w-full text-sm"><thead className="text-left text-zinc-500 bg-bgLight"><tr><th className="py-2 px-3">Job#</th><th className="py-2 px-3">Customer</th><th className="py-2 px-3">Work</th><th className="py-2 px-3">Status</th><th className="py-2 px-3">Actions</th></tr></thead><tbody>{slice.map((j)=><tr key={j.id} className="border-t border-zinc-200 hover:bg-zinc-50 transition-colors"><td className="py-2 px-3 font-extrabold text-primary">{formatJobId(j.jobNo)}</td><td className="py-2 px-3">{j.customerName}</td><td className="py-2 px-3">{j.workType}</td><td className="py-2 px-3 font-bold">{j.status}</td><td className="py-2 px-3 flex gap-2 flex-wrap">{j.status === 'FINANCE_APPROVED' && j.designerRequired && <button onClick={()=>sendDesigner(j.id)} className="px-3 py-2 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Send Designer</button>}{((j.status === 'FINANCE_APPROVED' && !j.designerRequired) || j.status === 'DESIGN_DONE') && <button onClick={()=>sendOperator(j.id)} className="px-3 py-2 rounded-xl bg-success text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Send Operator</button>}</td></tr>)}{slice.length===0&&<tr><td colSpan={5} className="py-4 px-3 text-zinc-500">No new requests.</td></tr>}</tbody></table></div>
      <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
