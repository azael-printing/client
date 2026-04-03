import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useDialog } from "../../../components/common/DialogProvider";
import Pagination from "../../../components/common/Pagination";
import JobInlineEditor from "../../../components/common/JobInlineEditor";
import { cancelJob, deleteJob, listJobs, updateJob } from "../../api/jobs.api";
import { getMachines } from "../../api/ref.api";
import { formatJobId } from "../../../utils/jobFormatting";
import {
  PAYMENT_OPTIONS,
  buildJobDraft,
  normalizeMachineOptions,
  toUpdatePayload,
} from "../../../utils/jobEditor";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

const STATUS_OPTIONS = [
  "NEW_REQUEST",
  "FINANCE_WAITING_APPROVAL",
  "FINANCE_APPROVED",
  "DESIGN_PENDING",
  "DESIGN_WAITING",
  "IN_DESIGN",
  "DESIGN_DONE",
  "PRODUCTION_PENDING",
  "PRODUCTION_WAITING",
  "IN_PRODUCTION",
  "PRODUCTION_DONE",
  "READY_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const QUOTATION_STATUS_OPTIONS = ["QUOTATION_APPROVED", "QUOTATION_DENIED"];
const QUOTE_PAYMENT_OPTIONS = ["PAID", "PARTIAL", "UNPAID"];

const CANCEL_REASONS = [
  "Quotation does not approved",
  "Customer replay as price expensive",
  "Suddenly machine disfunction",
  "Other",
];

function Badge({ text }) {
  const map = {
    FINANCE_APPROVED: "bg-green-100 text-green-700",
    READY_FOR_DELIVERY: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    PAID: "bg-green-100 text-green-700",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    CREDIT: "bg-orange-100 text-orange-700",
    CANCELLED: "bg-red-100 text-red-700",
    UNPAID: "bg-zinc-100 text-zinc-700",
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

export default function JobsList() {
  const location = useLocation();
  const { user } = useAuth();
  const dialog = useDialog();
  const role = user?.role;
  const canManage = role === "ADMIN" || role === "CS";
  const isTopLevelAdminJobs = location.pathname === "/app/admin/jobs";
  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [machineOptions, setMachineOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelJobId, setCancelJobId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOther, setCancelOther] = useState("");

  const [machineFilter, setMachineFilter] = useState(qs.get("machine") || "");
  const [statusFilter, setStatusFilter] = useState(qs.get("status") || "");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const data = await listJobs();
      setJobs(data || []);

      if (selected) {
        const found = (data || []).find((x) => x.id === selected.id);
        setSelected(found || null);
        if (found && editingId === found.id) {
          setDraft(buildJobDraft(found));
        }
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
    }

    try {
      const ms = await getMachines();
      setMachineOptions(normalizeMachineOptions(ms || []));
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

  const machineFilterOptions = useMemo(() => {
    const merged = [
      ...machineOptions,
      ...normalizeMachineOptions(jobs.map((job) => job.machine).filter(Boolean)),
    ];
    return normalizeMachineOptions(merged.map((item) => item.value || item.label));
  }, [jobs, machineOptions]);

  const filtered = useMemo(
    () =>
      (jobs || []).filter((j) => {
        const okMachine = machineFilter ? String(j.machine || "") === machineFilter : true;
        const okStatus = statusFilter ? String(j.status || "") === statusFilter : true;
        const okPay = paymentFilter ? String(j.paymentStatus || "") === paymentFilter : true;
        return okMachine && okStatus && okPay;
      }),
    [jobs, machineFilter, statusFilter, paymentFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  async function openDelete(job) {
    const ok = await dialog.confirm(`Delete ${formatJobId(job.jobNo)} permanently?`);
    if (!ok) return;
    try {
      await deleteJob(job.id);
      if (selected?.id === job.id) setSelected(null);
      if (editingId === job.id) {
        setEditingId("");
        setDraft(null);
      }
      dialog.toast("Job deleted", "success");
      await load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Delete failed", "error");
    }
  }

  function startEditing(job) {
    setSelected(job);
    setEditingId(job.id);
    setDraft(buildJobDraft(job));
    if (isTopLevelAdminJobs) setUpdateModalOpen(true);
  }

  function stopEditing() {
    setEditingId("");
    setDraft(null);
    setUpdateModalOpen(false);
  }

  function openCancelModal() {
    if (!selected) return dialog.alert("Select a job first");
    setCancelJobId(selected.id);
    setCancelReason("");
    setCancelOther("");
    setCancelOpen(true);
  }

  async function confirmCancel() {
    const finalReason = cancelReason === "Other" ? cancelOther.trim() : cancelReason;
    if (!finalReason) return dialog.alert("Select a cancellation reason");

    try {
      await cancelJob(cancelJobId, finalReason, "");
      dialog.toast("Job cancelled", "success");
      setCancelOpen(false);
      setSelected(null);
      stopEditing();
      await load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Cancel failed", "error");
    }
  }

  async function submitUpdate() {
    if (!selected || !draft) return;

    if (isTopLevelAdminJobs && draft.status === "QUOTATION_DENIED") {
      try {
        await cancelJob(selected.id, "Quotation denied", "");
        dialog.toast("Quotation denied and job cancelled", "success");
        stopEditing();
        setSelected(null);
        await load();
      } catch (e) {
        dialog.toast(e?.response?.data?.message || "Update failed", "error");
      }
      return;
    }

    const payload = toUpdatePayload(
      isTopLevelAdminJobs
        ? { ...draft, status: selected.status === "CANCELLED" ? "NEW_REQUEST" : selected.status }
        : draft,
      { includePayment: role === "ADMIN" },
    );

    if (!payload.customerName || !payload.machine || !payload.workType || !payload.qty || !payload.unitPrice) {
      return dialog.alert("Customer, machine, work type, quantity, and unit price are required");
    }

    try {
      await updateJob(selected.id, payload);
      dialog.toast("Job updated", "success");
      stopEditing();
      await load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Update failed", "error");
    }
  }

  const selectedTotal = Number(selected?.total || 0);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_348px]">
      <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm min-w-0 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-lg sm:text-xl font-semibold text-primary">Jobs</h2>
          <div className="text-xs sm:text-sm font-semibold text-zinc-500">Page size: 10</div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-primary mb-1">Machine</div>
            <select value={machineFilter} onChange={(e) => { setMachineFilter(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary/40 outline-none">
              <option value="">All Machines</option>
              {machineFilterOptions.map((m) => (
                <option key={m.key} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-primary mb-1">Status</div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary/40 outline-none">
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-primary mb-1">Payment Status</div>
            <select value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary/40 outline-none">
              <option value="">All Payments</option>
              {PAYMENT_OPTIONS.map((payment) => (
                <option key={payment} value={payment}>{payment}</option>
              ))}
            </select>
          </div>
        </div>

        {err && <div className="mt-3 text-red-600 text-sm font-semibold">{err}</div>}

        <div className="mt-3 overflow-x-auto rounded-2xl border border-zinc-200">
          <table className="min-w-[1080px] w-full text-xs sm:text-sm">
            <thead className="text-left text-zinc-500 bg-bgLight">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">Job ID</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Customer</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Number</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Work Type</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Machine</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Payment</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Delivery</th>
                {canManage && <th className="py-2.5 px-3 whitespace-nowrap">Action</th>}
              </tr>
            </thead>
            <tbody>
              {slice.map((j) => (
                <tr key={j.id} onClick={() => setSelected(j)} className={cn("border-t border-zinc-200 cursor-pointer transition-all duration-300 hover:bg-zinc-50", selected?.id === j.id ? "bg-bgLight" : "") }>
                  <td className="py-2.5 px-3 font-semibold text-zinc-800 whitespace-nowrap">{formatJobId(j.jobNo)}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{j.customerName}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{j.customerPhone || "-"}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{j.workType || "-"}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{j.machine || "-"}</td>
                  <td className="py-2.5 px-3"><Badge text={j.status} /></td>
                  <td className="py-2.5 px-3"><Badge text={j.paymentStatus || "UNPAID"} /></td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{j.deliveryDate ? String(j.deliveryDate).slice(0, 10) : "-"}</td>
                  {canManage && (
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(j);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDelete(j);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-500 text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {slice.length === 0 && (
                <tr>
                  <td colSpan={canManage ? 9 : 8} className="py-6 px-3 text-zinc-500 font-semibold text-center">No jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm min-w-0 lg:sticky lg:top-5 self-start transition-all duration-300 hover:shadow-md hover:border-primary/20 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
        {!selected ? (
          <div className="text-zinc-500 text-sm font-semibold text-center mt-8">No job selected — select a job to see details</div>
        ) : editingId === selected.id && draft && !isTopLevelAdminJobs ? (
          <div className="grid gap-4">
            <div>
              <div className="text-zinc-500 text-xs sm:text-sm font-semibold">{isTopLevelAdminJobs ? "Update Job" : "Inline Edit"}</div>
              <div className="text-primary font-semibold text-base sm:text-lg leading-tight">{formatJobId(selected.jobNo)} — {selected.workType}</div>
              <div className="text-xs text-zinc-500 font-semibold mt-1">{isTopLevelAdminJobs ? "Update the selected job here, then save or cancel." : "Edit directly here. No popup update box."}</div>
            </div>

            <JobInlineEditor
              draft={draft}
              setDraft={setDraft}
              machineOptions={machineOptions}
              statusOptions={STATUS_OPTIONS}
              canEditPayment={role === "ADMIN"}
              paymentNote="Payment status is editable only for Admin."
            />

            <div className="grid gap-2">
              <button onClick={submitUpdate} className="w-full rounded-xl border border-primary bg-white px-4 py-2.5 text-xs font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-bgLight hover:shadow-sm sm:text-sm">Update Job</button>
              <button onClick={stopEditing} className="w-full rounded-xl border border-red-500 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-50 hover:text-white hover:shadow-sm hover:[background-color:#ef4444] sm:text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="text-zinc-500 text-xs sm:text-sm font-semibold">Job Summary Panel</div>
            <div className="text-primary font-semibold text-base sm:text-lg leading-tight">{formatJobId(selected.jobNo)} — {selected.workType}</div>
            <div className="text-xs sm:text-sm text-zinc-700 font-semibold">Customer: <span className="font-medium">{selected.customerName}</span></div>
            <div className="text-xs sm:text-sm text-zinc-700 font-semibold">Phone: <span className="font-medium">{selected.customerPhone || "-"}</span></div>
            <div className="text-xs sm:text-sm text-zinc-700 font-semibold">Machine: <span className="font-medium">{selected.machine || "-"}</span></div>
            <div className="text-xs sm:text-sm text-zinc-700 font-semibold">Description text:</div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs sm:text-sm text-zinc-700 font-medium break-words">{selected.description || "-"}</div>
            <div className="flex items-center gap-2 flex-wrap"><span className="text-xs sm:text-sm font-semibold text-zinc-700">Status:</span><Badge text={selected.status} /></div>
            <div className="flex items-center gap-2 flex-wrap"><span className="text-xs sm:text-sm font-semibold text-zinc-700">Payment:</span><Badge text={selected.paymentStatus || "UNPAID"} /></div>
            <div className="mt-2 grid gap-2 text-xs sm:text-sm">
              <div className="flex justify-between gap-2"><span className="text-zinc-500 font-semibold">Quantity</span><span className="text-zinc-900 font-semibold">{selected.qty} {selected.unitType}</span></div>
              <div className="flex justify-between gap-2"><span className="text-zinc-500 font-semibold">Unit price</span><span className="text-zinc-900 font-semibold">{Math.round(Number(selected.unitPrice || 0)).toLocaleString()}</span></div>
              <div className="flex justify-between gap-2"><span className="text-zinc-500 font-semibold">Total</span><span className="text-primary font-semibold">{Math.round(selectedTotal).toLocaleString()}</span></div>
              <div className="flex justify-between gap-2"><span className="text-zinc-500 font-semibold">Outstanding</span><span className="text-red-600 font-semibold">{Math.round(Number(selected.remainingBalance || 0)).toLocaleString()}</span></div>
            </div>
            {canManage ? (
              <div className="mt-2 grid gap-2">
                <button
                  onClick={() => startEditing(selected)}
                  className="w-full rounded-xl border border-primary bg-white px-4 py-2.5 text-xs font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-bgLight hover:shadow-sm sm:text-sm"
                >
                  {isTopLevelAdminJobs ? "Update" : "Edit Inline"}
                </button>
                <button
                  onClick={openCancelModal}
                  className="w-full rounded-xl border border-red-500 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-50 hover:text-white hover:shadow-sm hover:[background-color:#ef4444] sm:text-sm"
                >
                  {isTopLevelAdminJobs ? "Cancel" : "Cancel Job"}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {updateModalOpen && editingId === selected?.id && draft && isTopLevelAdminJobs && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" onClick={stopEditing} />
          <div className="absolute left-1/2 top-1/2 w-[94%] max-w-[760px] -translate-x-1/2 -translate-y-1/2 bg-white border border-zinc-200 rounded-3xl p-4 sm:p-5 shadow-2xl max-h-[88vh] overflow-auto">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-primary text-base sm:text-lg">Update Job</div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-500 mt-1">{formatJobId(selected.jobNo)} — {selected.workType}</div>
              </div>
              <button onClick={stopEditing} className="px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold hover:bg-bgLight">Close</button>
            </div>

            <div className="mt-4">
              <div className="mx-auto max-w-[700px]">
              <JobInlineEditor
                draft={draft}
                setDraft={setDraft}
                machineOptions={machineOptions}
                statusOptions={STATUS_OPTIONS}
                canEditPayment={role === "ADMIN"}
                paymentNote="Payment status is editable only for Admin."
              />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button onClick={submitUpdate} className="flex-1 px-4 py-2.5 rounded-xl bg-success text-white text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Update Job</button>
              <button onClick={stopEditing} className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold hover:bg-bgLight transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {cancelOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" onClick={() => setCancelOpen(false)} />
          <div className="absolute left-1/2 top-1/2 w-[94%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white border border-zinc-200 rounded-3xl p-4 sm:p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-primary text-base sm:text-lg">Cancel Job</div>
              <button onClick={() => setCancelOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold hover:bg-bgLight">Close</button>
            </div>
            <div className="mt-4 grid gap-2 text-xs sm:text-sm">
              <div className="font-semibold text-zinc-700">Why are you cancelling this job?</div>
              {CANCEL_REASONS.map((reason) => (
                <label key={reason} className="flex items-center gap-2 font-semibold text-zinc-700">
                  <input type="radio" name="cancelReason" checked={cancelReason === reason} onChange={() => setCancelReason(reason)} />{reason}
                </label>
              ))}
              {cancelReason === "Other" ? <input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" placeholder="Write reason..." value={cancelOther} onChange={(e) => setCancelOther(e.target.value)} /> : null}
              <button onClick={confirmCancel} className="mt-3 px-4 py-2.5 rounded-xl bg-danger text-white text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
