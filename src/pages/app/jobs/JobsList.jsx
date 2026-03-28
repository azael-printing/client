import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { listJobs, updateJob, cancelJob } from "../../api/jobs.api";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getMachines } from "../../../pages/api/ref.api";
import { formatJobId } from "../../../utils/jobFormatting";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

const QUOTATION_OPTIONS = ["QUOTATION_APPROVED", "QUOTATION_DENIED"];
const PAYMENT_OPTIONS = ["PAID", "PARTIAL", "UNPAID"];
const CANCEL_REASONS = [
  "Quotation does not approved",
  "Customer replay as price expensive",
  "Suddenly machine disfunction",
  "Other",
];

function Badge({ text }) {
  const map = {
    QUOTATION_APPROVED: "bg-green-100 text-green-700",
    QUOTATION_DENIED: "bg-red-100 text-red-700",
    PAID: "bg-green-100 text-green-700",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    UNPAID: "bg-zinc-100 text-zinc-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  const cls = map[text] || "bg-zinc-100 text-zinc-700";
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap",
        cls,
      )}
    >
      {text || "-"}
    </span>
  );
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
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replaceAll('"', '""')}"`;
    }
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

export default function JobsList() {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role;
  const qs = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [machineOptions, setMachineOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelJobId, setCancelJobId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOther, setCancelOther] = useState("");

  const [machineFilter, setMachineFilter] = useState(qs.get("machine") || "");
  const [statusFilter, setStatusFilter] = useState(qs.get("status") || "");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

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
  }, []);

  useEffect(() => {
    setMachineFilter(qs.get("machine") || "");
    setStatusFilter(qs.get("status") || "");
    setPage(1);
  }, [qs]);

  const filtered = useMemo(
    () =>
      (jobs || []).filter((j) => {
        const okMachine = machineFilter
          ? String(j.machine || "")
              .toLowerCase()
              .includes(machineFilter.toLowerCase())
          : true;
        const okStatus = statusFilter
          ? String(j.status || "") === statusFilter
          : true;
        const okPay = paymentFilter
          ? String(j.paymentStatus || "") === paymentFilter
          : true;
        return okMachine && okStatus && okPay;
      }),
    [jobs, machineFilter, statusFilter, paymentFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  const partialRemaining = useMemo(() => {
    const total = Number(selected?.total || 0);
    const deposit = Number(draft?.depositAmount || 0);
    const rem = total - deposit;
    return rem > 0 ? rem : 0;
  }, [selected, draft]);

  function exportExcel() {
    downloadFile(
      `jobs_export_${new Date().toISOString().slice(0, 10)}.csv`,
      toCSV(filtered),
    );
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

  async function submitUpdate() {
    if (!selected || !draft) return;

    const patch = {
      machine: draft.machine,
      status: draft.status,
    };

    if (draft.status === "QUOTATION_APPROVED") {
      patch.paymentStatus = draft.paymentStatus;
      if (draft.paymentStatus === "PARTIAL") {
        patch.depositAmount = Number(draft.depositAmount || 0);
        patch.remainingBalance = partialRemaining;
      } else if (draft.paymentStatus === "PAID") {
        patch.depositAmount = Number(selected.total || 0);
        patch.remainingBalance = 0;
      } else {
        patch.depositAmount = 0;
        patch.remainingBalance = Number(selected.total || 0);
      }
    } else {
      patch.paymentStatus = "UNPAID";
      patch.depositAmount = 0;
      patch.remainingBalance = Number(selected.total || 0);
    }

    try {
      await updateJob(selected.id, patch);
      alert("Success: Updated");
      setEditOpen(false);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Fail: Update failed");
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm min-w-0 overflow-hidden">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-lg sm:text-xl font-semibold text-primary">Jobs</h2>
          <button
            onClick={exportExcel}
            className="px-3 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold"
          >
            Export to Excel
          </button>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-primary mb-1">
              Machine
            </div>
            <input
              value={machineFilter}
              onChange={(e) => {
                setMachineFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm"
            />
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-primary mb-1">
              Status
            </div>
            <input
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm"
            />
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-primary mb-1">
              Payment Status
            </div>
            <input
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm"
            />
          </div>
        </div>

        {err && <div className="mt-3 text-red-600 text-sm font-semibold">{err}</div>}

        <div className="mt-3 overflow-x-auto rounded-2xl border border-zinc-200">
          <table className="min-w-[820px] w-full text-xs sm:text-sm">
            <thead className="text-left text-zinc-500 bg-bgLight">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">Job ID</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Customer</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Number</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Machine</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Payment Status</th>
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
                  <td className="py-2.5 px-3 font-semibold text-zinc-800 whitespace-nowrap">
                    {formatJobId(j.jobNo)}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{j.customerName}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{j.customerPhone || "-"}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{j.machine || "-"}</td>
                  <td className="py-2.5 px-3"><Badge text={j.status} /></td>
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
                  <td colSpan={7} className="py-6 px-3 text-zinc-500 font-semibold text-center">
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm font-semibold hover:bg-bgLight transition"
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
                    "px-3 py-2 rounded-lg border text-xs sm:text-sm font-semibold transition",
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
            className="px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm font-semibold hover:bg-bgLight transition"
          >
            Next
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm min-w-0">
        {!selected ? (
          <div className="text-zinc-500 text-sm font-semibold text-center mt-8">
            No job selected — select a job to see details
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="text-zinc-500 text-xs sm:text-sm font-semibold">Job Details</div>
            <div className="text-primary font-semibold text-base sm:text-lg leading-tight">
              {formatJobId(selected.jobNo)} — {selected.workType}
            </div>
            <div className="text-xs sm:text-sm text-zinc-700 font-semibold">
              Customer: <span className="font-medium">{selected.customerName}</span>
            </div>
            <div className="text-xs sm:text-sm text-zinc-700 font-semibold">
              Phone: <span className="font-medium">{selected.customerPhone || "-"}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-zinc-700">Status:</span>
              <Badge text={selected.status} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-zinc-700">Payment:</span>
              <Badge text={selected.paymentStatus || "UNPAID"} />
            </div>
            <div className="mt-2 grid gap-2 text-xs sm:text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500 font-semibold">Total</span>
                <span className="text-primary font-semibold">
                  {Math.round(selected.total || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500 font-semibold">Outstanding</span>
                <span className="text-red-600 font-semibold">
                  {Math.round(selected.remainingBalance || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {(role === "ADMIN" || role === "CS") && (
              <button
                onClick={() => {
                  setDraft({
                    machine: selected.machine || "",
                    status: QUOTATION_OPTIONS.includes(selected.status)
                      ? selected.status
                      : "QUOTATION_APPROVED",
                    paymentStatus: selected.paymentStatus || "UNPAID",
                    depositAmount: selected.depositAmount || "",
                  });
                  setEditOpen(true);
                }}
                className="mt-3 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold"
              >
                Update
              </button>
            )}

            {(role === "ADMIN" || role === "CS") && (
              <button
                onClick={openCancelModal}
                className="px-4 py-2.5 rounded-xl bg-danger text-white text-xs sm:text-sm font-semibold"
              >
                Cancel Job
              </button>
            )}
          </div>
        )}
      </div>

      {editOpen && draft && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditOpen(false)} />
          <div className="absolute left-1/2 top-1/2 w-[94%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-primary text-base sm:text-lg">Update Job</div>
              <button
                onClick={() => setEditOpen(false)}
                className="px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold hover:bg-bgLight"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Machine</div>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
                  value={draft.machine}
                  onChange={(e) => setDraft((p) => ({ ...p, machine: e.target.value }))}
                >
                  <option value="">Select Machine</option>
                  {machineOptions.map((m) => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Status</div>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
                  value={draft.status}
                  onChange={(e) => setDraft((p) => ({ ...p, status: e.target.value }))}
                >
                  {QUOTATION_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {draft.status === "QUOTATION_APPROVED" && (
                <>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Payment Status</div>
                    <select
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
                      value={draft.paymentStatus}
                      onChange={(e) => setDraft((p) => ({ ...p, paymentStatus: e.target.value }))}
                    >
                      {PAYMENT_OPTIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {draft.paymentStatus === "PARTIAL" && (
                    <>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Deposit Amount</div>
                        <input
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                          value={draft.depositAmount}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              depositAmount: e.target.value.replace(/[^0-9.]/g, ""),
                            }))
                          }
                        />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Remaining</div>
                        <input
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm"
                          value={Math.round(partialRemaining).toLocaleString()}
                          disabled
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              <button
                onClick={submitUpdate}
                className="mt-1 px-4 py-2.5 rounded-xl bg-success text-white text-xs sm:text-sm font-semibold"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setCancelOpen(false)} />
          <div className="absolute left-1/2 top-1/2 w-[94%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-primary text-base sm:text-lg">Cancel Job</div>
              <button
                onClick={() => setCancelOpen(false)}
                className="px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold hover:bg-bgLight"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-2 text-xs sm:text-sm">
              <div className="font-semibold text-zinc-700">Why are you cancelling this job?</div>
              {CANCEL_REASONS.map((r) => (
                <label key={r} className="flex items-center gap-2 font-semibold text-zinc-700">
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
                className="mt-3 px-4 py-2.5 rounded-xl bg-danger text-white text-xs sm:text-sm font-semibold"
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
