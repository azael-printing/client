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

export default function CSInProduction() {
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
      const a = await listJobsByStatus("PRODUCTION_PENDING");
      const b = await listJobsByStatus("PRODUCTION_WAITING");
      const c = await listJobsByStatus("IN_PRODUCTION");
      const d = await listJobsByStatus("PRODUCTION_DONE");

      const all = [...a, ...b, ...c, ...d].sort(
        (x, y) => new Date(y.createdAt) - new Date(x.createdAt),
      );

      setJobs(all);

      if (selected) {
        const found = all.find((x) => x.id === selected.id);
        setSelected(found || null);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load production jobs");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!targetJobId) return;
    const found = jobs.find((j) => j.id === targetJobId);
    if (found) setSelected(found);
  }, [targetJobId, jobs]);

  async function readyToDelivery(jobId) {
    try {
      await csWorkflow(jobId, "CS_READY_TO_DELIVERY");
      await load();
      alert("Success: Ready to delivery");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      {/* LEFT */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">In Production</h2>
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
              <tr className="bg-bgLight">
                <th className="py-3 px-3">Job#</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Work</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
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
                  <td className="py-3 px-3 font-bold">{j.status}</td>
                  <td className="py-3 px-3">
                    {j.status === "PRODUCTION_DONE" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          readyToDelivery(j.id);
                        }}
                        className="px-3 py-2 rounded-xl bg-success text-white font-bold hover:opacity-90"
                      >
                        Ready to Delivery
                      </button>
                    ) : (
                      <span className="text-zinc-500 font-bold">
                        Waiting operator...
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 px-3 text-zinc-500">
                    No production jobs.
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
              Description:
              <div className="mt-1 text-zinc-600 font-medium break-words">
                {selected.description || "-"}
              </div>
            </div>

            <div className="mt-2 text-sm text-zinc-700 font-bold">
              Qty:{" "}
              <span className="font-medium">
                {selected.qty} {selected.unitType}
              </span>
            </div>

            {selected.status === "PRODUCTION_DONE" && (
              <button
                onClick={() => readyToDelivery(selected.id)}
                className="mt-3 px-4 py-3 rounded-xl bg-success text-white font-bold hover:opacity-90 transition"
              >
                Ready to Delivery
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
