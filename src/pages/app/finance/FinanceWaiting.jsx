import { useEffect, useState } from "react";
import { listFinanceJobs, financeAction } from "../../api/finance.api";

export default function FinanceWaiting() {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      // Finance sees NEW_REQUEST and FINANCE_WAITING_APPROVAL
      const a = await listFinanceJobs("NEW_REQUEST");
      const b = await listFinanceJobs("FINANCE_WAITING_APPROVAL");
      setJobs(
        [...a, ...b].sort(
          (x, y) => new Date(y.createdAt) - new Date(x.createdAt),
        ),
      );
    } catch (e) {
      setErr(
        e?.response?.data?.message || "Failed to load finance waiting jobs",
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setWaiting(jobId) {
    try {
      await financeAction(jobId, "FINANCE_SET_WAITING");
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    }
  }

  async function approve(jobId) {
    try {
      await financeAction(jobId, "FINANCE_APPROVE");
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-primary">
          Finance — Waiting for Approval
        </h2>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      <p className="mt-2 text-zinc-700">
        New CS jobs arrive here. You must set waiting/approve. Every action
        notifies CS.
      </p>

      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

      <div className="mt-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-zinc-600">
            <tr>
              <th className="py-2 pr-4">Job#</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Work</th>
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
                <td className="py-2 pr-4">{j.total}</td>
                <td className="py-2 pr-4">{j.status}</td>
                <td className="py-2 pr-4 flex gap-2 flex-wrap">
                  {j.status === "NEW_REQUEST" && (
                    <button
                      onClick={() => setWaiting(j.id)}
                      className="px-3 py-2 rounded-xl bg-warning text-white font-bold hover:opacity-90"
                    >
                      Set Waiting
                    </button>
                  )}
                  <button
                    onClick={() => approve(j.id)}
                    className="px-3 py-2 rounded-xl bg-success text-white font-bold hover:opacity-90"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}

            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-zinc-600">
                  No pending approvals.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
