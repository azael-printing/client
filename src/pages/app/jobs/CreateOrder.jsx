// CreateOrder
// import { useState } from "react";
// import { createJob } from "../../api/jobs.api";

// export default function CreateOrder() {
//   const [form, setForm] = useState({
//     customerName: "",
//     customerPhone: "",
//     machine: "UV / Engraving",
//     workType: "",
//     description: "",
//     qty: 1,
//     unitType: "pcs",
//     designerRequired: true,
//     urgency: "NORMAL",
//     deliveryType: "PICKUP",
//     deliveryDate: "",
//     deliveryTime: "",
//     unitPrice: 1,
//     vatEnabled: true,
//   });

//   const [msg, setMsg] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);

//   function setField(k, v) {
//     setForm((p) => ({ ...p, [k]: v }));
//   }

//   async function onSubmit(e) {
//     e.preventDefault();
//     setMsg("");
//     setErr("");
//     setLoading(true);
//     try {
//       const payload = {
//         ...form,
//         qty: Number(form.qty),
//         unitPrice: Number(form.unitPrice),
//         deliveryDate: form.deliveryDate ? form.deliveryDate : undefined,
//         deliveryTime: form.deliveryTime ? form.deliveryTime : undefined,
//       };
//       const job = await createJob(payload);
//       setMsg(`Created Job #${job.jobNo} successfully.`);
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Failed to create job");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
//       <h2 className="text-2xl font-extrabold text-primary">Create Order</h2>

//       <form onSubmit={onSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
//         <input
//           className="p-3 rounded-xl border border-zinc-200"
//           placeholder="Customer Name"
//           value={form.customerName}
//           onChange={(e) => setField("customerName", e.target.value)}
//         />

//         <input
//           className="p-3 rounded-xl border border-zinc-200"
//           placeholder="Customer Phone"
//           value={form.customerPhone}
//           onChange={(e) => setField("customerPhone", e.target.value)}
//         />

//         <input
//           className="p-3 rounded-xl border border-zinc-200"
//           placeholder="Machine"
//           value={form.machine}
//           onChange={(e) => setField("machine", e.target.value)}
//         />

//         <input
//           className="p-3 rounded-xl border border-zinc-200"
//           placeholder="Work Type"
//           value={form.workType}
//           onChange={(e) => setField("workType", e.target.value)}
//         />

//         <textarea
//           className="p-3 rounded-xl border border-zinc-200 md:col-span-2 min-h-[100px]"
//           placeholder="Description"
//           value={form.description}
//           onChange={(e) => setField("description", e.target.value)}
//         />

//         <input
//           className="p-3 rounded-xl border border-zinc-200"
//           type="number"
//           step="1"
//           min="1"
//           value={form.qty}
//           onChange={(e) => setField("qty", e.target.value)}
//         />

//         <input
//           className="p-3 rounded-xl border border-zinc-200"
//           placeholder="Unit Type (pcs, m2, etc)"
//           value={form.unitType}
//           onChange={(e) => setField("unitType", e.target.value)}
//         />

//         <select
//           className="p-3 rounded-xl border border-zinc-200"
//           value={form.designerRequired ? "YES" : "NO"}
//           onChange={(e) =>
//             setField("designerRequired", e.target.value === "YES")
//           }
//         >
//           <option value="YES">Designer Required: Yes</option>
//           <option value="NO">Designer Required: No</option>
//         </select>

//         <select
//           className="p-3 rounded-xl border border-zinc-200"
//           value={form.urgency}
//           onChange={(e) => setField("urgency", e.target.value)}
//         >
//           <option value="NORMAL">Urgency: Normal</option>
//           <option value="HIGH">Urgency: High (+300)</option>
//           <option value="URGENT">Urgency: Urgent (+1000)</option>
//         </select>

//         <select
//           className="p-3 rounded-xl border border-zinc-200"
//           value={form.deliveryType}
//           onChange={(e) => setField("deliveryType", e.target.value)}
//         >
//           <option value="PICKUP">Pickup</option>
//           <option value="DELIVERY">Delivery</option>
//         </select>

//         <input
//           className="p-3 rounded-xl border border-zinc-200"
//           type="date"
//           value={form.deliveryDate}
//           onChange={(e) => setField("deliveryDate", e.target.value)}
//         />

//         <input
//           className="p-3 rounded-xl border border-zinc-200"
//           type="time"
//           value={form.deliveryTime}
//           onChange={(e) => setField("deliveryTime", e.target.value)}
//         />

//         <input
//           className="p-3 rounded-xl border border-zinc-200"
//           type="number"
//           step="0.01"
//           min="0"
//           value={form.unitPrice}
//           onChange={(e) => setField("unitPrice", e.target.value)}
//         />

//         <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
//           <input
//             type="checkbox"
//             checked={form.vatEnabled}
//             onChange={(e) => setField("vatEnabled", e.target.checked)}
//           />
//           VAT Enabled (15%)
//         </label>

//         <button
//           disabled={loading}
//           className="md:col-span-2 p-3 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 disabled:opacity-50"
//         >
//           {loading ? "Creating..." : "Create Order"}
//         </button>

//         {msg && (
//           <div className="md:col-span-2 text-success font-bold">{msg}</div>
//         )}
//         {err && (
//           <div className="md:col-span-2 text-red-600 font-bold">{err}</div>
//         )}
//       </form>
//     </div>
//   );
// }
import { useMemo, useState } from "react";
import { createJob } from "../../api/jobs.api";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const URGENCY_FEES = {
  NORMAL: 0,
  HIGH: 300,
  URGENT: 1000,
};

const BANK_TEXT = {
  cbe: "Payment Method (CBE): 1000 0000 0000",
  tele: "Payment Method (Tele birr): 0911 000 000",
};

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function CreateOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [f, setF] = useState({
    customerName: "",
    customerPhone: "",
    machine: "",
    workType: "",
    description: "",
    qty: "",
    unitType: "pcs",
    designerRequired: false,
    urgency: "NORMAL",

    deliveryDate: "",
    deliveryTime: "",
    deliveryType: "PICKUP",

    unitPrice: "",
    vatEnabled: true,

    // payment status should NOT appear in quotation
    paymentStatus: "UNPAID",
  });

  const qtyNum = Number(f.qty || 0);
  const unitPriceNum = Number(f.unitPrice || 0);

  // Delivery payment rule:
  // You said: "delivery payment cannot be showed on quotation rather it should be distributed in unit price"
  // For now: delivery fee is 0 unless DELIVERY. If DELIVERY, we add 500 birr (you can change later).
  const deliveryFee = f.deliveryType === "DELIVERY" ? 500 : 0;

  const urgencyFee = URGENCY_FEES[f.urgency] || 0;

  const subtotal = useMemo(() => {
    // distribute delivery fee into unit price (not shown separately)
    if (!qtyNum || !unitPriceNum) return 0;
    const effectiveUnit = unitPriceNum + deliveryFee / qtyNum;
    return effectiveUnit * qtyNum + urgencyFee;
  }, [qtyNum, unitPriceNum, deliveryFee, urgencyFee]);

  const vatAmount = useMemo(
    () => (f.vatEnabled ? subtotal * 0.15 : 0),
    [subtotal, f.vatEnabled],
  );
  const total = useMemo(() => subtotal + vatAmount, [subtotal, vatAmount]);

  const quotationText = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10);

    return `Azael printing Proforma Invoice
Date: ${date}

Job Details:
- Job Description: ${f.description || f.workType || "-"}
- Quantity: ${f.qty || "-"} ${f.unitType || ""}
- Unit Price: ${f.unitPrice || "-"}
- Urgency level: ${f.urgency}
- Total Price: ${Math.round(total).toLocaleString()}

Payment Information:
- ${BANK_TEXT.cbe}
- ${BANK_TEXT.tele}

Note:
- ADAVANCE PAYMENT SHOULD BE 50%
- The job will commence upon receipt of the advance Payment.
- Thanks for choosing us`;
  }, [
    f.description,
    f.workType,
    f.qty,
    f.unitType,
    f.unitPrice,
    f.urgency,
    total,
  ]);

  function update(key, value) {
    setF((p) => ({ ...p, [key]: value }));
  }

  async function copyQuotation() {
    await navigator.clipboard.writeText(quotationText);
    alert("Quotation copied");
  }

  async function submitCreate() {
    try {
      const payload = {
        customerName: f.customerName,
        customerPhone: f.customerPhone,
        machine: f.machine,
        workType: f.workType,
        description: f.description,
        qty: Number(f.qty),
        unitType: f.unitType,
        designerRequired: !!f.designerRequired,
        urgency: f.urgency,
        deliveryDate: f.deliveryDate
          ? new Date(f.deliveryDate).toISOString()
          : null,
        deliveryTime: f.deliveryTime || null,
        deliveryType: f.deliveryType,
        unitPrice: Number(f.unitPrice),
        vatEnabled: !!f.vatEnabled,
        // backend should compute vat/subtotal/total too, but we keep clean
      };

      const job = await createJob(payload);
      alert(`Job created: #${job.jobNo || ""}`);
      navigate("/app/admin/jobs", { replace: false });
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to create job");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
      {/* LEFT: FORM */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-primary">Create Order</h2>

        {/* Customer Info */}
        <div className="mt-5">
          <div className="font-extrabold text-zinc-900">Customer Info</div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Customer name
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.customerName}
                onChange={(e) => update("customerName", e.target.value)}
                placeholder="Abc"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Phone number
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.customerPhone}
                onChange={(e) => update("customerPhone", e.target.value)}
                placeholder="+251..."
              />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="mt-6">
          <div className="font-extrabold text-zinc-900">Job Details</div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Machine
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.machine}
                onChange={(e) => update("machine", e.target.value)}
                placeholder="Mimaki / Roland / Konica / Heat Press"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Work Type
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.workType}
                onChange={(e) => update("workType", e.target.value)}
                placeholder="Business card, Banner, Sticker..."
              />
            </div>

            <div className="sm:col-span-2">
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Description
              </div>
              <textarea
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[100px]"
                value={f.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="free text"
              />
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Quantity
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.qty}
                onChange={(e) => update("qty", e.target.value)}
                placeholder="1,2,3..."
              />
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Unit Type
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.unitType}
                onChange={(e) => update("unitType", e.target.value)}
                placeholder="pcs / sqm / meter..."
              />
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Designer Required?
              </div>
              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                value={f.designerRequired ? "yes" : "no"}
                onChange={(e) =>
                  update("designerRequired", e.target.value === "yes")
                }
              >
                <option value="no">no</option>
                <option value="yes">yes</option>
              </select>
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Urgency Level
              </div>
              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                value={f.urgency}
                onChange={(e) => update("urgency", e.target.value)}
              >
                <option value="NORMAL">Normal (no extra)</option>
                <option value="HIGH">High (+300)</option>
                <option value="URGENT">Urgent (+1000)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="mt-6">
          <div className="font-extrabold text-zinc-900">Delivery Details</div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Delivery Date
              </div>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.deliveryDate}
                onChange={(e) => update("deliveryDate", e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Delivery Time
              </div>
              <input
                type="time"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.deliveryTime}
                onChange={(e) => update("deliveryTime", e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Pickup or Delivery
              </div>
              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                value={f.deliveryType}
                onChange={(e) => update("deliveryType", e.target.value)}
              >
                <option value="PICKUP">Pickup</option>
                <option value="DELIVERY">Delivery</option>
              </select>
            </div>
          </div>

          <div className="mt-2 text-xs text-zinc-500 font-bold">
            Delivery fee is distributed into Unit Price (not shown on
            quotation).
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-6">
          <div className="font-extrabold text-zinc-900">Pricing</div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Unit Price
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.unitPrice}
                onChange={(e) => update("unitPrice", e.target.value)}
                placeholder="1,2,3..."
              />
            </div>

            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 font-bold text-zinc-700">
                <input
                  type="checkbox"
                  checked={f.vatEnabled}
                  onChange={(e) => update("vatEnabled", e.target.checked)}
                />
                VAT? (15%)
              </label>
            </div>
          </div>

          <div className="mt-3 text-sm font-bold text-zinc-700">
            Total price:{" "}
            <span className="text-primary font-extrabold">
              {Math.round(total).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: SUMMARY + QUOTATION */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-primary">Summary</h2>
        <div className="text-xs text-zinc-400 font-bold mt-1">
          Fill details - Review summary - Save
        </div>

        <div className="mt-5">
          <div className="font-extrabold text-zinc-900">Customer Info</div>
          <div className="mt-2 text-sm">
            <div>
              <span className="font-bold">Customer name:</span>{" "}
              {f.customerName || "..."}
            </div>
            <div>
              <span className="font-bold">Phone number:</span>{" "}
              {f.customerPhone || "..."}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="font-extrabold text-zinc-900">Job Details</div>
          <div className="mt-2 text-sm">
            <div>
              <span className="font-bold">Machine</span> {f.machine || "..."}
            </div>
            <div>
              <span className="font-bold">Work Type</span> {f.workType || "..."}
            </div>
            <div>
              <span className="font-bold">Description</span>{" "}
              {f.description || "..."}
            </div>
            <div>
              <span className="font-bold">Quantity</span> {f.qty || "..."}{" "}
              {f.unitType}
            </div>
            <div>
              <span className="font-bold">Designer Required</span>{" "}
              {f.designerRequired ? "yes" : "no"}
            </div>
            <div>
              <span className="font-bold">Urgency Level</span> {f.urgency}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="font-extrabold text-zinc-900">Delivery Details</div>
          <div className="mt-2 text-sm">
            <div>
              <span className="font-bold">Delivery Date</span>{" "}
              {f.deliveryDate || "..."}
            </div>
            <div>
              <span className="font-bold">Delivery Time</span>{" "}
              {f.deliveryTime || "..."}
            </div>
            <div>
              <span className="font-bold">Pickup or Delivery</span>{" "}
              {f.deliveryType}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="font-extrabold text-zinc-900">Pricing</div>
          <div className="mt-2 text-sm">
            <div>
              <span className="font-bold">Unit Price</span>{" "}
              {f.unitPrice || "..."}
            </div>
            <div>
              <span className="font-bold">VAT</span>{" "}
              {f.vatEnabled ? "yes" : "no"}
            </div>
            <div>
              <span className="font-bold">Total price</span>{" "}
              {Math.round(total).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={copyQuotation}
            className="px-4 py-2 rounded-xl border border-zinc-200 font-extrabold text-primary hover:bg-bgLight transition flex items-center gap-2"
          >
            Copy quotation
          </button>

          <button
            onClick={submitCreate}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 transition"
          >
            Quotation Approved
          </button>
        </div>

        <div className="mt-4">
          <div className="text-zinc-500 font-extrabold text-sm">
            Quotation Preview
          </div>
          <pre className="mt-2 p-3 rounded-xl bg-bgLight border border-zinc-200 text-xs whitespace-pre-wrap">
            {quotationText}
          </pre>
        </div>
      </div>
    </div>
  );
}
