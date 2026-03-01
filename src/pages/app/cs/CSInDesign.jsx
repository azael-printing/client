import { useEffect, useState } from "react";
import { csWorkflow, listJobsByStatus } from "../../api/cs.api";

export default function CSInDesign() {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const a = await listJobsByStatus("DESIGN_PENDING");
      const b = await listJobsByStatus("DESIGN_WAITING");
      const c = await listJobsByStatus("IN_DESIGN");
      const d = await listJobsByStatus("DESIGN_DONE");
      setJobs(
        [...a, ...b, ...c, ...d].sort(
          (x, y) => new Date(y.createdAt) - new Date(x.createdAt),
        ),
      );
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load design jobs");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approveToProduction(jobId) {
    try {
      await csWorkflow(jobId, "CS_SEND_TO_OPERATOR");
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
                  {j.status === "DESIGN_DONE" ? (
                    <button
                      onClick={() => approveToProduction(j.id)}
                      className="px-3 py-2 rounded-xl bg-success text-white font-extrabold hover:opacity-90"
                    >
                      Approve to Production
                    </button>
                  ) : (
                    <span className="text-zinc-500 font-bold">
                      Waiting designer...
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-zinc-500">
                  No design jobs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
