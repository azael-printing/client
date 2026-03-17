import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { csWorkflow, listJobsByStatus } from "../../api/cs.api";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}
function getJobIdFromQuery(search) {
  const sp = new URLSearchParams(search || "");
  return sp.get("jobId") || "";
}

export default function CSInDesign() {
  const location = useLocation();
  const targetJobId = useMemo(
    () => getJobIdFromQuery(location.search),
    [location.search],
  );

  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");

  const [toast, setToast] = useState(""); // popup message
  const rowRefs = useRef({}); // for scroll-to-row

  function showToast(msg) {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 3000);
  }

  async function load() {
    try {
      setErr("");
      const a = await listJobsByStatus("DESIGN_PENDING");
      const b = await listJobsByStatus("DESIGN_WAITING");
      const c = await listJobsByStatus("IN_DESIGN");
      const d = await listJobsByStatus("DESIGN_DONE");

      const all = [...a, ...b, ...c, ...d].sort(
        (x, y) => new Date(y.createdAt) - new Date(x.createdAt),
      );

      setJobs(all);

      // keep selection if still exists
      if (selected) {
        const found = all.find((x) => x.id === selected.id);
        setSelected(found || null);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load design jobs");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-select job from notification query (robust)
  useEffect(() => {
    if (!location.search) return;

    if (!targetJobId) {
      showToast(
        "This notification opened the correct page, but no Job ID was attached.",
      );
      return;
    }

    if (!jobs.length) return; // wait until jobs loaded

    const found = jobs.find((j) => j.id === targetJobId);
    if (!found) {
      showToast(
        "Job not found in this page list. It may have moved to another stage already.",
      );
      return;
    }

    setSelected(found);

    // scroll into view
    const el = rowRefs.current[targetJobId];
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetJobId, jobs]);

  async function approveToProduction(jobId) {
    try {
      await csWorkflow(jobId, "CS_SEND_TO_OPERATOR");
      await load();
      showToast("Success: Approved to production");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      {/* popup */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-white border border-zinc-200 shadow-lg font-bold text-zinc-800">
          {toast}
        </div>
      )}

      {/* LEFT */}
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
                  ref={(el) => (rowRefs.current[j.id] = el)}
                  onClick={() => setSelected(j)}
                  className={cn(
                    "border-t border-zinc-200 cursor-pointer",
                    selected?.id === j.id ? "bg-bgLight" : "hover:bg-bgLight",
                  )}
                >
                  <td className="py-3 px-3 font-extrabold text-primary">
                    #{j.jobNo}
                  </td>
                  <td className="py-3 px-3">{j.customerName}</td>
                  <td className="py-3 px-3">{j.workType}</td>
                  <td className="py-3 px-3 font-bold">{j.status}</td>
                  <td className="py-3 px-3">
                    {j.status === "DESIGN_DONE" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          approveToProduction(j.id);
                        }}
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
                  <td colSpan={5} className="py-4 px-3 text-zinc-500">
                    No design jobs.
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
            <div className="text-zinc-500 font-extrabold">Job Details</div>

            <div className="text-primary font-extrabold text-xl">
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
              Status: <span className="font-extrabold">{selected.status}</span>
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

            {selected.status === "DESIGN_DONE" && (
              <button
                onClick={() => approveToProduction(selected.id)}
                className="mt-3 px-4 py-3 rounded-xl bg-success text-white font-extrabold hover:opacity-90 transition"
              >
                Approve to Production
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
