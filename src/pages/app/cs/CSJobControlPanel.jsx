import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { listJobs } from "../../api/jobs.api";
import { useInterval } from "../../../app/hooks/useInterval";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Badge({ text, tone }) {
  const map = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    yellow: "bg-yellow-100 text-yellow-800",
    orange: "bg-orange-100 text-orange-700",
    zinc: "bg-zinc-100 text-zinc-700",
    red: "bg-red-100 text-red-700",
  };
  const cls = map[tone] || map.zinc;
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-normal", cls)}>
      {text}
    </span>
  );
}

function timeLeft(job) {
  if (!job.deliveryDate) return "—";
  const d = new Date(job.deliveryDate);
  const now = new Date();
  const diff = d.getTime() - now.getTime();

  if (!Number.isFinite(diff)) return "—";
  if (diff <= 0) return "LATE";

  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (days > 0) return `${days}d ${hrs % 24}h`;
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  return `${mins}m`;
}

// CS badge based on approval gate
function csState(job) {
  const s = job.status || "";
  if (s === "FINANCE_APPROVED") return { text: "Approved", tone: "green" };
  if (s === "FINANCE_WAITING_APPROVAL") return { text: "Quoted", tone: "blue" };
  if (s === "NEW_REQUEST") return { text: "Quoted", tone: "blue" };
  return { text: "Approved", tone: "green" };
}

// current status short label (for UI only)
function currentStatusBadge(job) {
  const s = job.status || "";

  if (s === "DESIGN_PENDING") return { text: "Design pending", tone: "purple" };
  if (s.includes("DESIGN") || s === "IN_DESIGN")
    return { text: "In Design", tone: "purple" };

  if (s.includes("PRODUCTION") || s === "IN_PRODUCTION")
    return { text: "Printing", tone: "blue" };

  if (s === "DELIVERED") return { text: "Delivered", tone: "green" };
  if (s === "CANCELLED") return { text: "Cancelled", tone: "red" };

  return { text: s || "—", tone: "zinc" };
}

function paymentBadge(ps) {
  const p = (ps || "UNPAID").toUpperCase();
  if (p === "PAID") return { text: "Paid", tone: "green" };
  if (p === "PARTIAL") return { text: "Partial", tone: "yellow" };
  if (p === "CREDIT") return { text: "Credit", tone: "orange" };
  return { text: "UnPaid", tone: "orange" };
}

// Smart pagination list: [1, '…', 4,5,6, '…', 20]
function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const set = new Set([1, total, current, current - 1, current + 1]);
  // keep within bounds
  const nums = Array.from(set).filter((n) => n >= 1 && n <= total);
  nums.sort((a, b) => a - b);

  const out = [];
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    const prev = nums[i - 1];
    if (i > 0 && n - prev > 1) out.push("…");
    out.push(n);
  }
  return out;
}

export default function CSJobControlPanel() {
  const navigate = useNavigate();

  const location = useLocation();
  const qs = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [err, setErr] = useState("");

  const [machineFilter, setMachineFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const rowRefs = useRef({});

  async function load() {
    try {
      setErr("");
      const data = await listJobs();
      setJobs(data || []);

      // keep selection if still exists
      if (selected) {
        const found = (data || []).find((x) => x.id === selected.id);
        setSelected(found || null);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
      navigate("/login");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // realtime refresh
  useInterval(load, 5000);

  // Apply query-string filters (optional)
  useEffect(() => {
    setMachineFilter(qs.get("machine") || "");
    setStatusFilter(qs.get("status") || "");
    setPage(1);
  }, [qs]);

  // Reset page when filters change (prevents empty pages)
  useEffect(() => {
    setPage(1);
  }, [machineFilter, statusFilter, paymentFilter]);

  const machineOptions = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => j.machine && set.add(j.machine));
    return Array.from(set).sort();
  }, [jobs]);

  const statusOptions = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => j.status && set.add(j.status));
    return Array.from(set).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const okM = machineFilter ? (j.machine || "") === machineFilter : true;
      const okS = statusFilter ? (j.status || "") === statusFilter : true;
      const okP = paymentFilter
        ? (j.paymentStatus || "") === paymentFilter
        : true;
      return okM && okS && okP;
    });
  }, [jobs, machineFilter, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);

  // ✅ This is what you were missing before
  const slice = useMemo(() => {
    return filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);
  }, [filtered, pageSafe, pageSize]);

  const pageList = useMemo(
    () => buildPageList(pageSafe, totalPages),
    [pageSafe, totalPages],
  );

  function openDetails(job) {
    setSelected(job);
    const el = rowRefs.current[job.id];
    if (el?.scrollIntoView)
      el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function goToExactPage(job) {
    const s = job.status || "";
    if (s.includes("DESIGN") || s === "IN_DESIGN")
      return navigate(`/app/cs/design?jobId=${job.id}`);
    if (s.includes("PRODUCTION") || s === "IN_PRODUCTION")
      return navigate(`/app/cs/production?jobId=${job.id}`);
    if (s === "DELIVERED" || s === "READY_FOR_DELIVERY")
      return navigate(`/app/cs/completed?jobId=${job.id}`);
    return navigate(`/app/cs/new?jobId=${job.id}`);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      {/* LEFT TABLE */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="text-2xl font-bold text-primary leading-tight">
          Job Control Panel
        </div>
        <div className="text-zinc-400 font-normal text-sm">
          Overview of Orders and Quotations
        </div>

        {/* FILTER ROW */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-primary">
          <span className="text-primary">Filter</span>

          <div className="flex items-center gap-2">
            <span className="text-zinc-900">Machine</span>
            <select
              className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-normal"
              value={machineFilter}
              onChange={(e) => setMachineFilter(e.target.value)}
            >
              <option value="">All</option>
              {machineOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-900">Status</span>
            <select
              className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-normal"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-900">Payment Status</span>
            <select
              className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-normal"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="UNPAID">UNPAID</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="PAID">PAID</option>
              <option value="CREDIT">CREDIT</option>
            </select>
          </div>
        </div>

        {err && <div className="mt-3 text-red-600 font-normal">{err}</div>}

        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-bgLight text-zinc-800">
                <th className="py-3 px-3 rounded-l-2xl">JobID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Due</th>
                <th className="py-3 px-3">CS</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Current status</th>
                <th className="py-3 px-3 rounded-r-2xl">Action</th>
              </tr>
            </thead>

            <tbody>
              {slice.map((j) => {
                const cs = csState(j);
                const pay = paymentBadge(j.paymentStatus);
                const st = currentStatusBadge(j);

                return (
                  <tr
                    key={j.id}
                    ref={(el) => (rowRefs.current[j.id] = el)}
                    onClick={() => openDetails(j)}
                    className={cn(
                      "border-t border-zinc-200 cursor-pointer",
                      selected?.id === j.id ? "bg-bgLight" : "hover:bg-bgLight",
                    )}
                  >
                    <td className="py-2 px-3 font-normal text-sm text-zinc-800">
                      AZ-{String(j.jobNo).padStart(4, "0")}
                    </td>
                    <td className="py-2 px-3">{j.customerName}</td>
                    <td className="py-2 px-3 text-zinc-500 font-normal">
                      {timeLeft(j)}
                    </td>
                    <td className="py-2 px-3">
                      <Badge text={cs.text} tone={cs.tone} />
                    </td>
                    <td className="py-2 px-3">
                      <Badge text={pay.text} tone={pay.tone} />
                    </td>
                    <td className="py-2 px-3">
                      <Badge text={st.text} tone={st.tone} />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToExactPage(j);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-primary text-white font-normal hover:opacity-90"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}

              {slice.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 px-3 text-zinc-500 font-normal"
                  >
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageSafe === 1}
            className={cn(
              "px-3 py-2 rounded-lg border font-bold",
              pageSafe === 1
                ? "border-zinc-200 text-zinc-400"
                : "border-zinc-200 hover:bg-bgLight",
            )}
          >
            Prev
          </button>

          {pageList.map((x, idx) =>
            x === "…" ? (
              <span
                key={`dots-${idx}`}
                className="px-2 text-zinc-400 font-bold"
              >
                …
              </span>
            ) : (
              <button
                key={x}
                onClick={() => setPage(x)}
                className={cn(
                  "px-3 py-2 rounded-lg border font-bold",
                  x === pageSafe
                    ? "bg-primary text-white border-primary"
                    : "border-zinc-200 hover:bg-bgLight",
                )}
              >
                {x}
              </button>
            ),
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageSafe === totalPages}
            className={cn(
              "px-3 py-2 rounded-lg border font-bold",
              pageSafe === totalPages
                ? "border-zinc-200 text-zinc-400"
                : "border-zinc-200 hover:bg-bgLight",
            )}
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT DETAILS */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm w-72">
        {!selected ? (
          <div className="text-zinc-500 font-normal text-center mt-10">
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
              <span className="font-bold">{selected.customerName}</span>
            </div>
            <div className="text-sm text-zinc-700 font-bold">
              Phone:{" "}
              <span className="font-medium">
                {selected.customerPhone || "-"}
              </span>
            </div>
            <div className="text-sm text-zinc-700 font-bold">
              Machine:{" "}
              <span className="font-medium">{selected.machine || "-"}</span>
            </div>

            <div className="text-sm text-zinc-700 font-bold">
              Status:{" "}
              <span className="font-bold">{selected.status || "-"}</span>
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

            <div className="mt-2 text-sm text-zinc-700 font-bold">
              Payment:{" "}
              <span className="font-medium">{selected.paymentStatus}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
