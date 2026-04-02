export const PAYMENT_OPTIONS = ["UNPAID", "PARTIAL", "PAID", "CREDIT"];
export const COMMON_UNIT_OPTIONS = ["pcs", "sqm", "meter", "set", "box"];
export const URGENCY_OPTIONS = ["NORMAL", "HIGH", "URGENT"];
export const DELIVERY_OPTIONS = ["PICKUP", "DELIVERY"];

export function normalizeMachineOptions(input) {
  const items = Array.isArray(input) ? input : [];
  const seen = new Set();
  const out = [];

  for (const item of items) {
    const value = typeof item === "string" ? item : item?.name || "";
    const key = typeof item === "string" ? item : item?.id || item?.name || "";
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push({ key, value, label: value });
  }

  return out;
}

export function buildJobDraft(job) {
  return {
    customerName: job?.customerName || "",
    customerPhone: job?.customerPhone || "",
    machine: job?.machine || "",
    workType: job?.workType || "",
    description: job?.description || "",
    qty: job?.qty !== undefined && job?.qty !== null ? String(job.qty) : "",
    unitType: job?.unitType || "pcs",
    designerRequired: Boolean(job?.designerRequired),
    urgency: job?.urgency || "NORMAL",
    deliveryDate: job?.deliveryDate ? String(job.deliveryDate).slice(0, 10) : "",
    deliveryTime: job?.deliveryTime || "",
    deliveryType: job?.deliveryType || "PICKUP",
    unitPrice:
      job?.unitPrice !== undefined && job?.unitPrice !== null
        ? String(job.unitPrice)
        : "",
    vatEnabled: job?.vatEnabled !== false,
    status: job?.status || "NEW_REQUEST",
    paymentStatus: job?.paymentStatus || "UNPAID",
    depositAmount:
      job?.depositAmount !== undefined && job?.depositAmount !== null
        ? String(job.depositAmount)
        : "0",
  };
}

export function computeJobDraftTotals(draft) {
  const qty = Number(draft?.qty || 0);
  const unitPrice = Number(draft?.unitPrice || 0);
  const subtotal = qty * unitPrice;
  const vatAmount = draft?.vatEnabled ? subtotal * 0.15 : 0;
  const total = subtotal + vatAmount;
  const deposit = Number(draft?.depositAmount || 0);
  const remaining = Math.max(0, total - deposit);

  return { qty, unitPrice, subtotal, vatAmount, total, deposit, remaining };
}

export function toUpdatePayload(draft, { includePayment = false } = {}) {
  const totals = computeJobDraftTotals(draft);
  const payload = {
    customerName: String(draft?.customerName || "").trim(),
    customerPhone: String(draft?.customerPhone || "").trim(),
    machine: String(draft?.machine || "").trim(),
    workType: String(draft?.workType || "").trim(),
    description: String(draft?.description || "").trim(),
    qty: totals.qty,
    unitType: String(draft?.unitType || "pcs").trim(),
    designerRequired: Boolean(draft?.designerRequired),
    urgency: draft?.urgency || "NORMAL",
    deliveryDate: draft?.deliveryDate || null,
    deliveryTime: draft?.deliveryTime || null,
    deliveryType: draft?.deliveryType || "PICKUP",
    unitPrice: totals.unitPrice,
    vatEnabled: Boolean(draft?.vatEnabled),
    status: draft?.status || "NEW_REQUEST",
  };

  if (includePayment) {
    payload.paymentStatus = draft?.paymentStatus || "UNPAID";
    if (payload.paymentStatus === "PARTIAL") {
      payload.depositAmount = totals.deposit;
      payload.remainingBalance = totals.remaining;
    }
  }

  return payload;
}
