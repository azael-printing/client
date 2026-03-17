//
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { csWorkflow, listJobsByStatus } from "../../api/cs.api";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}
function getJobIdFromQuery(search) {
  const sp = new URLSearchParams(search || "");
  return sp.get("jobId") || "";
}

export default function CSNewRequests() {
  const location = useLocation();
  const targetJobId = useMemo(
    () => getJobIdFromQuery(location.search),
    [location.search],
  );

  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const a = await listJobsByStatus("NEW_REQUEST");
      const b = await listJobsByStatus("FINANCE_WAITING_APPROVAL");
      const c = await listJobsByStatus("FINANCE_APPROVED");

      const all = [...a, ...b, ...c].sort(
        (x, y) => new Date(y.createdAt) - new Date(x.createdAt),
      );

      setJobs(all);

      if (selected) {
        const found = all.find((x) => x.id === selected.id);
        setSelected(found || null);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!targetJobId) return;
    const found = jobs.find((j) => j.id === targetJobId);
    if (found) setSelected(found);
  }, [targetJobId, jobs]);

  async function sendToDesigner(jobId) {
    try {
      await csWorkflow(jobId, "CS_SEND_TO_DESIGNER");
      await load();
      alert("Success: Sent to designer");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    }
  }

  async function sendToOperator(jobId) {
    try {
      await csWorkflow(jobId, "CS_SEND_TO_OPERATOR");
      await load();
      alert("Success: Sent to operator");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      {/* LEFT */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">New Requests</h2>
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
              <tr className="bg-bgLight">
                <th className="py-3 px-3">Job#</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Work</th>
                <th className="py-3 px-3">Design?</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => {
                const canAct = j.status === "FINANCE_APPROVED";
                return (
                  <tr
                    key={j.id}
                    onClick={() => setSelected(j)}
                    className={cn(
                      "border-t border-zinc-200 cursor-pointer",
                      selected?.id === j.id ? "bg-bgLight" : "hover:bg-bgLight",
                    )}
                  >
                    <td className="py-3 px-3 font-bold text-primary">
                      #{j.jobNo}
                    </td>
                    <td className="py-3 px-3">{j.customerName}</td>
                    <td className="py-3 px-3">{j.workType}</td>
                    <td className="py-3 px-3 font-bold">
                      {j.designerRequired ? "YES" : "NO"}
                    </td>
                    <td className="py-3 px-3 font-bold">{j.status}</td>
                    <td className="py-3 px-3">
                      <div
                        className="flex gap-2 flex-wrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {canAct && j.designerRequired && (
                          <button
                            onClick={() => sendToDesigner(j.id)}
                            className="px-3 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90"
                          >
                            Send to Designer
                          </button>
                        )}
                        {canAct && !j.designerRequired && (
                          <button
                            onClick={() => sendToOperator(j.id)}
                            className="px-3 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90"
                          >
                            Send to Operator
                          </button>
                        )}
                        {!canAct && (
                          <span className="text-zinc-500 font-bold">
                            Waiting...
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 px-3 text-zinc-500">
                    No new requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm w-72">
        {!selected ? (
          <div className="text-zinc-500 font-bold text-center mt-10">
            no job selected — select the job to see the detail
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="text-zinc-500 font-bold">Job Details</div>

            <div className="text-primary font-bold text-xl">
              AZ-{selected.jobNo} — {selected.workType}
            </div>

            <div className="text-sm text-zinc-700 font-bold">
              Customer:{" "}
              <span className="font-medium">{selected.customerName}</span>
            </div>
            <div className="text-sm text-zinc-700 font-bold">
              Phone:{" "}
              <span className="font-medium">
                {selected.customerPhone || "-"}
              </span>
            </div>
            <div className="text-sm text-zinc-700 font-bold">
              Status: <span className="font-bold">{selected.status}</span>
            </div>

            <div className="mt-2 text-sm text-zinc-700 font-bold">
              Design Required:{" "}
              <span className="font-bold">
                {selected.designerRequired ? "YES" : "NO"}
              </span>
            </div>

            {selected.status === "FINANCE_APPROVED" && (
              <div className="mt-2 grid gap-2">
                {selected.designerRequired ? (
                  <button
                    onClick={() => sendToDesigner(selected.id)}
                    className="px-4 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition"
                  >
                    Send to Designer
                  </button>
                ) : (
                  <button
                    onClick={() => sendToOperator(selected.id)}
                    className="px-4 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition"
                  >
                    Send to Operator
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
