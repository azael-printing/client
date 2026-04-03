import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
import { http } from "../../api/http";
import {
  roleActionClass,
  rolePageCardClass,
  roleTableClass,
  roleTableWrapClass,
  roleTdClass,
  roleThClass,
  roleTheadClass,
  roleTitleClass,
} from "../../../components/common/rolePageUi";
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
      setJobs([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
    <div className={rolePageCardClass}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className={roleTitleClass}>Completed</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">
            Delivery-ready and delivered jobs, with cleaner approval visibility.
          </p>
        </div>
        <button onClick={load} className={roleActionClass("neutral")}>
          Refresh
        </button>
      </div>

      {err ? <div className="mt-3 text-sm font-semibold text-red-600">{err}</div> : null}

      <div className={roleTableWrapClass}>
        <table className={roleTableClass}>
          <thead className={roleTheadClass}>
            <tr>
              <th className={`${roleThClass} w-[110px]`}>Job#</th>
              <th className={`${roleThClass} w-[180px]`}>Customer</th>
              <th className={`${roleThClass} w-[160px]`}>Work</th>
              <th className={`${roleThClass} w-[180px]`}>Status</th>
              <th className={roleThClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((job) => {
              const isApproved = approvedSet.has(job.id);
              return (
                <tr key={job.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
                  <td className={`${roleTdClass} font-semibold text-primary`}>
                    {formatJobId(job.jobNo)}
                  </td>
                  <td className={`${roleTdClass} truncate`}>{job.customerName}</td>
                  <td className={`${roleTdClass} truncate`}>{job.workType}</td>
                  <td className={`${roleTdClass} font-semibold`}>
                    {job.status === "DELIVERED"
                      ? "DELIVERED"
                      : isApproved
                        ? "DELIVERY APPROVED"
                        : job.status}
                  </td>
                  <td className={roleTdClass}>
                    {job.status === "READY_FOR_DELIVERY" && isApproved ? (
                      <button
                        onClick={() => markDelivered(job.id)}
                        className={roleActionClass("primary")}
                      >
                        Delivered
                      </button>
                    ) : job.status === "DELIVERED" ? (
                      <span className="inline-flex min-w-[132px] items-center justify-center rounded-xl bg-green-100 px-4 py-2.5 text-[13px] font-semibold text-green-700">
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex min-w-[132px] items-center justify-center rounded-xl bg-bgLight px-4 py-2.5 text-[13px] font-semibold text-zinc-600">
                        Waiting finance
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {slice.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-sm font-semibold text-zinc-500">
                  No completed jobs.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
