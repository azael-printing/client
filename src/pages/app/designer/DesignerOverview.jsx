import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
import { formatJobId } from "../../../utils/jobFormatting";
import { designerWorkflow, listDesignerJobsByStatus } from "../../api/designer.api";

function Card({ title, value, sub, onClick }) {
  return <button onClick={onClick} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20"><div className="text-zinc-400 font-semibold">{title}</div><div className="mt-2 text-primary text-3xl font-semibold">{value}</div><div className="mt-1 text-zinc-400 text-sm">{sub}</div></button>;
}

export default function DesignerOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/designer") ? "/app/admin/designer" : "/app/designer";
  const dialog = useDialog();
  const [all, setAll] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const a = await listDesignerJobsByStatus();
      setAll(a || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
      setAll([]);
    }
  }

  useEffect(() => { load(); }, []);

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
    const count = (s) => all.filter((j) => j.status === s).length;
    return {
      total: all.length,
      queue: ["DESIGN_ASSIGNED", "DESIGN_PENDING", "DESIGN_WAITING"].reduce((a, s) => a + count(s), 0),
      inDesign: count("IN_DESIGN"),
      done: count("DESIGN_DONE"),
    };
  }, [all]);

  const activeRows = useMemo(() => all.filter((j) => ["DESIGN_ASSIGNED", "DESIGN_PENDING", "DESIGN_WAITING", "IN_DESIGN"].includes(j.status)), [all]);
  const totalPages = Math.max(1, Math.ceil(activeRows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = activeRows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card title="Total Jobs" value={stats.total} sub="Assigned/visible" onClick={() => navigate(`${basePath}/overview`)} />
        <Card title="Queue" value={stats.queue} sub="Pending / waiting" onClick={() => navigate(`${basePath}/queue`)} />
        <Card title="In Design" value={stats.inDesign} sub="Active work" onClick={() => navigate(`${basePath}/in-design`)} />
        <Card title="Completed" value={stats.done} sub="Design done" onClick={() => navigate(`${basePath}/completed`)} />
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-primary">Active Design Jobs</h2>
          <button onClick={load} className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button>
        </div>
        {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}
        <div className="mt-4 overflow-auto rounded-2xl border border-zinc-200">
          <table className="min-w-[1080px] w-full table-fixed text-sm">
            <thead className="text-left text-zinc-500 bg-bgLight">
              <tr>
                <th className="py-3 px-4 w-[110px] whitespace-nowrap">Job#</th>
                <th className="py-3 px-4 w-[180px] whitespace-nowrap">Customer</th>
                <th className="py-3 px-4 w-[180px] whitespace-nowrap">Work</th>
                <th className="py-3 px-4 w-[160px] whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((j) => (
                <tr key={j.id} className="border-t border-zinc-200 hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-primary whitespace-nowrap">{formatJobId(j.jobNo)}</td>
                  <td className="py-3 px-4 whitespace-nowrap truncate">{j.customerName}</td>
                  <td className="py-3 px-4 whitespace-nowrap truncate">{j.workType}</td>
                  <td className="py-3 px-4 font-bold whitespace-nowrap">{j.status}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 flex-nowrap">
                      {["DESIGN_ASSIGNED", "DESIGN_PENDING"].includes(j.status) && <button onClick={() => run(j.id, "DESIGNER_SET_WAITING", "Marked waiting")} className="px-3 py-2 rounded-xl bg-warning text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Mark Waiting</button>}
                      {["DESIGN_ASSIGNED", "DESIGN_PENDING", "DESIGN_WAITING"].includes(j.status) && <button onClick={() => run(j.id, "DESIGNER_START", "Design started")} className="px-3 py-2 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Start Design</button>}
                      {j.status === "IN_DESIGN" && <button onClick={() => run(j.id, "DESIGNER_COMPLETE", "Design completed")} className="px-3 py-2 rounded-xl bg-success text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Complete</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {slice.length === 0 && <tr><td colSpan={5} className="py-4 px-3 text-zinc-500">No active design jobs.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
