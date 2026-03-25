import { useEffect, useMemo, useRef, useState } from "react";
import invoiceTemplate from "../../../assets/invoice-template.png";
import { listJobs } from "../../api/jobs.api";

function onlyNumberLike(v) {
  return String(v || "").replace(/[^\d.]/g, "");
}

function safeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

function formatMoney(v) {
  return Number(v || 0).toLocaleString();
}

function todayDisplay() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getNextDocNumber(storageKey, prefix) {
  const raw = Number(localStorage.getItem(storageKey) || "0");
  const next = raw + 1;
  localStorage.setItem(storageKey, String(next));
  return `${prefix}${String(next).padStart(7, "0")}`;
}

function autoGrow(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase();
}

function isEligiblePaymentStatus(status) {
  const s = normalizeStatus(status);
  return (
    s === "UNPAID" || s === "PARTIAL" || s === "PARTIAL_PAID" || s === "CREDIT"
  );
}

function deriveDescription(job) {
  return (
    job?.description ||
    job?.workType ||
    job?.jobDescription ||
    job?.itemName ||
    ""
  );
}

function deriveQty(job) {
  return job?.qty ?? job?.quantity ?? "";
}

function deriveUnitType(job) {
  return job?.unitType || job?.unit || "pcs";
}

function deriveUnitPrice(job) {
  if (job?.unitPrice != null && job?.unitPrice !== "") {
    return String(job.unitPrice);
  }

  const qty = Number(job?.qty ?? job?.quantity ?? 0);
  const total = Number(job?.total ?? 0);

  if (qty > 0 && total > 0) {
    return String(Math.round(total / qty));
  }

  return "";
}

function deriveDeliveryDate(job) {
  if (!job?.deliveryDate) return "";
  return String(job.deliveryDate).slice(0, 10);
}

function deriveDeliveryTime(job) {
  return job?.deliveryTime || "";
}

function deriveTin(job) {
  return job?.tin || job?.customerTin || "";
}

export default function AdminInvoice() {
  const [docNumber] = useState(() =>
    getNextDocNumber("azael_invoice_counter", "AZ-INV-"),
  );

  const [allJobs, setAllJobs] = useState([]);
  const [jobsErr, setJobsErr] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const textRef = useRef(null);

  const [f, setF] = useState({
    customerName: "",
    tin: "",
    description: "",
    quantity: "",
    unitType: "pcs",
    unitPrice: "",
    deliveryDate: "",
    deliveryTime: "",
    accountName: "[Your Company Name]",
    bankName: "[Bank Name]",
    accountNumber: "[Account Number]",
  });

  const [items, setItems] = useState([]);

  function update(key, value) {
    setF((p) => ({ ...p, [key]: value }));
  }

  useEffect(() => {
    (async () => {
      try {
        setJobsErr("");
        const jobs = await listJobs();
        const eligible = (jobs || []).filter((j) =>
          isEligiblePaymentStatus(j.paymentStatus),
        );
        setAllJobs(eligible);
      } catch (e) {
        setJobsErr(e?.response?.data?.message || "Failed to load jobs");
        setAllJobs([]);
      }
    })();
  }, []);

  const matchedJobs = useMemo(() => {
    const q = f.customerName.trim().toLowerCase();
    if (!q) return [];

    return allJobs.filter((j) =>
      String(j.customerName || "")
        .toLowerCase()
        .includes(q),
    );
  }, [allJobs, f.customerName]);

  const exactCustomerJobs = useMemo(() => {
    const q = f.customerName.trim().toLowerCase();
    if (!q) return [];

    return allJobs.filter(
      (j) =>
        String(j.customerName || "")
          .trim()
          .toLowerCase() === q,
    );
  }, [allJobs, f.customerName]);

  function applyJob(job) {
    if (!job) return;

    setF((p) => ({
      ...p,
      customerName: job.customerName || p.customerName,
      tin: deriveTin(job),
      description: deriveDescription(job),
      quantity: String(deriveQty(job) || ""),
      unitType: deriveUnitType(job),
      unitPrice: deriveUnitPrice(job),
      deliveryDate: deriveDeliveryDate(job),
      deliveryTime: deriveDeliveryTime(job),
    }));

    requestAnimationFrame(() => autoGrow(textRef.current));
  }

  useEffect(() => {
    if (!f.customerName.trim()) {
      setSelectedJobId("");
      return;
    }

    if (exactCustomerJobs.length === 1) {
      const one = exactCustomerJobs[0];
      setSelectedJobId(String(one.id));
      applyJob(one);
      return;
    }

    if (exactCustomerJobs.length > 1) {
      if (!selectedJobId) {
        const first = exactCustomerJobs[0];
        setSelectedJobId(String(first.id));
        applyJob(first);
      } else {
        const found = exactCustomerJobs.find(
          (j) => String(j.id) === String(selectedJobId),
        );
        if (found) applyJob(found);
      }
      return;
    }

    if (matchedJobs.length === 1) {
      const one = matchedJobs[0];
      setSelectedJobId(String(one.id));
      applyJob(one);
    }
  }, [f.customerName, exactCustomerJobs, matchedJobs, selectedJobId]);

  function buildItem() {
    return {
      id: safeId(),
      description: f.description,
      quantity: Number(f.quantity || 0),
      unitType: f.unitType,
      unitPrice: Number(f.unitPrice || 0),
      total: Number(f.quantity || 0) * Number(f.unitPrice || 0),
    };
  }

  function addItem() {
    if (!f.description.trim()) return alert("Description is required");
    if (!f.quantity || Number(f.quantity) <= 0) {
      return alert("Quantity must be greater than 0");
    }
    if (!f.unitPrice || Number(f.unitPrice) < 0) {
      return alert("Unit price is required");
    }

    setItems((prev) => [...prev, buildItem()]);
  }

  function addNew() {
    addItem();
    setF((p) => ({
      ...p,
      description: "",
      quantity: "",
      unitType: "pcs",
      unitPrice: "",
    }));
    requestAnimationFrame(() => autoGrow(textRef.current));
  }

  function clearForm() {
    setSelectedJobId("");
    setF((p) => ({
      ...p,
      customerName: "",
      tin: "",
      description: "",
      quantity: "",
      unitType: "pcs",
      unitPrice: "",
      deliveryDate: "",
      deliveryTime: "",
    }));
    setItems([]);
    requestAnimationFrame(() => autoGrow(textRef.current));
  }

  function removeRow(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  useEffect(() => {
    autoGrow(textRef.current);
  }, [f.description]);

  const totals = useMemo(() => {
    const subTotal = items.reduce((s, x) => s + Number(x.total || 0), 0);
    const vat15 = subTotal * 0.15;
    const total = subTotal + vat15;
    return { subTotal, vat15, total };
  }, [items]);

  const previewRows = useMemo(() => {
    const minRows = 7;
    const actual = items.map((x, i) => ({
      id: x.id,
      no: i + 1,
      description: x.description,
      qty: `${x.quantity} ${x.unitType || ""}`.trim(),
      unitPrice: formatMoney(x.unitPrice),
      total: formatMoney(x.total),
    }));

    const emptyRows = Array.from({
      length: Math.max(0, minRows - actual.length),
    }).map((_, i) => ({
      id: `empty-${i}`,
      no: "",
      description: "",
      qty: "",
      unitPrice: "",
      total: "",
    }));

    return [...actual, ...emptyRows];
  }, [items]);

  function printPdf() {
    window.print();
  }

  return (
    <>
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          body * {
            visibility: hidden !important;
          }

          .print-root,
          .print-root * {
            visibility: visible !important;
          }

          .print-root {
            position: absolute;
            inset: 0;
            width: 210mm;
            min-height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-page {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px]">
        {/* LEFT */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm no-print min-w-0">
          <div>
            <div className="text-primary text-base sm:text-lg font-bold">
              Pricing Quotation
            </div>
            <div className="text-zinc-400 text-[11px] sm:text-xs font-semibold mt-1">
              Generate Invoice
            </div>
          </div>

          {jobsErr && (
            <div className="mt-3 text-red-600 text-xs sm:text-sm font-bold">
              {jobsErr}
            </div>
          )}

          <div className="mt-5">
            <div className="text-primary text-sm sm:text-base font-bold border-b border-zinc-200 pb-2">
              Customer Info
            </div>

            <div className="mt-3 grid gap-3">
              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  Customer name
                </div>
                <input
                  list="invoice-customer-list"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                  value={f.customerName}
                  onChange={(e) => {
                    update("customerName", e.target.value);
                    setSelectedJobId("");
                  }}
                  placeholder="Type customer name..."
                />
                <datalist id="invoice-customer-list">
                  {Array.from(
                    new Set(allJobs.map((j) => String(j.customerName || ""))),
                  )
                    .filter(Boolean)
                    .map((name) => (
                      <option key={name} value={name} />
                    ))}
                </datalist>
              </div>

              {exactCustomerJobs.length > 1 && (
                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                    Select job for this customer
                  </div>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm"
                    value={selectedJobId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedJobId(id);
                      const job = exactCustomerJobs.find(
                        (x) => String(x.id) === String(id),
                      );
                      if (job) applyJob(job);
                    }}
                  >
                    <option value="">Select job</option>
                    {exactCustomerJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {`AZ0-${job.jobNo || ""} | ${job.workType || job.description || "Job"} | ${job.paymentStatus || ""}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  TIN
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                  value={f.tin}
                  onChange={(e) =>
                    update("tin", onlyNumberLike(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-primary text-sm sm:text-base font-bold border-b border-zinc-200 pb-2">
              Job Description
            </div>

            <div className="mt-3 grid gap-3">
              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  Work Type / Description
                </div>
                <textarea
                  ref={textRef}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[110px] text-xs sm:text-sm resize-none overflow-hidden"
                  value={f.description}
                  onInput={(e) => autoGrow(e.target)}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Auto-filled from selected job"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                    Quantity
                  </div>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                    value={f.quantity}
                    onChange={(e) =>
                      update("quantity", onlyNumberLike(e.target.value))
                    }
                  />
                </div>

                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                    Unit Type
                  </div>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm"
                    value={f.unitType}
                    onChange={(e) => update("unitType", e.target.value)}
                  >
                    <option value="pcs">pcs</option>
                    <option value="sqm">sqm</option>
                    <option value="meter">meter</option>
                    <option value="set">set</option>
                    <option value="box">box</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                    Unit Price
                  </div>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                    value={f.unitPrice}
                    onChange={(e) =>
                      update("unitPrice", onlyNumberLike(e.target.value))
                    }
                  />
                </div>

                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                    Delivery date
                  </div>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                    value={f.deliveryDate}
                    onChange={(e) => update("deliveryDate", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  Delivery time
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                  value={f.deliveryTime}
                  onChange={(e) => update("deliveryTime", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-primary text-sm sm:text-base font-bold border-b border-zinc-200 pb-2">
              Payment Instructions
            </div>

            <div className="mt-3 grid gap-3">
              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  Account Name
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                  value={f.accountName}
                  onChange={(e) => update("accountName", e.target.value)}
                />
              </div>

              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  Bank Name
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                  value={f.bankName}
                  onChange={(e) => update("bankName", e.target.value)}
                />
              </div>

              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  Account Number
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                  value={f.accountNumber}
                  onChange={(e) => update("accountNumber", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={addNew}
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-[11px] sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              Add new
            </button>

            <button
              onClick={addItem}
              className="px-4 py-2.5 rounded-xl bg-success text-white text-[11px] sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              Add
            </button>

            <button
              onClick={clearForm}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-[11px] sm:text-xs font-bold transition-all duration-300 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm"
            >
              Reset
            </button>

            <button
              onClick={printPdf}
              className="ml-auto px-4 py-2.5 rounded-xl bg-primary text-white text-[11px] sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              Print / Export PDF
            </button>
          </div>

          <div className="mt-6">
            <div className="text-primary text-sm font-bold border-b border-zinc-200 pb-2">
              Added Items
            </div>

            <div className="mt-3 grid gap-2">
              {items.length === 0 ? (
                <div className="text-zinc-400 text-xs font-semibold">
                  No item added yet
                </div>
              ) : (
                items.map((row, idx) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[32px_minmax(0,1fr)_70px_90px_90px_64px] gap-2 items-start border border-zinc-200 rounded-xl p-2"
                  >
                    <div className="text-xs font-bold text-zinc-500 pt-1">
                      {idx + 1}
                    </div>
                    <div className="text-xs text-zinc-800 whitespace-pre-wrap break-words">
                      {row.description}
                    </div>
                    <div className="text-xs font-semibold text-zinc-700 pt-1">
                      {row.quantity} {row.unitType}
                    </div>
                    <div className="text-xs font-semibold text-zinc-700 pt-1">
                      {formatMoney(row.unitPrice)}
                    </div>
                    <div className="text-xs font-bold text-primary pt-1">
                      {formatMoney(row.total)}
                    </div>
                    <button
                      onClick={() => removeRow(row.id)}
                      className="px-2 py-1 rounded-lg border border-zinc-200 text-[10px] font-bold hover:bg-red-50 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="print-root bg-white border border-zinc-200 rounded-2xl p-2 sm:p-3 shadow-sm min-w-0">
          <div className="no-print mb-3">
            <div className="text-primary text-base sm:text-lg font-bold">
              Preview
            </div>
            <div className="text-zinc-400 text-[11px] sm:text-xs font-semibold">
              Exact-style printable invoice
            </div>
          </div>

          <div className="mx-auto w-full max-w-[390px] xl:max-w-[430px]">
            <div className="print-page relative w-full aspect-[1055/1493] overflow-hidden bg-white rounded-xl border border-zinc-200">
              <img
                src={invoiceTemplate}
                alt="Invoice template"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* invoice number */}
              <div
                className="absolute bg-white"
                style={{
                  left: "77.2%",
                  top: "20.55%",
                  width: "16.8%",
                  height: "3.7%",
                }}
              />
              <div
                className="absolute text-[#111111] font-medium text-right whitespace-nowrap"
                style={{
                  right: "7.3%",
                  top: "21.0%",
                  width: "16%",
                  fontSize: "10px",
                }}
              >
                {docNumber}
              </div>

              {/* date */}
              <div
                className="absolute bg-white"
                style={{
                  left: "77.2%",
                  top: "23.58%",
                  width: "16.8%",
                  height: "3.7%",
                }}
              />
              <div
                className="absolute text-[#111111] font-medium text-right whitespace-nowrap"
                style={{
                  right: "7.3%",
                  top: "24.02%",
                  width: "16%",
                  fontSize: "10px",
                }}
              >
                {todayDisplay()}
              </div>

              {/* customer name */}
              <div
                className="absolute text-[#111111] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  left: "39.9%",
                  top: "29.95%",
                  width: "35.8%",
                  fontSize: "10px",
                  lineHeight: 1.1,
                }}
              >
                {f.customerName}
              </div>

              {/* tin */}
              <div
                className="absolute text-[#111111] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  left: "39.9%",
                  top: "32.2%",
                  width: "35.8%",
                  fontSize: "10px",
                  lineHeight: 1.1,
                }}
              >
                {f.tin}
              </div>

              {previewRows.slice(0, 7).map((row, idx) => {
                const y = 43.35 + idx * 3.56;
                return (
                  <div key={row.id}>
                    <div
                      className="absolute text-[#1178be]"
                      style={{
                        left: "4.1%",
                        top: `${y}%`,
                        width: "3%",
                        fontSize: "8px",
                        lineHeight: 1.1,
                      }}
                    >
                      {row.no}
                    </div>

                    <div
                      className="absolute text-[#1178be] whitespace-pre-wrap break-words"
                      style={{
                        left: "9.2%",
                        top: `${y}%`,
                        width: "33%",
                        fontSize: "8px",
                        lineHeight: 1.18,
                      }}
                    >
                      {row.description}
                    </div>

                    <div
                      className="absolute text-[#1178be] text-center whitespace-nowrap"
                      style={{
                        left: "51.0%",
                        top: `${y}%`,
                        width: "11%",
                        fontSize: "8px",
                        lineHeight: 1.1,
                      }}
                    >
                      {row.qty}
                    </div>

                    <div
                      className="absolute text-[#1178be] text-right whitespace-nowrap"
                      style={{
                        left: "68.6%",
                        top: `${y}%`,
                        width: "9%",
                        fontSize: "8px",
                        lineHeight: 1.1,
                      }}
                    >
                      {row.unitPrice}
                    </div>

                    <div
                      className="absolute text-[#1178be] text-right whitespace-nowrap font-semibold"
                      style={{
                        left: "84.1%",
                        top: `${y}%`,
                        width: "11%",
                        fontSize: "8px",
                        lineHeight: 1.1,
                      }}
                    >
                      {row.total}
                    </div>
                  </div>
                );
              })}

              {/* totals */}
              <div
                className="absolute text-[#111111] text-right font-bold whitespace-nowrap"
                style={{
                  right: "4.2%",
                  top: "71.35%",
                  width: "13.5%",
                  fontSize: "9px",
                }}
              >
                {formatMoney(totals.subTotal)}
              </div>

              <div
                className="absolute text-[#111111] text-right font-bold whitespace-nowrap"
                style={{
                  right: "4.2%",
                  top: "74.15%",
                  width: "13.5%",
                  fontSize: "9px",
                }}
              >
                {formatMoney(totals.vat15)}
              </div>

              <div
                className="absolute text-[#111111] text-right font-extrabold whitespace-nowrap"
                style={{
                  right: "4.2%",
                  top: "76.9%",
                  width: "13.5%",
                  fontSize: "9px",
                }}
              >
                {formatMoney(totals.total)}
              </div>

              {/* payment placeholders replacement */}
              <div
                className="absolute text-[#4169b2] font-medium"
                style={{
                  left: "3.0%",
                  top: "81.55%",
                  width: "49%",
                  fontSize: "10px",
                  lineHeight: 1.42,
                }}
              >
                <div style={{ visibility: "hidden", marginBottom: "10px" }}>
                  Payment Instructions
                </div>
                <div>Account Name: {f.accountName}</div>
                <div>Bank Name: {f.bankName}</div>
                <div>Account Number: {f.accountNumber}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
