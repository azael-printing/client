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
import { designerWorkflow, listDesignerJobsByStatus } from "../../api/designer.api";

function cn(...xs) { return xs.filter(Boolean).join(" "); }

export default function DesignerInDesign() {
  const dialog = useDialog();
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const all = (await listDesignerJobsByStatus("IN_DESIGN") || []).sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
      setJobs(all);
      setSelected((prev) => all.find((x) => x.id === prev?.id) || all[0] || null);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load in-design jobs");
      setJobs([]);
      setSelected(null);
    }
  }

  useEffect(() => { load(); }, []);

  async function complete(jobId) {
    try {
      await designerWorkflow(jobId, "DESIGNER_COMPLETE");
      dialog.toast("Design completed", "success");
      load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Failed", "error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
      <div className={workPageCardClass}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-primary">In Design</h2>
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
                <th className={workThClass}>Action</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((job) => (
                <tr key={job.id} onClick={() => setSelected(job)} className={cn(workRowClass, selected?.id === job.id && selectedRowClass)}>
                  <td className={`${workTdClass} font-extrabold text-primary`}>{formatJobId(job.jobNo)}</td>
                  <td className={`${workTdClass} truncate`}>{job.customerName}</td>
                  <td className={`${workTdClass} truncate`}>{job.workType}</td>
                  <td className={`${workTdClass} font-semibold`}>{job.status}</td>
                  <td className={workTdClass}><button onClick={(e) => { e.stopPropagation(); complete(job.id); }} className={actionBtnClass("success", true)}>Design Completed</button></td>
                </tr>
              ))}
              {slice.length === 0 ? <tr><td colSpan={5} className="px-4 py-6 text-sm font-semibold text-zinc-500">No active design jobs.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>

      <JobDetailActionPanel selected={selected}>
        {selected ? <button onClick={() => complete(selected.id)} className={actionBtnClass("success", true)}>Design Completed</button> : null}
      </JobDetailActionPanel>
    </div>
  );
}
