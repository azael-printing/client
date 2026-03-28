export function formatJobCode(jobNo) {
  const raw = String(jobNo ?? "").trim();
  if (!raw) return "AZ-0000";
  const digits = raw.replace(/\D/g, "");
  if (digits) return `AZ-${digits.padStart(4, "0")}`;
  return `AZ-${raw}`;
}

export function normalizePaymentStatus(status) {
  return String(status || "").trim().toUpperCase();
}

export function isEligiblePaymentStatus(status) {
  const s = normalizePaymentStatus(status);
  return (
    s === "UNPAID" ||
    s === "PARTIAL" ||
    s === "PARTIAL_PAID" ||
    s === "CREDIT"
  );
}

export function getNextDocNumber(storageKey, prefix) {
  const raw = Number(localStorage.getItem(storageKey) || "0");
  const next = raw + 1;
  localStorage.setItem(storageKey, String(next));
  return `${prefix}${String(next).padStart(7, "0")}`;
}

export function getOrCreateInvoiceNumber(job) {
  return (
    job?.invoiceNumber ||
    job?.invoiceNo ||
    getNextDocNumber("azael_invoice_counter", "AZ-INV-")
  );
}

export function deriveExVatUnitPrice(job) {
  if (job?.unitPrice != null && job?.unitPrice !== "") {
    return String(Math.round(Number(job.unitPrice) || 0));
  }

  const qty = Number(job?.qty ?? job?.quantity ?? 0);
  const total = Number(job?.total ?? 0);

  if (qty <= 0 || total <= 0) return "";

  const vatEnabled = Boolean(job?.vatEnabled);
  const subtotal = vatEnabled ? total / 1.15 : total;
  return String(Math.round(subtotal / qty));
}
