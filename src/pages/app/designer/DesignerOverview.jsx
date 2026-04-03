import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
import {
  roleActionClass,
  rolePageCardClass,
  RoleStatCard,
  roleTableClass,
  roleTableWrapClass,
  roleTdClass,
  roleThClass,
  roleTheadClass,
  roleTitleClass,
} from "../../../components/common/rolePageUi";
import { formatJobId } from "../../../utils/jobFormatting";
import { designerWorkflow, listDesignerJobsByStatus } from "../../api/designer.api";

export default function DesignerOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/designer")
    ? "/app/admin/designer"
    : "/app/designer";
  const dialog = useDialog();
  const [all, setAll] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const items = await listDesignerJobsByStatus();
      setAll(items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
      setAll([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function run(jobId, action, message) {
    try {
      await designerWorkflow(jobId, action);
      dialog.toast(message, "success");
      load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Failed", "error");
    }
  }

  const stats = useMemo(() => {
    const count = (status) => all.filter((job) => job.status === status).length;

    return {
      total: all.length,
      queue: ["DESIGN_ASSIGNED", "DESIGN_PENDING", "DESIGN_WAITING"].reduce(
        (sum, status) => sum + count(status),
        0,
      ),
      inDesign: count("IN_DESIGN"),
      done: count("DESIGN_DONE"),
    };
  }, [all]);

  const activeRows = useMemo(
    () =>
      all.filter((job) =>
        ["DESIGN_ASSIGNED", "DESIGN_PENDING", "DESIGN_WAITING", "IN_DESIGN"].includes(
          job.status,
        ),
      ),
    [all],
  );
  const totalPages = Math.max(1, Math.ceil(activeRows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = activeRows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <RoleStatCard
          title="Total Jobs"
          value={stats.total}
          sub="Assigned / visible"
          onClick={() => navigate(`${basePath}/overview`)}
        />
        <RoleStatCard
          title="Queue"
          value={stats.queue}
          sub="Pending / waiting"
          onClick={() => navigate(`${basePath}/queue`)}
        />
        <RoleStatCard
          title="In Design"
          value={stats.inDesign}
          sub="Active work"
          onClick={() => navigate(`${basePath}/in-design`)}
        />
        <RoleStatCard
          title="Completed"
          value={stats.done}
          sub="Design done"
          onClick={() => navigate(`${basePath}/completed`)}
        />
      </div>

      <div className={rolePageCardClass}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className={roleTitleClass}>Active Design Jobs</h2>
            <p className="mt-1 text-sm font-semibold text-zinc-500">
              Same spacing, same table rhythm, no bloated layout.
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
                <th className={`${roleThClass} w-[180px]`}>Work</th>
                <th className={`${roleThClass} w-[160px]`}>Status</th>
                <th className={roleThClass}>Action</th>
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
                    <div className="flex flex-nowrap items-center gap-2">
                      {["DESIGN_ASSIGNED", "DESIGN_PENDING"].includes(job.status) ? (
                        <button
                          onClick={() => run(job.id, "DESIGNER_SET_WAITING", "Marked waiting")}
                          className={roleActionClass("outline")}
                        >
                          Mark Waiting
                        </button>
                      ) : null}
                      {["DESIGN_ASSIGNED", "DESIGN_PENDING", "DESIGN_WAITING"].includes(
                        job.status,
                      ) ? (
                        <button
                          onClick={() => run(job.id, "DESIGNER_START", "Design started")}
                          className={roleActionClass("primary")}
                        >
                          Start Design
                        </button>
                      ) : null}
                      {job.status === "IN_DESIGN" ? (
                        <button
                          onClick={() => run(job.id, "DESIGNER_COMPLETE", "Design completed")}
                          className={roleActionClass("primary")}
                        >
                          Complete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {slice.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-sm font-semibold text-zinc-500">
                    No active design jobs.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
