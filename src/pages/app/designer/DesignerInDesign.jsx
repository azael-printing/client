import { useEffect, useState } from "react";
import {
  designerWorkflow,
  listDesignerJobsByStatus,
} from "../../api/designer.api";

export default function DesignerInDesign() {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const a = await listDesignerJobsByStatus("IN_DESIGN");
      setJobs(
        (a || []).sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)),
      );
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load in-design jobs");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function complete(jobId) {
    try {
      await designerWorkflow(jobId, "DESIGNER_COMPLETE");
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-primary">In Design</h2>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

      <div className="mt-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="py-2 pr-4">Job#</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Work</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-zinc-200">
                <td className="py-2 pr-4 font-extrabold text-primary">
                  #{j.jobNo}
                </td>
                <td className="py-2 pr-4">{j.customerName}</td>
                <td className="py-2 pr-4">{j.workType}</td>
                <td className="py-2 pr-4 font-bold">{j.status}</td>
                <td className="py-2 pr-4">
                  <button
                    onClick={() => complete(j.id)}
                    className="px-3 py-2 rounded-xl bg-success text-white font-extrabold hover:opacity-90"
                  >
                    Design Completed
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-zinc-500">
                  No active design jobs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
