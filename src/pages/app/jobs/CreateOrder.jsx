import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../api/jobs.api";
import {
  getCustomers,
  addCustomer,
  getMachines,
  addMachine,
  getItems,
  addItem,
  addPrice,
  lookupPricesByItem,
} from "../../api/ref.api";

const URGENCY_FEES = { NORMAL: 0, HIGH: 300, URGENT: 1000 };

const PAYMENT_ACCOUNTS = {
  vat: {
    cbe: "Payment Method (CBE): 1000542470333",
    tele: "Payment Method (Tele birr): 0941413132",
  },
  novat: {
    cbe: "Payment Method (CBE): 1000508510218",
    tele: "Payment Method (Tele birr): 0944781211",
  },
};

const PAYMENT_STATUS_OPTIONS = [
  { value: "UNPAID", label: "Unpaid" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
];

function todayMinDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function nowMinTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mi}`;
}

function onlyLettersSpaces(s) {
  return String(s || "").replace(/[^A-Za-z\s]/g, "");
}
function onlyDigitsMax10(s) {
  return String(s || "")
    .replace(/\D/g, "")
    .slice(0, 10);
}
function onlyNumberLike(s) {
  // allows decimals
  const cleaned = String(s || "").replace(/[^0-9.]/g, "");
  // prevent multiple dots
  const parts = cleaned.split(".");
  if (parts.length <= 2) return cleaned;
  return parts[0] + "." + parts.slice(1).join("");
}

export default function CreateOrder() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [items, setItems] = useState([]);
  const [priceOptions, setPriceOptions] = useState([]);

  const [modal, setModal] = useState(null); // customer | machine | item | price | null
  const [tmp, setTmp] = useState({});

  const minDate = todayMinDate();
  const minTimeToday = nowMinTime();

  const [f, setF] = useState({
    // Customer selection OR manual entry (as your UI requires fields)
    customerId: "",
    customerName: "",
    customerPhone: "",

    // Job refs
    itemId: "",
    priceRuleId: "",
    machineId: "",

    // Job details
    description: "",
    qty: "",
    unitType: "pcs",
    designerRequired: false,
    urgency: "NORMAL",

    // Delivery
    deliveryDate: "",
    deliveryTime: "",
    deliveryType: "PICKUP",

    // Pricing
    unitPrice: 0,
    vatEnabled: true,
    paymentStatus: "UNPAID",
    depositPaid: false,
    depositAmount: "",
  });

  function update(key, value) {
    setF((p) => ({ ...p, [key]: value }));
  }

  async function loadRefs() {
    const [c, m, i] = await Promise.all([
      getCustomers(),
      getMachines(),
      getItems(),
    ]);
    setCustomers(c || []);
    setMachines(m || []);
    setItems(i || []);
  }

  useEffect(() => {
    loadRefs().catch((e) =>
      alert(e?.response?.data?.message || "Failed to load reference data"),
    );
  }, []);

  // When a customer is selected, auto-fill name/phone fields
  useEffect(() => {
    if (!f.customerId) return;
    const c = customers.find((x) => x.id === f.customerId);
    if (!c) return;
    setF((p) => ({
      ...p,
      customerName: c.name || "",
      customerPhone: c.phone || "",
    }));
  }, [f.customerId, customers]);

  // Load price rules when item selected, auto-fill defaults
  useEffect(() => {
    (async () => {
      if (!f.itemId) {
        setPriceOptions([]);
        update("priceRuleId", "");
        update("machineId", "");
        update("unitPrice", 0);
        return;
      }

      const selectedItem = items.find((x) => x.id === f.itemId);
      if (selectedItem?.defaultUnit)
        update("unitType", selectedItem.defaultUnit);

      const rules = await lookupPricesByItem(f.itemId);
      setPriceOptions(rules || []);

      if (rules?.length) {
        const r0 = rules[0];
        update("priceRuleId", r0.id);
        update("machineId", r0.machineId);
        update("unitPrice", r0.unitPrice);
        update("vatEnabled", r0.vatEnabled);
      }
    })().catch((e) =>
      alert(e?.response?.data?.message || "Failed to load price rules"),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.itemId]);

  // When price changes, auto-fill machine/unitPrice/vat
  useEffect(() => {
    if (!f.priceRuleId) return;
    const rule = priceOptions.find((r) => r.id === f.priceRuleId);
    if (!rule) return;
    update("machineId", rule.machineId);
    update("unitPrice", rule.unitPrice);
    update("vatEnabled", rule.vatEnabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.priceRuleId]);

  const qtyNum = Number(f.qty || 0);
  const unitPriceNum = Number(f.unitPrice || 0);

  const deliveryFee = f.deliveryType === "DELIVERY" ? 500 : 0; // hidden in unit price
  const urgencyFee = URGENCY_FEES[f.urgency] || 0;

  const subtotal = useMemo(() => {
    if (!qtyNum || !unitPriceNum) return 0;
    const effUnit = unitPriceNum + deliveryFee / qtyNum;
    return effUnit * qtyNum + urgencyFee;
  }, [qtyNum, unitPriceNum, deliveryFee, urgencyFee]);

  const vatAmount = useMemo(
    () => (f.vatEnabled ? subtotal * 0.15 : 0),
    [subtotal, f.vatEnabled],
  );
  const total = useMemo(() => subtotal + vatAmount, [subtotal, vatAmount]);

  // Auto behavior: if PAID -> depositPaid=true and depositAmount=total
  useEffect(() => {
    if (f.paymentStatus === "PAID") {
      setF((p) => ({
        ...p,
        depositPaid: true,
        depositAmount: String(Math.round(total)),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.paymentStatus, total]);

  const depositAmountNum = Number(f.depositAmount || 0);
  const remainingBalance = useMemo(() => {
    if (f.paymentStatus === "PAID") return 0;
    const rem = total - (f.depositPaid ? depositAmountNum : 0);
    return rem > 0 ? rem : 0;
  }, [total, f.depositPaid, depositAmountNum, f.paymentStatus]);

  const item = items.find((x) => x.id === f.itemId);
  const machine = machines.find((x) => x.id === f.machineId);

  function validateDateTime() {
    if (!f.deliveryDate) return true;
    if (f.deliveryDate < minDate) return false;
    if (f.deliveryDate === minDate && f.deliveryTime)
      return f.deliveryTime >= minTimeToday;
    return true;
  }

  const quotationText = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10);
    const jobDesc = f.description || item?.name || "-";
    const pay = f.vatEnabled ? PAYMENT_ACCOUNTS.vat : PAYMENT_ACCOUNTS.novat;

    return `Azael printing Proforma Invoice
Date: ${date}

Job Details:

- Job Description: ${jobDesc}
-Quantity: ${f.qty || "-"} ${f.unitType || ""}
- Unit Price - ${unitPriceNum || "-"}
- Urgency level- ${f.urgency}
- Total Price- ${Math.round(total).toLocaleString()}

Payment Information:
- ${pay.cbe}
- ${pay.tele}

Note:
- ADAVANCE PAYMENT SHOULD BE 50%
- The job will commence upon receipt of the advance Payment.
- Thanks for choosing us`;
  }, [
    f.description,
    item?.name,
    f.qty,
    f.unitType,
    unitPriceNum,
    f.urgency,
    total,
    f.vatEnabled,
  ]);

  async function copyQuotation() {
    try {
      await navigator.clipboard.writeText(quotationText);
      alert("Success: Quotation copied");
    } catch {
      alert("Fail: Could not copy quotation");
    }
  }

  async function approveQuotation() {
    // Validation (as requested)
    if (!f.customerName.trim()) return alert("Fail: Customer name required");
    if (!/^[A-Za-z\s]+$/.test(f.customerName.trim()))
      return alert("Fail: Customer name must be alphabets only");

    if (f.customerPhone && !/^\d{10}$/.test(f.customerPhone))
      return alert("Fail: Phone must be exactly 10 digits (or leave empty)");

    if (!f.itemId) return alert("Fail: Select Work Type");
    if (!f.priceRuleId) return alert("Fail: Select Price");
    if (!qtyNum || qtyNum <= 0) return alert("Fail: Quantity must be a number");

    if (!validateDateTime())
      return alert("Fail: Delivery date/time must be current or future only");

    if (f.depositPaid && f.paymentStatus !== "PAID") {
      if (!Number.isFinite(depositAmountNum) || depositAmountNum < 0)
        return alert("Fail: Deposit amount invalid");
      if (depositAmountNum > total)
        return alert("Fail: Deposit cannot exceed total");
    }

    try {
      const payload = {
        customerName: f.customerName.trim(),
        customerPhone: f.customerPhone ? f.customerPhone : null,

        machine: machine?.name,
        workType: item?.name,

        description: f.description,
        qty: qtyNum,
        unitType: f.unitType,
        designerRequired: !!f.designerRequired,
        urgency: f.urgency,

        deliveryType: f.deliveryType,
        deliveryDate: f.deliveryDate
          ? new Date(f.deliveryDate).toISOString()
          : null,
        deliveryTime: f.deliveryTime || null,

        unitPrice: unitPriceNum,
        vatEnabled: !!f.vatEnabled,

        // extra pricing fields (backend may ignore for now)
        paymentStatus: f.paymentStatus,
        depositAmount:
          f.paymentStatus === "PAID"
            ? total
            : f.depositPaid
              ? depositAmountNum
              : 0,
        remainingBalance,
      };

      const job = await createJob(payload);
      alert(`Success: Job created AZ-${job.jobNo}`);
      navigate("/app/admin/jobs");
    } catch (e) {
      alert(e?.response?.data?.message || "Fail: Failed to create job");
    }
  }

  async function handleCreateModal() {
    try {
      if (modal === "customer") {
        const name = onlyLettersSpaces(tmp.name).trim();
        const phone = onlyDigitsMax10(tmp.phone).trim();

        if (!name) return alert("Fail: Name required");
        // phone not required, but if provided must be 10 digits
        if (phone && phone.length !== 10)
          return alert("Fail: Phone must be exactly 10 digits");

        await addCustomer(name, phone || ""); // backend will enforce digits if given
      }

      if (modal === "machine") {
        const name = String(tmp.name || "").trim();
        if (!name) return alert("Fail: Machine name required");
        await addMachine(name);
      }

      if (modal === "item") {
        const name = String(tmp.name || "").trim();
        if (!name) return alert("Fail: Item name required");
        await addItem(name, String(tmp.defaultUnit || "pcs").trim());
      }

      if (modal === "price") {
        if (!tmp.itemId) return alert("Fail: Select item");
        if (!tmp.machineId) return alert("Fail: Select machine");
        if (!tmp.unitPrice || Number(tmp.unitPrice) <= 0)
          return alert("Fail: Enter unit price");
        await addPrice(
          tmp.itemId,
          tmp.machineId,
          Number(tmp.unitPrice),
          tmp.vatEnabled !== false,
        );
      }

      setModal(null);
      setTmp({});
      await loadRefs();

      if (f.itemId) {
        const rules = await lookupPricesByItem(f.itemId);
        setPriceOptions(rules || []);
      }

      alert("Success: Saved");
    } catch (e) {
      alert(e?.response?.data?.message || "Fail: Save failed");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
      {/* LEFT */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-2xl font-extrabold text-primary">Create Order</h2>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setModal("customer");
                setTmp({ name: "", phone: "" });
              }}
              className="px-3 py-2 rounded-xl bg-bgLight text-primary font-extrabold hover:opacity-90"
            >
              Register Customer
            </button>

            <button
              onClick={() => {
                setModal("item");
                setTmp({ name: "", defaultUnit: "pcs" });
              }}
              className="px-3 py-2 rounded-xl bg-bgLight text-primary font-extrabold hover:opacity-90"
            >
              Add Item
            </button>

            <button
              onClick={() => {
                setModal("machine");
                setTmp({ name: "" });
              }}
              className="px-3 py-2 rounded-xl bg-bgLight text-primary font-extrabold hover:opacity-90"
            >
              Add Machine
            </button>

            <button
              onClick={() => {
                setModal("price");
                setTmp({
                  itemId: "",
                  machineId: "",
                  unitPrice: "",
                  vatEnabled: true,
                });
              }}
              className="px-3 py-2 rounded-xl bg-bgLight text-primary font-extrabold hover:opacity-90"
            >
              Add Price
            </button>
          </div>
        </div>

        {/* CUSTOMER INFORMATION */}
        <div className="mt-6">
          <div className="font-extrabold text-zinc-900 border-b border-zinc-200 pb-2">
            Customer Information
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Customer name
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.customerName}
                onChange={(e) =>
                  update("customerName", onlyLettersSpaces(e.target.value))
                }
                placeholder="Abel Mekonen"
              />
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">Phone</div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.customerPhone}
                onChange={(e) =>
                  update("customerPhone", onlyDigitsMax10(e.target.value))
                }
                placeholder="10 digits (optional)"
              />
            </div>
          </div>
        </div>

        {/* JOB DETAILS */}
        <div className="mt-8">
          <div className="font-extrabold text-zinc-900 border-b border-zinc-200 pb-2">
            Job Details
          </div>

          <div className="mt-4 grid gap-3">
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Work type
              </div>
              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                value={f.itemId}
                onChange={(e) => update("itemId", e.target.value)}
              >
                <option value="">Select Work Type</option>
                {items.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-sm font-bold text-zinc-700 mb-1">
                  Machine
                </div>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50"
                  value={f.machineId}
                  onChange={(e) => update("machineId", e.target.value)}
                  disabled
                >
                  <option value="">
                    {machine?.name || "Auto selected by price"}
                  </option>
                </select>
              </div>

              <div>
                <div className="text-sm font-bold text-zinc-700 mb-1">
                  Unit Type
                </div>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                  value={f.unitType}
                  onChange={(e) => update("unitType", e.target.value)}
                >
                  <option value="pcs">pcs</option>
                  <option value="sqm">sqm</option>
                  <option value="meter">meter</option>
                </select>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Description (very important for Designer / Operator)
              </div>
              <textarea
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[90px]"
                value={f.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Important notes for designer/operator"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-sm font-bold text-zinc-700 mb-1">
                  Quantity
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                  value={f.qty}
                  onChange={(e) =>
                    update("qty", onlyNumberLike(e.target.value))
                  }
                  placeholder="numbers only"
                />
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div>
                  <div className="text-sm font-bold text-zinc-700 mb-1">
                    Designer Required?
                  </div>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                    value={f.designerRequired ? "YES" : "NO"}
                    onChange={(e) =>
                      update("designerRequired", e.target.value === "YES")
                    }
                  >
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
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
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="NORMAL">Normal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PRICE RULE */}
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Price list
              </div>
              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                value={f.priceRuleId}
                onChange={(e) => update("priceRuleId", e.target.value)}
                disabled={!f.itemId}
              >
                <option value="">Select Price</option>
                {priceOptions.map((r) => {
                  const noVatTotal = qtyNum ? r.unitPrice * qtyNum : 0;
                  const vatTotal = qtyNum ? r.unitPrice * qtyNum * 1.15 : 0;
                  return (
                    <option key={r.id} value={r.id}>
                      {`${r.machine?.name} — Unit: ${Math.round(r.unitPrice).toLocaleString()} | No-VAT Total: ${
                        qtyNum ? Math.round(noVatTotal).toLocaleString() : "-"
                      } | VAT Total: ${qtyNum ? Math.round(vatTotal).toLocaleString() : "-"}`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* DELIVERY DETAILS */}
        <div className="mt-8">
          <div className="font-extrabold text-zinc-900 border-b border-zinc-200 pb-2">
            Delivery Details
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Delivery Date
              </div>
              <input
                type="date"
                min={minDate}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.deliveryDate}
                onChange={(e) => update("deliveryDate", e.target.value)}
              />
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Delivery time
              </div>
              <input
                type="time"
                min={f.deliveryDate === minDate ? minTimeToday : undefined}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.deliveryTime}
                onChange={(e) => update("deliveryTime", e.target.value)}
              />
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Pickup / Delivery
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
        </div>

        {/* PRICING */}
        <div className="mt-8">
          <div className="font-extrabold text-zinc-900 border-b border-zinc-200 pb-2">
            Pricing
          </div>

          <div className="mt-4 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <div className="text-sm font-bold text-zinc-700 mb-1">
                  Unit Price
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50"
                  value={Math.round(unitPriceNum || 0).toLocaleString()}
                  disabled
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={f.vatEnabled}
                    onChange={(e) => update("vatEnabled", e.target.checked)}
                  />
                  {f.vatEnabled ? "VAT?" : "Non-VAT?"}
                </label>
              </div>

              <div>
                <div className="text-sm font-bold text-zinc-700 mb-1">
                  Total Price
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50"
                  value={Math.round(total).toLocaleString()}
                  disabled
                />
              </div>

              <div>
                <div className="text-sm font-bold text-zinc-700 mb-1">
                  Payment Status
                </div>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                  value={f.paymentStatus}
                  onChange={(e) => update("paymentStatus", e.target.value)}
                >
                  {PAYMENT_STATUS_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-end">
                <label className="flex items-center gap-2 font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={f.depositPaid || f.paymentStatus === "PAID"}
                    onChange={(e) => update("depositPaid", e.target.checked)}
                    disabled={f.paymentStatus === "PAID"}
                  />
                  Deposit Paid?
                </label>
              </div>

              <div>
                <div className="text-sm font-bold text-zinc-700 mb-1">
                  Deposit Amount
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                  value={f.depositAmount}
                  onChange={(e) =>
                    update("depositAmount", onlyNumberLike(e.target.value))
                  }
                  disabled={!f.depositPaid && f.paymentStatus !== "PAID"}
                  placeholder="0"
                />
              </div>

              <div>
                <div className="text-sm font-bold text-zinc-700 mb-1">
                  Remaining Balance
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50"
                  value={Math.round(remainingBalance).toLocaleString()}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Summary + Quotation */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-primary">Summary</h2>
        <div className="text-xs text-zinc-400 font-bold mt-1">
          Fill details - Review summary - Save
        </div>

        {/* EXACT summary layout */}
        <div className="mt-5 text-sm grid gap-3">
          <div className="font-extrabold text-zinc-900">Customer Info</div>
          <div>
            <span className="font-extrabold">Customer name:</span>{" "}
            {f.customerName || "..."}
          </div>
          <div>
            <span className="font-extrabold">Phone number:</span>{" "}
            {f.customerPhone || "..."}
          </div>

          <div className="font-extrabold text-zinc-900 mt-2">Job Details</div>
          <div>
            <span className="font-extrabold">Machine:</span>{" "}
            {machine?.name || "..."}
          </div>
          <div>
            <span className="font-extrabold">Work Type:</span>{" "}
            {item?.name || "..."}
          </div>
          <div>
            <span className="font-extrabold">Description:</span>{" "}
            {f.description || "..."}
          </div>
          <div>
            <span className="font-extrabold">Quantity:</span> {f.qty || "..."}
          </div>
          <div>
            <span className="font-extrabold">Unit Type:</span>{" "}
            {f.unitType || "..."}
          </div>
          <div>
            <span className="font-extrabold">Designer Required?</span>{" "}
            {f.designerRequired ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-extrabold">Urgency Level:</span> {f.urgency}
          </div>

          <div className="font-extrabold text-zinc-900 mt-2">
            Delivery Details
          </div>
          <div>
            <span className="font-extrabold">Delivery Date:</span>{" "}
            {f.deliveryDate || "..."}
          </div>
          <div>
            <span className="font-extrabold">Delivery Time:</span>{" "}
            {f.deliveryTime || "..."}
          </div>

          <div className="font-extrabold text-zinc-900 mt-2">Pricing</div>
          <div>
            <span className="font-extrabold">Unit Price</span>{" "}
            {Math.round(unitPriceNum || 0).toLocaleString()}
          </div>
          <div>
            <span className="font-extrabold">VAT ?</span>{" "}
            {f.vatEnabled ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-extrabold">Total price</span>{" "}
            {Math.round(total).toLocaleString()}
          </div>
          <div>
            <span className="font-extrabold">Payment Status</span>{" "}
            {f.paymentStatus}
          </div>
          <div>
            <span className="font-extrabold">Deposit Paid?</span>{" "}
            {f.depositPaid || f.paymentStatus === "PAID" ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-extrabold">Deposit Amount</span>{" "}
            {Math.round(Number(f.depositAmount || 0)).toLocaleString()}
          </div>
          <div>
            <span className="font-extrabold">Remaining Balance</span>{" "}
            {Math.round(remainingBalance || 0).toLocaleString()}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={copyQuotation}
            className="px-4 py-2 rounded-xl border border-zinc-200 font-extrabold text-primary hover:bg-bgLight transition"
          >
            Copy quotation
          </button>

          <button
            onClick={approveQuotation}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 transition"
          >
            Approve quotation
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

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setModal(null)}
          />
          <div className="absolute left-1/2 top-1/2 w-[95%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 bg-white border border-zinc-200 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-primary text-xl">
                {modal === "customer" && "Register Customer"}
                {modal === "machine" && "Add Machine"}
                {modal === "item" && "Add Item"}
                {modal === "price" && "Add Price"}
              </div>
              <button
                onClick={() => setModal(null)}
                className="px-3 py-2 rounded-xl border border-zinc-200 font-bold hover:bg-bgLight"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {modal === "customer" && (
                <>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                    placeholder="Name (alphabets only)"
                    value={tmp.name || ""}
                    onChange={(e) =>
                      setTmp((p) => ({
                        ...p,
                        name: onlyLettersSpaces(e.target.value),
                      }))
                    }
                  />
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                    placeholder="Phone (10 digits optional)"
                    value={tmp.phone || ""}
                    onChange={(e) =>
                      setTmp((p) => ({
                        ...p,
                        phone: onlyDigitsMax10(e.target.value),
                      }))
                    }
                  />
                </>
              )}

              {modal === "machine" && (
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                  placeholder="Machine name"
                  value={tmp.name || ""}
                  onChange={(e) =>
                    setTmp((p) => ({ ...p, name: e.target.value }))
                  }
                />
              )}

              {modal === "item" && (
                <>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                    placeholder="Work type name"
                    value={tmp.name || ""}
                    onChange={(e) =>
                      setTmp((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                    placeholder="Default unit (pcs/sqm/meter)"
                    value={tmp.defaultUnit || "pcs"}
                    onChange={(e) =>
                      setTmp((p) => ({ ...p, defaultUnit: e.target.value }))
                    }
                  />
                </>
              )}

              {modal === "price" && (
                <>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                    value={tmp.itemId || ""}
                    onChange={(e) =>
                      setTmp((p) => ({ ...p, itemId: e.target.value }))
                    }
                  >
                    <option value="">Select item</option>
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                    value={tmp.machineId || ""}
                    onChange={(e) =>
                      setTmp((p) => ({ ...p, machineId: e.target.value }))
                    }
                  >
                    <option value="">Select machine</option>
                    {machines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>

                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                    placeholder="Unit price"
                    value={tmp.unitPrice || ""}
                    onChange={(e) =>
                      setTmp((p) => ({
                        ...p,
                        unitPrice: onlyNumberLike(e.target.value),
                      }))
                    }
                  />

                  <label className="flex items-center gap-2 font-bold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={tmp.vatEnabled !== false}
                      onChange={(e) =>
                        setTmp((p) => ({ ...p, vatEnabled: e.target.checked }))
                      }
                    />
                    VAT enabled (for this price rule)
                  </label>
                </>
              )}

              <button
                onClick={handleCreateModal}
                className="mt-2 px-4 py-3 rounded-xl bg-success text-white font-extrabold hover:opacity-90 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
