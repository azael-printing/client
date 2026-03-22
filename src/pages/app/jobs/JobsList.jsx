import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { listJobs, updateJob, cancelJob } from "../../api/jobs.api";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getMachines } from "../../../pages/api/ref.api";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function toCSV(rows) {
  const headers = [
    "jobNo",
    "customerName",
    "customerPhone",
    "machine",
    "status",
    "paymentStatus",
    "deliveryDate",
    "workType",
    "qty",
    "unitType",
    "total",
    "remainingBalance",
  ];

  const esc = (v) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n"))
      return `"${s.replaceAll('"', '""')}"`;
    return s;
  };

  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ].join("\n");
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const STATUS_OPTIONS = [
  "NEW_REQUEST",
  "FINANCE_WAITING_APPROVAL",
  "FINANCE_APPROVED",
  "DESIGN_ASSIGNED",
  "DESIGN_PENDING",
  "DESIGN_WAITING",
  "IN_DESIGN",
  "DESIGN_DONE",
  "PRODUCTION_READY",
  "PRODUCTION_PENDING",
  "PRODUCTION_WAITING",
  "IN_PRODUCTION",
  "PRODUCTION_DONE",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_OPTIONS = ["UNPAID", "PARTIAL", "PAID", "CREDIT"];

function Badge({ text }) {
  const map = {
    IN_PRODUCTION: "bg-blue-100 text-blue-700",
    IN_DESIGN: "bg-purple-100 text-purple-700",
    NEW_REQUEST: "bg-zinc-100 text-zinc-700",
    FINANCE_WAITING_APPROVAL: "bg-yellow-100 text-yellow-800",
    FINANCE_APPROVED: "bg-green-100 text-green-700",
    PRODUCTION_DONE: "bg-green-100 text-green-700",
    DESIGN_DONE: "bg-green-100 text-green-700",
    DELIVERED: "bg-zinc-200 text-zinc-700",
    CANCELLED: "bg-red-100 text-red-700",
    UNPAID: "bg-zinc-100 text-zinc-700",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-700",
    CREDIT: "bg-orange-100 text-orange-700",
  };
  const cls = map[text] || "bg-zinc-100 text-zinc-700";
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold whitespace-nowrap",
        cls,
      )}
    >
      {text}
    </span>
  );
}

const CANCEL_REASONS = [
  "Quotation does not approved",
  "Customer replay as price expensive",
  "Suddenly machine disfunction",
  "Other",
];

export default function JobsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;

  const location = useLocation();
  const qs = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");

  const [machineFilter, setMachineFilter] = useState(qs.get("machine") || "");
  const [statusFilter, setStatusFilter] = useState(qs.get("status") || "");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [machineOptions, setMachineOptions] = useState([]);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelJobId, setCancelJobId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOther, setCancelOther] = useState("");

  const [selected, setSelected] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 4;

  async function load() {
    try {
      setErr("");
      const data = await listJobs();
      setJobs(data || []);

      if (selected) {
        const found = (data || []).find((x) => x.id === selected.id);
        setSelected(found || null);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
      navigate("/login");
    }

    try {
      const ms = await getMachines();
      setMachineOptions(ms || []);
    } catch {
      setMachineOptions([]);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMachineFilter(qs.get("machine") || "");
    setStatusFilter(qs.get("status") || "");
    setPage(1);
  }, [qs]);

  const filtered = useMemo(() => {
    return (jobs || []).filter((j) => {
      const okMachine = machineFilter
        ? (j.machine || "").toLowerCase().includes(machineFilter.toLowerCase())
        : true;
      const okStatus = statusFilter ? (j.status || "") === statusFilter : true;
      const okPay = paymentFilter
        ? (j.paymentStatus || "") === paymentFilter
        : true;
      return okMachine && okStatus && okPay;
    });
  }, [jobs, machineFilter, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  function exportExcel() {
    const csv = toCSV(filtered);
    downloadFile(
      `jobs_export_${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
    );
  }

  async function saveSelected(patch) {
    if (!selected) return;
    try {
      await updateJob(selected.id, patch);
      await load();
      alert("Success: Updated");
    } catch (e) {
      alert(e?.response?.data?.message || "Fail: Update failed");
    }
  }

  function openCancelModal() {
    if (!selected) return alert("Select a job first");
    setCancelJobId(selected.id);
    setCancelReason("");
    setCancelOther("");
    setCancelOpen(true);
  }

  async function confirmCancel() {
    const finalReason =
      cancelReason === "Other" ? cancelOther.trim() : cancelReason;
    if (!finalReason) return alert("Fail: select reason");

    try {
      await cancelJob(cancelJobId, finalReason, "");
      alert("Success: Job cancelled");
      setCancelOpen(false);
      setSelected(null);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Fail: cancel failed");
    }
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
      {/* LEFT */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-lg sm:text-xl font-extrabold text-primary">
            Jobs
          </h2>

          <button
            onClick={exportExcel}
            className="px-3 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
          >
            Export to Excel
          </button>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div>
            <div className="text-[11px] sm:text-xs font-extrabold text-primary mb-1">
              Machine
            </div>
            <input
              value={machineFilter}
              onChange={(e) => {
                setMachineFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <div className="text-[11px] sm:text-xs font-extrabold text-primary mb-1">
              Status
            </div>
            <input
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <div className="text-[11px] sm:text-xs font-extrabold text-primary mb-1">
              Payment Status
            </div>
            <input
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {err && (
          <div className="mt-3 text-red-600 text-sm font-extrabold">{err}</div>
        )}

        <div className="mt-3 overflow-auto rounded-2xl border border-zinc-200">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="text-left text-zinc-500 bg-bgLight">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">JobID</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Customer</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Number</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Machine</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 whitespace-nowrap">
                  Payment Status
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">Delivery</th>
              </tr>
            </thead>

            <tbody>
              {slice.map((j) => (
                <tr
                  key={j.id}
                  onClick={() => setSelected(j)}
                  className={cn(
                    "border-t border-zinc-200 cursor-pointer transition-colors duration-200",
                    selected?.id === j.id ? "bg-bgLight" : "hover:bg-zinc-50",
                  )}
                >
                  <td className="py-2.5 px-3 font-bold text-zinc-800 whitespace-nowrap">
                    AZ0-{j.jobNo}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {j.customerName}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {j.customerPhone || "-"}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {j.machine || "-"}
                  </td>
                  <td className="py-2.5 px-3">
                    <Badge text={j.status} />
                  </td>
                  <td className="py-2.5 px-3">
                    <Badge text={j.paymentStatus || "UNPAID"} />
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {j.deliveryDate ? String(j.deliveryDate).slice(0, 10) : "-"}
                  </td>
                </tr>
              ))}

              {slice.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 px-3 text-zinc-500 font-bold text-center"
                  >
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm font-bold hover:bg-bgLight transition"
          >
            Prev
          </button>

          {Array.from({ length: totalPages })
            .slice(0, 6)
            .map((_, idx) => {
              const p = idx + 1;
              const active = p === pageSafe;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-xs sm:text-sm font-bold transition",
                    active
                      ? "bg-primary text-white border-primary"
                      : "border-zinc-200 hover:bg-bgLight",
                  )}
                >
                  {p}
                </button>
              );
            })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm font-bold hover:bg-bgLight transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm w-full lg:w-auto">
        {!selected ? (
          <div className="text-zinc-500 text-sm font-bold text-center mt-8">
            no job selected — select the job to see the detail
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="text-zinc-500 text-xs sm:text-sm font-extrabold">
              Job Details
            </div>

            <div className="text-primary font-extrabold text-base sm:text-lg leading-tight">
              AZ-{selected.jobNo} — {selected.workType}
            </div>

            <div className="text-xs sm:text-sm text-zinc-700 font-bold">
              Customer:{" "}
              <span className="font-medium">{selected.customerName}</span>
            </div>

            <div className="text-xs sm:text-sm text-zinc-700 font-bold">
              Phone:{" "}
              <span className="font-medium">
                {selected.customerPhone || "-"}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-zinc-700">
                Status:
              </span>
              <Badge text={selected.status} />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-zinc-700">
                Payment:
              </span>
              <Badge text={selected.paymentStatus || "UNPAID"} />
            </div>

            <div className="mt-2 grid gap-2 text-xs sm:text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500 font-bold">Total</span>
                <span className="text-primary font-extrabold">
                  {Math.round(selected.total || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500 font-bold">Outstanding</span>
                <span className="text-red-600 font-extrabold">
                  {Math.round(selected.remainingBalance || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {(role === "ADMIN" || role === "CS") && (
              <button
                onClick={() => {
                  setDraft({
                    machine: selected.machine || "",
                    status: selected.status || "",
                    paymentStatus: selected.paymentStatus || "UNPAID",
                    deliveryDate: selected.deliveryDate
                      ? String(selected.deliveryDate).slice(0, 10)
                      : "",
                  });
                  setEditOpen(true);
                }}
                className="mt-3 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
              >
                Update
              </button>
            )}

            {(role === "ADMIN" || role === "CS") && (
              <button
                onClick={openCancelModal}
                className="px-4 py-2.5 rounded-xl bg-danger text-white text-xs sm:text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
              >
                Cancel Job
              </button>
            )}
          </div>
        )}
      </div>

      {/* UPDATE MODAL */}
      {editOpen && draft && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setEditOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[94%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="font-extrabold text-primary text-base sm:text-lg">
                Update Job
              </div>
              <button
                onClick={() => setEditOpen(false)}
                className="px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-bold hover:bg-bgLight"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <div>
                <div className="text-xs sm:text-sm font-bold text-zinc-700 mb-1">
                  Machine
                </div>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
                  value={draft.machine}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, machine: e.target.value }))
                  }
                >
                  <option value="">Select Machine</option>
                  {machineOptions.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs sm:text-sm font-bold text-zinc-700 mb-1">
                  Status
                </div>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
                  value={draft.status}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs sm:text-sm font-bold text-zinc-700 mb-1">
                  Payment Status
                </div>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
                  value={draft.paymentStatus}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, paymentStatus: e.target.value }))
                  }
                >
                  {PAYMENT_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs sm:text-sm font-bold text-zinc-700 mb-1">
                  Delivery Date
                </div>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                  value={draft.deliveryDate}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, deliveryDate: e.target.value }))
                  }
                />
              </div>

              <button
                onClick={async () => {
                  await saveSelected({
                    machine: draft.machine,
                    status: draft.status,
                    paymentStatus: draft.paymentStatus,
                    deliveryDate: draft.deliveryDate || null,
                  });
                  setEditOpen(false);
                }}
                className="mt-1 px-4 py-2.5 rounded-xl bg-success text-white text-xs sm:text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancelOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setCancelOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[94%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="font-extrabold text-primary text-base sm:text-lg">
                Cancel Job
              </div>
              <button
                onClick={() => setCancelOpen(false)}
                className="px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-bold hover:bg-bgLight"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-2 text-xs sm:text-sm">
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
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                  placeholder="Write reason..."
                  value={cancelOther}
                  onChange={(e) => setCancelOther(e.target.value)}
                />
              )}

              <button
                onClick={confirmCancel}
                className="mt-3 px-4 py-2.5 rounded-xl bg-danger text-white text-xs sm:text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
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
