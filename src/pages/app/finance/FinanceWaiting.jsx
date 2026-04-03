import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
import JobDetailActionPanel from "../../../components/common/JobDetailActionPanel";
import {
  actionBtnClass,
  selectedRowClass,
  workPageCardClass,
  workRowClass,
  workTableClass,
  workTableWrapClass,
  workTdClass,
  workThClass,
  workTheadClass,
} from "../../../components/common/worklistUi";
import { formatJobId } from "../../../utils/jobFormatting";
import { financeAction, listFinanceJobs } from "../../api/finance.api";

function money(v) { return `ETB ${Number(v || 0).toLocaleString()}`; }
function cn(...xs) { return xs.filter(Boolean).join(" "); }

export default function FinanceWaiting() {
  const dialog = useDialog();
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const a = await listFinanceJobs("NEW_REQUEST");
      const b = await listFinanceJobs("FINANCE_WAITING_APPROVAL");
      const all = [...a, ...b].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
      setJobs(all);
      setSelected((prev) => all.find((x) => x.id === prev?.id) || all[0] || null);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load finance waiting jobs");
      setJobs([]);
      setSelected(null);
    }
  }

  useEffect(() => { load(); }, []);

  async function setWaiting(jobId) {
    try { await financeAction(jobId, "FINANCE_SET_WAITING"); dialog.toast("Set waiting", "success"); load(); }
    catch (e) { dialog.toast(e?.response?.data?.message || "Failed", "error"); }
  }
  async function approve(jobId) {
    try { await financeAction(jobId, "FINANCE_APPROVE"); dialog.toast("Approved", "success"); load(); }
    catch (e) { dialog.toast(e?.response?.data?.message || "Failed", "error"); }
  }

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_348px]">
      <div className={workPageCardClass}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-primary">Finance — Waiting for Approval</h2>
          <button onClick={load} className={actionBtnClass("neutral")}>Refresh</button>
        </div>
        <p className="mt-2 text-sm font-semibold text-zinc-500">New CS jobs arrive here. You must set waiting or approve.</p>
        {err ? <div className="mt-3 text-sm font-semibold text-red-600">{err}</div> : null}
        <div className={workTableWrapClass}>
          <table className={workTableClass}>
            <thead className={workTheadClass}>
              <tr>
                <th className={`${workThClass} w-[120px]`}>Job#</th>
                <th className={`${workThClass} w-[200px]`}>Customer</th>
                <th className={`${workThClass} w-[190px]`}>Work</th>
                <th className={`${workThClass} w-[140px]`}>Total</th>
                <th className={`${workThClass} w-[180px]`}>Status</th>
                <th className={workThClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((job) => (
                <tr key={job.id} onClick={() => setSelected(job)} className={cn(workRowClass, selected?.id === job.id && selectedRowClass)}>
                  <td className={`${workTdClass} font-extrabold text-primary`}>{formatJobId(job.jobNo)}</td>
                  <td className={`${workTdClass} truncate`}>{job.customerName}</td>
                  <td className={`${workTdClass} truncate`}>{job.workType}</td>
                  <td className={workTdClass}>{money(job.total || job.totalAmount || job.grandTotal || 0)}</td>
                  <td className={`${workTdClass} font-semibold`}>{job.status}</td>
                  <td className={workTdClass}>
                    <div className="flex items-center gap-2 flex-nowrap">
                      {job.status === "NEW_REQUEST" ? <button onClick={(e) => { e.stopPropagation(); setWaiting(job.id); }} className={actionBtnClass("warning")}>Set Waiting</button> : null}
                      <button onClick={(e) => { e.stopPropagation(); approve(job.id); }} className={actionBtnClass("success")}>Approve</button>
                    </div>
                  </td>
                </tr>
              ))}
              {slice.length === 0 ? <tr><td colSpan={6} className="px-4 py-6 text-sm font-semibold text-zinc-500">No pending approvals.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>

      <JobDetailActionPanel selected={selected}>
        {selected ? (
          <>
            {selected.status === "NEW_REQUEST" ? <button onClick={() => setWaiting(selected.id)} className={actionBtnClass("warning")}>Set Waiting</button> : null}
            <button onClick={() => approve(selected.id)} className={actionBtnClass("success")}>Approve</button>
          </>
        ) : null}
      </JobDetailActionPanel>
    </div>
  );
}
