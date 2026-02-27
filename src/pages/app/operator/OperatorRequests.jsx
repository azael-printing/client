import { useEffect, useState } from "react";
import { listJobs, workflowAction } from "../../api/jobs.api";

export default function OperatorRequests() {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const data = await listJobs("PRODUCTION_READY");
      setJobs(data);
    } catch (e) {
      setErr(
        e?.response?.data?.message || "Failed to load production-ready jobs",
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function accept(jobId) {
    try {
      await workflowAction(jobId, "OPERATOR_ACCEPT");
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to accept job");
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-primary">
          Operator — New Requests
        </h2>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      <p className="mt-2 text-zinc-700">
        Only jobs approved by CS appear here (status: <b>PRODUCTION_READY</b>).
      </p>

      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

      <div className="mt-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-zinc-600">
            <tr>
              <th className="py-2 pr-4">Job#</th>
              <th className="py-2 pr-4">Work</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Qty</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-zinc-200">
                <td className="py-2 pr-4 font-bold text-primary">#{j.jobNo}</td>
                <td className="py-2 pr-4">{j.workType}</td>
                <td className="py-2 pr-4">{j.customerName}</td>
                <td className="py-2 pr-4">
                  {j.qty} {j.unitType}
                </td>
                <td className="py-2 pr-4">{j.status}</td>
                <td className="py-2 pr-4">
                  <button
                    onClick={() => accept(j.id)}
                    className="px-3 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90"
                  >
                    Accept → In Production
                  </button>
                </td>
              </tr>
            ))}

            {jobs.length === 0 && (
              <tr>
                <td className="py-4 text-zinc-600" colSpan={6}>
                  No production-ready jobs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
