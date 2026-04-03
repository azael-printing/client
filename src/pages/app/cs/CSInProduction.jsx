import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
import JobDetailActionPanel from "../../../components/common/JobDetailActionPanel";
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

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function getJobIdFromQuery(search) {
  const params = new URLSearchParams(search || "");
  return params.get("jobId") || "";
}

export default function CSInProduction() {
  const location = useLocation();
  const dialog = useDialog();
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
        listJobsByStatus("PRODUCTION_PENDING"),
        listJobsByStatus("PRODUCTION_WAITING"),
        listJobsByStatus("IN_PRODUCTION"),
        listJobsByStatus("PRODUCTION_DONE"),
      ]);
      const all = [...a, ...b, ...c, ...d].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
      setJobs(all);
      if (selected) {
        setSelected(all.find((job) => job.id === selected.id) || null);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load production jobs");
      setJobs([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!targetJobId || !jobs.length) return;
    const found = jobs.find((job) => job.id === targetJobId);
    if (found) {
      setSelected(found);
      const idx = jobs.findIndex((job) => job.id === targetJobId);
      setPage(Math.floor(idx / pageSize) + 1);
    }
  }, [targetJobId, jobs]);

  async function readyToDelivery(jobId) {
    try {
      await csWorkflow(jobId, "CS_READY_TO_DELIVERY");
      dialog.toast("Ready to delivery", "success");
      await load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Failed", "error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_348px]">
      <div className={rolePageCardClass}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className={roleTitleClass}>In Production</h2>
            <p className="mt-1 text-sm font-semibold text-zinc-500">
              Same spacing and hover treatment as admin, without the squeezed body mess.
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
                <th className={`${roleThClass} w-[190px]`}>Customer</th>
                <th className={`${roleThClass} w-[190px]`}>Work</th>
                <th className={`${roleThClass} w-[170px]`}>Status</th>
                <th className={roleThClass}>Action</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => setSelected(job)}
                  className={cn(
                    "cursor-pointer border-t border-zinc-200 transition-colors",
                    selected?.id === job.id ? "bg-bgLight" : "hover:bg-zinc-50",
                  )}
                >
                  <td className={`${roleTdClass} font-semibold text-primary`}>
                    {formatJobId(job.jobNo)}
                  </td>
                  <td className={`${roleTdClass} truncate`}>{job.customerName}</td>
                  <td className={`${roleTdClass} truncate`}>{job.workType}</td>
                  <td className={`${roleTdClass} font-semibold`}>{job.status}</td>
                  <td className={roleTdClass}>
                    {job.status === "PRODUCTION_DONE" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          readyToDelivery(job.id);
                        }}
                        className={roleActionClass("primary")}
                      >
                        Ready to Delivery
                      </button>
                    ) : (
                      <span className="text-sm font-semibold text-zinc-500">Waiting operator...</span>
                    )}
                  </td>
                </tr>
              ))}
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-sm font-semibold text-zinc-500">
                    No production jobs.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>

      <JobDetailActionPanel selected={selected}>
        {selected?.status === "PRODUCTION_DONE" ? (
          <button
            onClick={() => readyToDelivery(selected.id)}
            className={`w-full ${roleActionClass("primary")}`}
          >
            Ready to Delivery
          </button>
        ) : (
          <div className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-500">
            Waiting for operator completion.
          </div>
        )}
      </JobDetailActionPanel>
    </div>
  );
}
