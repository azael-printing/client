import { useEffect, useMemo, useState } from "react";
import { listJobs, updateJob, cancelJob } from "../../api/jobs.api";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useSearchParams } from "react-router-dom";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

const CANCEL_REASONS = [
  "Quotation does not approved",
  "Customer replay as price expensive",
  "Suddenly machine disfunction",
  "Other",
];

export default function JobsList() {
  const { user } = useAuth();
  const role = user?.role;

  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "";
  const machineFilter = searchParams.get("machine") || "";

  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");

  // selection + detail panel
  const [selectedId, setSelectedId] = useState("");

  // cancel modal state
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelJobId, setCancelJobId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOther, setCancelOther] = useState("");

  async function load() {
    try {
      setErr("");
      const data = await listJobs();
      setJobs(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return (jobs || []).filter((j) => {
      if (statusFilter && j.status !== statusFilter) return false;
      if (machineFilter && j.machine !== machineFilter) return false;
      return true;
    });
  }, [jobs, statusFilter, machineFilter]);

  const selectedJob = useMemo(
    () => filtered.find((j) => j.id === selectedId) || null,
    [filtered, selectedId],
  );

  async function setStatus(id, status) {
    try {
      await updateJob(id, { status });
      alert("Success: Status updated");
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Fail: Failed to update status");
    }
  }

  function openCancel(id) {
    setCancelJobId(id);
    setCancelReason("");
    setCancelOther("");
    setCancelOpen(true);
  }

  async function confirmCancel() {
    const finalReason =
      cancelReason === "Other" ? cancelOther.trim() : cancelReason;
    if (!finalReason) return alert("Fail: Select cancel reason");
    try {
      await cancelJob(cancelJobId, finalReason, "");
      alert("Success: Job cancelled (history kept)");
      setCancelOpen(false);
      setSelectedId("");
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Fail: Cancel failed");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
      {/* LEFT: TABLE */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
            Jobs Dashboard
          </h2>
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
                <th className="py-2 pr-4">Machine</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((j) => (
                <tr
                  key={j.id}
                  className={cn(
                    "border-t border-zinc-200 cursor-pointer",
                    selectedId === j.id && "bg-bgLight",
                  )}
                  onClick={() => setSelectedId(j.id)}
                >
                  <td className="py-2 pr-4 font-bold text-primary">
                    #{j.jobNo}
                  </td>
                  <td className="py-2 pr-4">{j.customerName}</td>
                  <td className="py-2 pr-4">{j.workType}</td>
                  <td className="py-2 pr-4">{j.machine}</td>
                  <td className="py-2 pr-4 font-bold">
                    {Math.round(j.total || 0).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">{j.status}</td>

                  <td
                    className="py-2 pr-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-2 flex-wrap">
                      {(role === "ADMIN" || role === "CS") && (
                        <>
                          <button
                            onClick={() => openCancel(j.id)}
                            className="px-3 py-2 rounded-xl bg-danger text-white font-bold hover:opacity-90"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {(role === "DESIGNER" || role === "ADMIN") && (
                        <>
                          <button
                            onClick={() => setStatus(j.id, "IN_DESIGN")}
                            className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
                          >
                            In Design
                          </button>
                          <button
                            onClick={() => setStatus(j.id, "DESIGN_DONE")}
                            className="px-3 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90"
                          >
                            Design Completed
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
                            onClick={() => setStatus(j.id, "PRODUCTION_DONE")}
                            className="px-3 py-2 rounded-xl bg-success text-white font-bold hover:opacity-90"
                          >
                            Production Completed
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-zinc-500 font-bold"
                  >
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT: DETAILS */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        <div className="font-extrabold text-primary text-xl">Job Details</div>

        {!selectedJob ? (
          <div className="mt-4 text-zinc-500 font-bold">
            No job selected — select the job to see the detail.
          </div>
        ) : (
          <div className="mt-4 text-sm grid gap-2">
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <div className="text-right font-bold text-zinc-600">Job#:</div>
              <div className="text-right font-extrabold text-zinc-900">
                #{selectedJob.jobNo}
              </div>

              <div className="text-right font-bold text-zinc-600">
                Customer:
              </div>
              <div className="text-right font-extrabold text-zinc-900">
                {selectedJob.customerName}
              </div>

              <div className="text-right font-bold text-zinc-600">Phone:</div>
              <div className="text-right font-extrabold text-zinc-900">
                {selectedJob.customerPhone || "-"}
              </div>

              <div className="text-right font-bold text-zinc-600">
                Work Type:
              </div>
              <div className="text-right font-extrabold text-zinc-900">
                {selectedJob.workType}
              </div>

              <div className="text-right font-bold text-zinc-600">Machine:</div>
              <div className="text-right font-extrabold text-zinc-900">
                {selectedJob.machine}
              </div>

              <div className="text-right font-bold text-zinc-600">Qty:</div>
              <div className="text-right font-extrabold text-zinc-900">
                {selectedJob.qty} {selectedJob.unitType}
              </div>

              <div className="text-right font-bold text-zinc-600">Urgency:</div>
              <div className="text-right font-extrabold text-zinc-900">
                {selectedJob.urgency}
              </div>

              <div className="text-right font-bold text-zinc-600">Status:</div>
              <div className="text-right font-extrabold text-zinc-900">
                {selectedJob.status}
              </div>

              <div className="text-right font-bold text-zinc-600">Total:</div>
              <div className="text-right font-extrabold text-primary">
                {Math.round(selectedJob.total || 0).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CANCEL MODAL */}
      {cancelOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setCancelOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[95%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 bg-white border border-zinc-200 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-primary text-xl">
                Cancel Job
              </div>
              <button
                onClick={() => setCancelOpen(false)}
                className="px-3 py-2 rounded-xl border border-zinc-200 font-bold hover:bg-bgLight"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <div className="font-bold text-zinc-700">
                Why are you cancelling this job?
              </div>

              {CANCEL_REASONS.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 font-bold text-zinc-700"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    checked={cancelReason === r}
                    onChange={() => setCancelReason(r)}
                  />
                  {r}
                </label>
              ))}

              {cancelReason === "Other" && (
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                  placeholder="Write reason..."
                  value={cancelOther}
                  onChange={(e) => setCancelOther(e.target.value)}
                />
              )}

              <button
                onClick={confirmCancel}
                className="mt-3 px-4 py-3 rounded-xl bg-danger text-white font-extrabold hover:opacity-90 transition"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
