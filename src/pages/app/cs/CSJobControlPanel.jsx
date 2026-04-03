import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { listJobs, updateJob } from "../../api/jobs.api";
import { useInterval } from "../../../app/hooks/useInterval";
import { useDialog } from "../../../components/common/DialogProvider";
import Pagination from "../../../components/common/Pagination";
import JobInlineEditor from "../../../components/common/JobInlineEditor";
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

function csState(job) {
  const s = job.status || "";
  if (s === "FINANCE_APPROVED") return { text: "Approved", tone: "green" };
  if (s === "FINANCE_WAITING_APPROVAL") return { text: "Quoted", tone: "blue" };
  if (s === "NEW_REQUEST") return { text: "Quoted", tone: "blue" };
  return { text: "Approved", tone: "green" };
}

function currentStatusBadge(job) {
  const s = job.status || "";

  if (s === "DESIGN_PENDING") return { text: "Design pending", tone: "purple" };
  if (s.includes("DESIGN") || s === "IN_DESIGN") return { text: "In Design", tone: "purple" };
  if (s.includes("PRODUCTION") || s === "IN_PRODUCTION") return { text: "Printing", tone: "blue" };
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

function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const set = new Set([1, total, current, current - 1, current + 1]);
  const nums = Array.from(set).filter((n) => n >= 1 && n <= total);
  nums.sort((a, b) => a - b);

  const out = [];
  for (let i = 0; i < nums.length; i += 1) {
    const n = nums[i];
    const prev = nums[i - 1];
    if (i > 0 && n - prev > 1) out.push("…");
    out.push(n);
  }
  return out;
}

export default function CSJobControlPanel() {
  const navigate = useNavigate();
  const dialog = useDialog();

  const location = useLocation();
  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [machineOptions, setMachineOptions] = useState([]);

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
      try {
        const ms = await getMachines();
        setMachineOptions(normalizeMachineOptions(ms || []));
      } catch {
        setMachineOptions([]);
      }

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
  }

  useEffect(() => {
    load();
  }, []);

  useInterval(load, 5000);

  useEffect(() => {
    setMachineFilter(qs.get("machine") || "");
    setStatusFilter(qs.get("status") || "");
    setPage(1);
  }, [qs]);

  useEffect(() => {
    setPage(1);
  }, [machineFilter, statusFilter, paymentFilter]);

  const statusOptions = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => j.status && set.add(j.status));
    return Array.from(set).sort();
  }, [jobs]);

  const machineFilterOptions = useMemo(() => {
    const merged = [
      ...machineOptions,
      ...normalizeMachineOptions(jobs.map((job) => job.machine).filter(Boolean)),
    ];
    return normalizeMachineOptions(merged.map((item) => item.value || item.label));
  }, [jobs, machineOptions]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const okM = machineFilter ? (j.machine || "") === machineFilter : true;
      const okS = statusFilter ? (j.status || "") === statusFilter : true;
      const okP = paymentFilter ? (j.paymentStatus || "") === paymentFilter : true;
      return okM && okS && okP;
    });
  }, [jobs, machineFilter, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);

  const slice = useMemo(() => filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize), [filtered, pageSafe, pageSize]);
  const pageList = useMemo(() => buildPageList(pageSafe, totalPages), [pageSafe, totalPages]);

  function openDetails(job) {
    setSelected(job);
    const el = rowRefs.current[job.id];
    if (el?.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function startEditing(job) {
    setSelected(job);
    setEditingId(job.id);
    setDraft(buildJobDraft(job));
  }

  function stopEditing() {
    setEditingId("");
    setDraft(null);
  }

  async function submitUpdate() {
    if (!selected || !draft) return;

    const payload = toUpdatePayload(draft, { includePayment: false });
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

  function goToExactPage(job) {
    const s = job.status || "";
    if (s.includes("DESIGN") || s === "IN_DESIGN") return navigate(`/app/cs/design?jobId=${job.id}`);
    if (s.includes("PRODUCTION") || s === "IN_PRODUCTION") return navigate(`/app/cs/production?jobId=${job.id}`);
    if (s === "DELIVERED" || s === "READY_FOR_DELIVERY") return navigate(`/app/cs/completed?jobId=${job.id}`);
    return navigate(`/app/cs/new?jobId=${job.id}`);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_348px]">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <div className="text-2xl font-bold text-primary leading-tight">Job Control Panel</div>
        <div className="text-zinc-400 font-normal text-sm">Overview of Orders and Quotations</div>

        <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
          <div>
            <div className="mb-1 font-semibold text-primary">Machine</div>
            <select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-normal transition-all duration-300 hover:border-primary/30 focus:border-primary/40 outline-none" value={machineFilter} onChange={(e) => setMachineFilter(e.target.value)}>
              <option value="">All</option>
              {machineFilterOptions.map((m) => (
                <option key={m.key} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1 font-semibold text-primary">Status</div>
            <select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-normal transition-all duration-300 hover:border-primary/30 focus:border-primary/40 outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1 font-semibold text-primary">Payment Status</div>
            <select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-normal transition-all duration-300 hover:border-primary/30 focus:border-primary/40 outline-none" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
              <option value="">All</option>
              {PAYMENT_OPTIONS.map((payment) => (
                <option key={payment} value={payment}>{payment}</option>
              ))}
            </select>
          </div>
        </div>

        {err ? <div className="mt-3 text-red-600 font-normal">{err}</div> : null}

        <div className="mt-4 overflow-auto rounded-2xl border border-zinc-200">
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
                    ref={(el) => {
                      rowRefs.current[j.id] = el;
                    }}
                    onClick={() => openDetails(j)}
                    className={cn(
                      "border-t border-zinc-200 cursor-pointer transition-all duration-300",
                      selected?.id === j.id ? "bg-bgLight" : "hover:bg-bgLight",
                    )}
                  >
                    <td className="py-2 px-3 font-normal text-sm text-zinc-800">{formatJobId(j.jobNo)}</td>
                    <td className="py-2 px-3">{j.customerName}</td>
                    <td className="py-2 px-3 text-zinc-500 font-normal">{timeLeft(j)}</td>
                    <td className="py-2 px-3"><Badge text={cs.text} tone={cs.tone} /></td>
                    <td className="py-2 px-3"><Badge text={pay.text} tone={pay.tone} /></td>
                    <td className="py-2 px-3"><Badge text={st.text} tone={st.tone} /></td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(j);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToExactPage(j);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-zinc-200 font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-bgLight"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {slice.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 px-3 text-zinc-500 font-normal">No jobs found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 self-start lg:sticky lg:top-4">
        {!selected ? (
          <div className="text-zinc-500 font-normal text-center mt-10">no job selected — select the job to see the detail</div>
        ) : editingId === selected.id && draft ? (
          <div className="grid gap-4">
            <div>
              <div className="text-zinc-500 font-semibold text-sm">Inline Edit</div>
              <div className="text-primary font-semibold text-[18px]">{formatJobId(selected.jobNo)} — {selected.workType}</div>
              <div className="text-xs text-zinc-500 font-semibold mt-1">Customer Service can edit the order details here, but payment status stays locked.</div>
            </div>

            <JobInlineEditor
              draft={draft}
              setDraft={setDraft}
              machineOptions={machineOptions}
              statusOptions={statusOptions}
              canEditPayment={false}
              paymentNote="Payment status is disabled here for Customer Service."
            />

            <div className="flex flex-wrap gap-2">
              <button onClick={submitUpdate} className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Update Job</button>
              <button onClick={stopEditing} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold hover:bg-bgLight transition">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="text-zinc-500 font-semibold">Job Details</div>
            <div className="text-primary font-semibold text-[18px]">{formatJobId(selected.jobNo)} — {selected.workType}</div>

            <div className="text-sm text-zinc-700 font-semibold">Customer: <span className="font-medium">{selected.customerName}</span></div>
            <div className="text-sm text-zinc-700 font-semibold">Phone: <span className="font-medium">{selected.customerPhone || "-"}</span></div>
            <div className="text-sm text-zinc-700 font-semibold">Machine: <span className="font-medium">{selected.machine || "-"}</span></div>
            <div className="text-sm text-zinc-700 font-semibold">Status: <span className="font-medium">{selected.status || "-"}</span></div>

            <div className="mt-2 text-sm text-zinc-700 font-semibold">
              Description text:
              <div className="mt-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-600 font-medium break-words">{selected.description || "-"}</div>
            </div>

            <div className="mt-2 text-sm text-zinc-700 font-semibold">Qty: <span className="font-medium">{selected.qty} {selected.unitType}</span></div>
            <div className="mt-2 text-sm text-zinc-700 font-semibold">Payment: <span className="font-medium">{selected.paymentStatus}</span></div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={() => startEditing(selected)} className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Edit Inline</button>
              <button onClick={() => goToExactPage(selected)} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold hover:bg-bgLight transition">Open Page</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
