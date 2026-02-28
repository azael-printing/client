import { useEffect, useState } from "react";
import { csWorkflow, listJobsByStatus } from "../../api/cs.api";

export default function CSNewRequests() {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const a = await listJobsByStatus("NEW_REQUEST");
      const b = await listJobsByStatus("FINANCE_WAITING_APPROVAL");
      const c = await listJobsByStatus("FINANCE_APPROVED");
      setJobs(
        [...a, ...b, ...c].sort(
          (x, y) => new Date(y.createdAt) - new Date(x.createdAt),
        ),
      );
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function sendToDesigner(jobId) {
    try {
      await csWorkflow(jobId, "CS_SEND_TO_DESIGNER");
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    }
  }

  async function sendToOperator(jobId) {
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
        <h2 className="text-2xl font-extrabold text-primary">New Requests</h2>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      <p className="mt-2 text-zinc-700">
        Finance approval gates everything. Once approved, send to Designer or
        Operator.
      </p>

      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

      <div className="mt-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="py-2 pr-4">Job#</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Work</th>
              <th className="py-2 pr-4">Design?</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => {
              const canAct = j.status === "FINANCE_APPROVED";
              return (
                <tr key={j.id} className="border-t border-zinc-200">
                  <td className="py-2 pr-4 font-extrabold text-primary">
                    #{j.jobNo}
                  </td>
                  <td className="py-2 pr-4">{j.customerName}</td>
                  <td className="py-2 pr-4">{j.workType}</td>
                  <td className="py-2 pr-4 font-bold">
                    {j.designerRequired ? "YES" : "NO"}
                  </td>
                  <td className="py-2 pr-4 font-bold">{j.status}</td>
                  <td className="py-2 pr-4 flex gap-2 flex-wrap">
                    {canAct && j.designerRequired && (
                      <button
                        onClick={() => sendToDesigner(j.id)}
                        className="px-3 py-2 rounded-xl bg-primary text-white font-extrabold hover:opacity-90"
                      >
                        Send to Designer
                      </button>
                    )}
                    {canAct && !j.designerRequired && (
                      <button
                        onClick={() => sendToOperator(j.id)}
                        className="px-3 py-2 rounded-xl bg-primary text-white font-extrabold hover:opacity-90"
                      >
                        Send to Operator
                      </button>
                    )}
                    {!canAct && (
                      <span className="text-zinc-500 font-bold">
                        Waiting...
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-zinc-500">
                  No new requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
