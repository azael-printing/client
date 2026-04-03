import { formatJobId } from "../../../utils/jobFormatting";
import { listFinanceJobs } from "../../api/finance.api";

export const FINANCE_COLLECTION_STATUSES = [
  "NEW_REQUEST",
  "FINANCE_WAITING_APPROVAL",
  "FINANCE_APPROVED",
  "READY_FOR_DELIVERY",
  "DELIVERED",
];

export function money(v) {
  return `ETB ${Number(v || 0).toLocaleString()}`;
}

export function getAmount(row, keys, fallback = 0) {
  for (const key of keys) {
    const val = row?.[key];
    if (val !== undefined && val !== null && val !== "") {
      return Number(val || 0);
    }
  }
  return fallback;
}

export function getPaymentStatus(job) {
  const explicit =
    job?.paymentStatus ||
    job?.financeStatus ||
    job?.invoiceStatus ||
    job?.statusLabel;

  if (explicit) {
    const text = String(explicit).toLowerCase();
    if (text.includes("partial")) return "Partial";
    if (text.includes("credit")) return "Credit";
    if (text.includes("unpaid")) return "Unpaid";
    if (text.includes("paid")) return "Paid";
  }

  const total = getAmount(job, ["total", "totalAmount", "grandTotal"], 0);
  const paid = getAmount(job, ["paid", "paidAmount", "amountPaid"], 0);
  const balance =
    job.balance !== undefined && job.balance !== null
      ? Number(job.balance || 0)
      : Math.max(total - paid, 0);

  if (balance <= 0 && total > 0) return "Paid";
  if (paid > 0 && balance > 0) return "Partial";
  if (balance > 0) return "Unpaid";
  return "Paid";
}

export function isOlderThan30Days(dateValue) {
  if (!dateValue) return false;
  const created = new Date(dateValue);
  if (Number.isNaN(created.getTime())) return false;
  const diffMs = Date.now() - created.getTime();
  return diffMs / (1000 * 60 * 60 * 24) > 30;
}

export function toInvoiceRows(jobs = []) {
  return jobs.map((j) => {
    const total = getAmount(j, ["total", "totalAmount", "grandTotal"], 0);
    const paid = getAmount(j, ["paid", "paidAmount", "amountPaid"], 0);
    const balance =
      j.balance !== undefined && j.balance !== null
        ? Number(j.balance || 0)
        : Math.max(total - paid, 0);

    return {
      ...j,
      invoiceNo: j.invoiceNo || j.invoiceNumber || `INV-${j.jobNo || j.id}`,
      displayJobId: formatJobId(j.jobNo || j.jobId || j.id),
      total,
      paid,
      balance,
      paymentLabel: getPaymentStatus(j),
      customerName: j.customerName || "-",
    };
  });
}

export function toExpenseRows(jobs = []) {
  return jobs
    .map((j) => ({
      id: j.id,
      description: j.workType || j.description || "Job expense",
      qty: j.qty || j.quantity || 1,
      total: getAmount(j, ["expenseTotal", "expense", "cost"], 0),
      purchasedBy: j.purchasedBy || j.createdByName || "-",
      category: j.category || "General",
    }))
    .filter((row) => Number(row.total) > 0);
}

export async function fetchFinanceCollection(statuses = FINANCE_COLLECTION_STATUSES) {
  const groups = await Promise.all(
    statuses.map((status) => listFinanceJobs(status).catch(() => [])),
  );
  const merged = groups.flat();
  return Array.from(new Map(merged.map((item) => [item.id, item])).values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}
