import {
  COMMON_UNIT_OPTIONS,
  DELIVERY_OPTIONS,
  PAYMENT_OPTIONS,
  URGENCY_OPTIONS,
  computeJobDraftTotals,
} from "../../utils/jobEditor";

function fieldClass() {
  return "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-300 hover:border-primary/30 focus:border-primary/40";
}

export default function JobInlineEditor({
  draft,
  setDraft,
  machineOptions = [],
  statusOptions = [],
  canEditPayment = false,
  paymentNote,
}) {
  const totals = computeJobDraftTotals(draft);

  function patch(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Customer name</div>
          <input className={fieldClass()} value={draft.customerName} onChange={(e) => patch("customerName", e.target.value)} />
        </div>
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Phone</div>
          <input className={fieldClass()} value={draft.customerPhone} onChange={(e) => patch("customerPhone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Machine</div>
          <select className={fieldClass()} value={draft.machine} onChange={(e) => patch("machine", e.target.value)}>
            <option value="">Select machine</option>
            {machineOptions.map((m) => (
              <option key={m.key} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Work type</div>
          <input className={fieldClass()} value={draft.workType} onChange={(e) => patch("workType", e.target.value)} />
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Description</div>
        <textarea className={`${fieldClass()} min-h-[84px] resize-y`} value={draft.description} onChange={(e) => patch("description", e.target.value)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Quantity</div>
          <input className={fieldClass()} value={draft.qty} onChange={(e) => patch("qty", e.target.value.replace(/[^0-9.]/g, ""))} />
        </div>
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Unit</div>
          <select className={fieldClass()} value={draft.unitType} onChange={(e) => patch("unitType", e.target.value)}>
            {COMMON_UNIT_OPTIONS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Unit price</div>
          <input className={fieldClass()} value={draft.unitPrice} onChange={(e) => patch("unitPrice", e.target.value.replace(/[^0-9.]/g, ""))} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">VAT</div>
          <select className={fieldClass()} value={draft.vatEnabled ? "YES" : "NO"} onChange={(e) => patch("vatEnabled", e.target.value === "YES")}>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </div>
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Urgency</div>
          <select className={fieldClass()} value={draft.urgency} onChange={(e) => patch("urgency", e.target.value)}>
            {URGENCY_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Status</div>
          <select className={fieldClass()} value={draft.status} onChange={(e) => patch("status", e.target.value)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Delivery type</div>
          <select className={fieldClass()} value={draft.deliveryType} onChange={(e) => patch("deliveryType", e.target.value)}>
            {DELIVERY_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Delivery date</div>
          <input type="date" className={fieldClass()} value={draft.deliveryDate} onChange={(e) => patch("deliveryDate", e.target.value)} />
        </div>
        <div>
          <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Delivery time</div>
          <input type="time" className={fieldClass()} value={draft.deliveryTime} onChange={(e) => patch("deliveryTime", e.target.value)} />
        </div>
      </div>

      <label className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-700">
        <input type="checkbox" checked={draft.designerRequired} onChange={(e) => patch("designerRequired", e.target.checked)} />
        Designer required
      </label>

      {canEditPayment ? (
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Payment status</div>
              <select className={fieldClass()} value={draft.paymentStatus} onChange={(e) => patch("paymentStatus", e.target.value)}>
                {PAYMENT_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            {draft.paymentStatus === "PARTIAL" ? (
              <div>
                <div className="mb-1 text-xs sm:text-sm font-semibold text-zinc-700">Deposit amount</div>
                <input className={fieldClass()} value={draft.depositAmount} onChange={(e) => patch("depositAmount", e.target.value.replace(/[^0-9.]/g, ""))} />
              </div>
            ) : null}
          </div>
          <div className="grid gap-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between gap-3"><span className="font-semibold text-zinc-500">Subtotal</span><span className="font-semibold text-zinc-900">{Math.round(totals.subtotal).toLocaleString()}</span></div>
            <div className="flex items-center justify-between gap-3"><span className="font-semibold text-zinc-500">VAT</span><span className="font-semibold text-zinc-900">{Math.round(totals.vatAmount).toLocaleString()}</span></div>
            <div className="flex items-center justify-between gap-3"><span className="font-semibold text-zinc-500">Total</span><span className="font-semibold text-primary">{Math.round(totals.total).toLocaleString()}</span></div>
            {draft.paymentStatus === "PARTIAL" ? <div className="flex items-center justify-between gap-3"><span className="font-semibold text-zinc-500">Remaining</span><span className="font-semibold text-red-600">{Math.round(totals.remaining).toLocaleString()}</span></div> : null}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-500">
          {paymentNote || "Payment status is disabled here."}
        </div>
      )}
    </div>
  );
}
