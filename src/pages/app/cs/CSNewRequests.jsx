import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
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

export default function CSNewRequests() {
  const dialog = useDialog();
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const [a, b, c] = await Promise.all([
        listJobsByStatus("NEW_REQUEST"),
        listJobsByStatus("FINANCE_WAITING_APPROVAL"),
        listJobsByStatus("FINANCE_APPROVED"),
      ]);
      setJobs([...a, ...b, ...c].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load new requests");
      setJobs([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function sendDesigner(jobId) {
    try {
      await csWorkflow(jobId, "CS_SEND_TO_DESIGNER");
      dialog.toast("Sent to designer", "success");
      load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Failed", "error");
    }
  }

  async function sendOperator(jobId) {
    try {
      await csWorkflow(jobId, "CS_SEND_TO_OPERATOR");
      dialog.toast("Sent to operator", "success");
      load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Failed", "error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className={rolePageCardClass}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className={roleTitleClass}>New Requests</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">
            Finance-cleared work waiting for the next handoff.
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
              <th className={`${roleThClass} w-[200px]`}>Customer</th>
              <th className={`${roleThClass} w-[200px]`}>Work</th>
              <th className={`${roleThClass} w-[180px]`}>Status</th>
              <th className={roleThClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((job) => (
              <tr key={job.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
                <td className={`${roleTdClass} font-semibold text-primary`}>
                  {formatJobId(job.jobNo)}
                </td>
                <td className={`${roleTdClass} truncate`}>{job.customerName}</td>
                <td className={`${roleTdClass} truncate`}>{job.workType}</td>
                <td className={`${roleTdClass} font-semibold`}>{job.status}</td>
                <td className={roleTdClass}>
                  <div className="flex flex-wrap gap-2">
                    {job.status === "FINANCE_APPROVED" && job.designerRequired ? (
                      <button
                        onClick={() => sendDesigner(job.id)}
                        className={roleActionClass("primary")}
                      >
                        Send Designer
                      </button>
                    ) : null}
                    {((job.status === "FINANCE_APPROVED" && !job.designerRequired) ||
                      job.status === "DESIGN_DONE") ? (
                      <button
                        onClick={() => sendOperator(job.id)}
                        className={roleActionClass("primary")}
                      >
                        Send Operator
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {slice.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-sm font-semibold text-zinc-500">
                  No new requests.
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
