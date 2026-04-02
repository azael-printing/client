import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { formatJobId } from "../../../utils/jobFormatting";
import { listFinanceJobs } from "../../api/finance.api";

function money(v) {
  return `ETB ${Number(v || 0).toLocaleString()}`;
}

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  let cls = "bg-zinc-100 text-zinc-700";
  if (s.includes("paid") || s.includes("delivered")) cls = "bg-green-100 text-green-700";
  else if (s.includes("partial")) cls = "bg-yellow-100 text-yellow-700";
  else if (s.includes("credit")) cls = "bg-red-100 text-red-700";
  else if (s.includes("unpaid")) cls = "bg-orange-100 text-orange-700";
  return <span className={`inline-flex min-w-[74px] justify-center px-3 py-1 rounded-full text-xs font-bold ${cls}`}>{status || "-"}</span>;
}

function getAmount(row, keys, fallback = 0) {
  for (const key of keys) {
    const val = row?.[key];
    if (val !== undefined && val !== null && val !== "") return Number(val || 0);
  }
  return fallback;
}

function getPaymentStatus(job) {
  const explicit = job?.paymentStatus || job?.financeStatus || job?.invoiceStatus || job?.statusLabel;
  if (explicit) {
    const text = String(explicit).toLowerCase();
    if (text.includes("partial")) return "Partial";
    if (text.includes("credit")) return "Credit";
    if (text.includes("unpaid")) return "Unpaid";
    if (text.includes("paid")) return "Paid";
  }
  const total = getAmount(job, ["total", "totalAmount", "grandTotal"], 0);
  const paid = getAmount(job, ["paid", "paidAmount", "amountPaid"], 0);
  const balance = job.balance !== undefined && job.balance !== null ? Number(job.balance || 0) : Math.max(total - paid, 0);
  if (balance <= 0 && total > 0) return "Paid";
  if (paid > 0 && balance > 0) return "Partial";
  if (balance > 0) return "Unpaid";
  return "Paid";
}

export default function FinanceInvoiceDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const [newReq, waiting, approved, readyForDelivery, deliveryApproved, delivered] = await Promise.all([
        listFinanceJobs("NEW_REQUEST").catch(() => []),
        listFinanceJobs("FINANCE_WAITING_APPROVAL").catch(() => []),
        listFinanceJobs("FINANCE_APPROVED").catch(() => []),
        listFinanceJobs("READY_FOR_DELIVERY").catch(() => []),
        listFinanceJobs("DELIVERY_APPROVED").catch(() => []),
        listFinanceJobs("DELIVERED").catch(() => []),
      ]);
      const merged = [...newReq, ...waiting, ...approved, ...readyForDelivery, ...deliveryApproved, ...delivered];
      const unique = Array.from(new Map(merged.map((item) => [item.id, item])).values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setJobs(unique);
      setSelected((prev) => unique.find((x) => x.id === prev?.id) || unique[0] || null);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load invoice dashboard");
      setJobs([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(() => {
    return jobs.map((j) => {
      const total = getAmount(j, ["total", "totalAmount", "grandTotal"], 0);
      const paid = getAmount(j, ["paid", "paidAmount", "amountPaid"], 0);
      const balance = j.balance !== undefined && j.balance !== null ? Number(j.balance || 0) : Math.max(total - paid, 0);
      return {
        ...j,
        invoiceNo: j.invoiceNo || j.invoiceNumber || `INV-${j.jobNo || j.id}`,
        displayJobId: formatJobId(j.jobNo || j.jobId || j.id),
        total,
        paid,
        balance,
        paymentLabel: getPaymentStatus(j),
      };
    });
  }, [jobs]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);
  const active = rows.find((row) => row.id === selected?.id) || selected;

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-primary text-[30px] font-extrabold leading-none">Invoices</h2>
            <p className="mt-1 text-zinc-500 font-semibold text-sm">Finance-only view tab.</p>
          </div>
          <button type="button" className="min-w-[122px] rounded-xl bg-primary px-5 py-3 text-white font-extrabold shadow-sm hover:opacity-95 transition">Export to excel</button>
        </div>

        {err && <div className="mt-4 text-red-600 font-semibold text-sm">{err}</div>}

        <div className="mt-6 overflow-auto rounded-2xl border border-zinc-100">
          <table className="min-w-[860px] w-full table-fixed text-sm">
            <thead className="bg-zinc-50 text-zinc-900">
              <tr className="text-left">
                <th className="w-[130px] px-4 py-3 font-extrabold whitespace-nowrap">Invoices</th>
                <th className="w-[90px] px-4 py-3 font-extrabold whitespace-nowrap">JobID</th>
                <th className="px-4 py-3 font-extrabold whitespace-nowrap">Customer</th>
                <th className="w-[70px] px-4 py-3 font-extrabold whitespace-nowrap">Total</th>
                <th className="w-[70px] px-4 py-3 font-extrabold whitespace-nowrap">Paid</th>
                <th className="w-[82px] px-4 py-3 font-extrabold whitespace-nowrap">Balance</th>
                <th className="w-[96px] px-4 py-3 font-extrabold whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr><td colSpan="7" className="px-4 py-6 text-zinc-500 font-semibold">Loading invoices...</td></tr>
              ) : slice.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-6 text-zinc-500 font-semibold">No invoices found.</td></tr>
              ) : (
                slice.map((row) => (
                  <tr key={row.id} onClick={() => setSelected(row)} className={`border-t border-zinc-100 transition-colors cursor-pointer hover:bg-zinc-50/70 ${active?.id === row.id ? "bg-bgLight" : ""}`}>
                    <td className="px-4 py-2 font-medium text-zinc-800 whitespace-nowrap">{row.invoiceNo}</td>
                    <td className="px-4 py-2 font-medium text-zinc-800 whitespace-nowrap">{row.displayJobId}</td>
                    <td className="px-4 py-2 font-medium text-zinc-800 truncate">{row.customerName || "-"}</td>
                    <td className="px-4 py-2 font-medium text-zinc-800 whitespace-nowrap">{Number(row.total || 0).toLocaleString()}</td>
                    <td className="px-4 py-2 font-medium text-zinc-800 whitespace-nowrap">{Number(row.paid || 0).toLocaleString()}</td>
                    <td className="px-4 py-2 font-medium text-zinc-800 whitespace-nowrap">{Number(row.balance || 0).toLocaleString()}</td>
                    <td className="px-4 py-2"><StatusBadge status={row.paymentLabel} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>

      <aside className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-sm lg:sticky lg:top-4 self-start min-h-[420px]">
        <div className="text-primary text-[30px] font-extrabold leading-none">Job Details</div>
        <div className="mt-1 text-zinc-400 text-[16px] font-extrabold">{active ? active.displayJobId : "AZ-0000"}</div>

        <div className="mt-4 text-center text-zinc-900 space-y-2">
          <div className="text-[18px] font-extrabold">Customer Info</div>
          <div className="grid grid-cols-[1fr_auto] gap-x-3 text-[14px] leading-tight">
            <div className="font-bold">Customer name:</div><div className="text-zinc-400">{active?.customerName || "-"}</div>
            <div className="font-bold">Phone number:</div><div className="text-zinc-400">{active?.customerPhone || "-"}</div>
          </div>

          <div className="pt-2 text-[18px] font-extrabold">Job Details</div>
          <div className="grid grid-cols-[1fr_auto] gap-x-3 text-[14px] leading-tight">
            <div className="font-bold">Machine</div><div className="text-zinc-400">{active?.machine || "-"}</div>
            <div className="font-bold">Work Type</div><div className="text-zinc-400">{active?.workType || "-"}</div>
            <div className="font-bold">Description</div><div className="text-zinc-400">{active?.description || "-"}</div>
            <div className="font-bold">Quantity</div><div className="text-zinc-400">{active?.qty || "-"}</div>
            <div className="font-bold">Unit Type</div><div className="text-zinc-400">{active?.unitType || "-"}</div>
            <div className="font-bold">Designer Required</div><div className="text-zinc-400">{active?.designerRequired ? "yes" : "no"}</div>
            <div className="font-bold">Urgency Level</div><div className="text-zinc-400">{active?.urgency || "Normal"}</div>
          </div>

          <div className="pt-2 text-[18px] font-extrabold">Delivery Details</div>
          <div className="grid grid-cols-[1fr_auto] gap-x-3 text-[14px] leading-tight">
            <div className="font-bold">Delivery Date</div><div className="text-zinc-400">{active?.deliveryDate ? new Date(active.deliveryDate).toLocaleDateString() : "-"}</div>
            <div className="font-bold">Delivery Time</div><div className="text-zinc-400">{active?.deliveryTime || "-"}</div>
            <div className="font-bold">Pickup or Delivery</div><div className="text-zinc-400">{active?.deliveryType || "-"}</div>
          </div>

          <div className="pt-2 text-[18px] font-extrabold">Pricing</div>
          <div className="grid grid-cols-[1fr_auto] gap-x-3 text-[14px] leading-tight">
            <div className="font-bold">Total price</div><div className="text-zinc-400">{money(active?.total || 0)}</div>
            <div className="font-bold">Payment Status</div><div className="text-zinc-400">{active?.paymentLabel || "-"}</div>
            <div className="font-bold">Deposit Amount</div><div className="text-zinc-400">{money(active?.paid || 0)}</div>
            <div className="font-bold">Remaining Balance</div><div className="text-zinc-400">{money(active?.balance || 0)}</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
