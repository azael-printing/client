import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import {
  actionBtnClass,
  workPageCardClass,
  workTableClass,
  workTableWrapClass,
  workTdClass,
  workThClass,
  workTheadClass,
} from "../../../components/common/worklistUi";
import { formatJobId } from "../../../utils/jobFormatting";
import { listOperatorJobsByStatus } from "../../api/operator.api";

export default function OperatorCompleted() {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const rows = await listOperatorJobsByStatus("PRODUCTION_DONE");
      setJobs((rows || []).sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load completed jobs");
      setJobs([]);
    }
  }

  useEffect(() => { load(); }, []);

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className={workPageCardClass}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-primary">Completed Jobs</h2>
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
              <th className={`${workThClass} w-[170px]`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((job) => (
              <tr key={job.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
                <td className={`${workTdClass} font-extrabold text-primary`}>{formatJobId(job.jobNo)}</td>
                <td className={`${workTdClass} truncate`}>{job.customerName}</td>
                <td className={`${workTdClass} truncate`}>{job.workType}</td>
                <td className={`${workTdClass} font-semibold`}>{job.status}</td>
              </tr>
            ))}
            {slice.length === 0 ? <tr><td colSpan={4} className="px-4 py-6 text-sm font-semibold text-zinc-500">No completed jobs.</td></tr> : null}
          </tbody>
        </table>
      </div>
      <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
