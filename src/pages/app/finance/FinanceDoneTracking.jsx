import { useEffect, useMemo, useState } from "react";
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
import { http } from "../../api/http";
import { formatJobId } from "../../../utils/jobFormatting";
import { financeAction, listFinanceJobs } from "../../api/finance.api";

function money(v) { return `ETB ${Number(v || 0).toLocaleString()}`; }
function cn(...xs) { return xs.filter(Boolean).join(" "); }

export default function FinanceDoneTracking() {
  const dialog = useDialog();
  const [jobs, setJobs] = useState([]);
  const [approvedIds, setApprovedIds] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const [ready, delivered, historyRes] = await Promise.all([
        listFinanceJobs("READY_FOR_DELIVERY"),
        listFinanceJobs("DELIVERED"),
        http.get("/api/history?limit=500").catch(() => ({ data: { items: [] } })),
      ]);
      const approved = (historyRes.data.items || [])
        .filter((item) => item.action === "FINANCE_APPROVE_DELIVERY")
        .map((item) => item.jobId);
      const all = [...ready, ...delivered].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
      setApprovedIds(approved);
      setJobs(all);
      setSelected((prev) => all.find((x) => x.id === prev?.id) || all[0] || null);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load done jobs");
      setJobs([]);
      setApprovedIds([]);
      setSelected(null);
    }
  }

  useEffect(() => { load(); }, []);

  async function approveDelivery(jobId) {
    try {
      await financeAction(jobId, "FINANCE_APPROVE_DELIVERY");
      dialog.toast("Delivery approved", "success");
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
    <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
      <div className={workPageCardClass}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-primary">Finance — Done Tracking</h2>
          <button onClick={load} className={actionBtnClass("neutral")}>Refresh</button>
        </div>
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
              {slice.map((job) => {
                const isApproved = approvedSet.has(job.id);
                return (
                  <tr key={job.id} onClick={() => setSelected(job)} className={cn(workRowClass, selected?.id === job.id && selectedRowClass)}>
                    <td className={`${workTdClass} font-extrabold text-primary`}>{formatJobId(job.jobNo)}</td>
                    <td className={`${workTdClass} truncate`}>{job.customerName}</td>
                    <td className={`${workTdClass} truncate`}>{job.workType}</td>
                    <td className={workTdClass}>{money(job.total || job.totalAmount || job.grandTotal || 0)}</td>
                    <td className={`${workTdClass} font-semibold`}>{job.status === "DELIVERED" ? "DELIVERED" : isApproved ? "DELIVERY APPROVED" : job.status}</td>
                    <td className={workTdClass}>
                      <div className="flex items-center gap-2 flex-nowrap">
                        {job.status === "READY_FOR_DELIVERY" && !isApproved ? <button onClick={(e) => { e.stopPropagation(); approveDelivery(job.id); }} className={actionBtnClass("success", true)}>Approve Delivery</button> : null}
                        {job.status === "READY_FOR_DELIVERY" && isApproved ? <span className={actionBtnClass("neutral", true)}>Approved</span> : null}
                        {job.status === "DELIVERED" ? <span className={actionBtnClass("done", true)}>Delivered</span> : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {slice.length === 0 ? <tr><td colSpan={6} className="px-4 py-6 text-sm font-semibold text-zinc-500">No done jobs yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>

      <JobDetailActionPanel selected={selected}>
        {selected?.status === "READY_FOR_DELIVERY" && !approvedSet.has(selected.id) ? (
          <button onClick={() => approveDelivery(selected.id)} className={actionBtnClass("success", true)}>Approve Delivery</button>
        ) : selected?.status === "READY_FOR_DELIVERY" && approvedSet.has(selected.id) ? (
          <div className={actionBtnClass("neutral", true)}>Delivery approved - waiting assistant confirmation</div>
        ) : selected?.status === "DELIVERED" ? (
          <div className={actionBtnClass("done", true)}>Delivered</div>
        ) : null}
      </JobDetailActionPanel>
    </div>
  );
}
