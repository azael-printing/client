import { useEffect, useState } from "react";
import { listJobs, updateJob } from "../../api/jobs.api";
import { useAuth } from "../../../app/providers/AuthProvider";

export default function JobsList() {
  const { user } = useAuth();
  const role = user?.role;

  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const data = await listJobs();
      setJobs(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    try {
      await updateJob(id, { status });
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update status");
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-primary">Jobs</h2>
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
          <thead className="text-left text-zinc-600">
            <tr>
              <th className="py-2 pr-4">Job#</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Work</th>
              <th className="py-2 pr-4">Qty</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-zinc-200">
                <td className="py-2 pr-4 font-bold text-primary">#{j.jobNo}</td>
                <td className="py-2 pr-4">{j.customerName}</td>
                <td className="py-2 pr-4">{j.workType}</td>
                <td className="py-2 pr-4">
                  {j.qty} {j.unitType}
                </td>
                <td className="py-2 pr-4 font-bold">
                  {Math.round(j.total).toLocaleString()}
                </td>
                <td className="py-2 pr-4">{j.status}</td>

                <td className="py-2 pr-4">
                  <div className="flex gap-2 flex-wrap">
                    {(role === "DESIGNER" || role === "ADMIN") && (
                      <>
                        <button
                          onClick={() => setStatus(j.id, "IN_DESIGN")}
                          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
                        >
                          In Design
                        </button>

                        <button
                          onClick={() => setStatus(j.id, "IN_PRODUCTION")}
                          className="px-3 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90"
                        >
                          Design Done → Production
                        </button>
                      </>
                    )}

                    {(role === "OPERATOR" || role === "ADMIN") && (
                      <>
                        <button
                          onClick={() => setStatus(j.id, "IN_PRODUCTION")}
                          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
                        >
                          In Production
                        </button>

                        <button
                          onClick={() => setStatus(j.id, "DONE")}
                          className="px-3 py-2 rounded-xl bg-success text-white font-bold hover:opacity-90"
                        >
                          Production Done
                        </button>

                        <button
                          onClick={() => setStatus(j.id, "DELIVERED")}
                          className="px-3 py-2 rounded-xl bg-info text-white font-bold hover:opacity-90"
                        >
                          Delivered
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
