// ========================
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { createJob } from "../../api/jobs.api";
import {
  getCustomers,
  getMachines,
  getItems,
  addCustomer,
  addMachine,
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
  const cleaned = String(s || "").replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 2) return cleaned;
  return parts[0] + "." + parts.slice(1).join("");
}

export default function CreateOrder() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role;

  const [customers, setCustomers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [items, setItems] = useState([]);
  const [priceOptions, setPriceOptions] = useState([]);

  const [modal, setModal] = useState(null); // customer | machine | item | price
  const [tmp, setTmp] = useState({});

  const minDate = todayMinDate();
  const minTimeToday = nowMinTime();

  const [f, setF] = useState({
    customerName: "",
    customerPhone: "",

    itemId: "",
    priceRuleId: "",
    machineId: "",

    description: "",
    qty: "",
    unitType: "pcs",
    designerRequired: false,
    urgency: "NORMAL",

    deliveryDate: "",
    deliveryTime: "",
    deliveryType: "PICKUP",

    unitPrice: 0,
    vatEnabled: true, // this controls invoice VAT calc AND default price variant selection
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

  // Customer suggestion: if name matches existing, auto-fill phone
  useEffect(() => {
    const name = f.customerName.trim().toLowerCase();
    if (!name) return;
    const match = customers.find(
      (c) =>
        String(c.name || "")
          .trim()
          .toLowerCase() === name,
    );
    if (match && match.phone) {
      setF((p) => ({ ...p, customerPhone: onlyDigitsMax10(match.phone) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.customerName]);

  // Load prices on item change
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
    })().catch((e) =>
      alert(e?.response?.data?.message || "Failed to load price rules"),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.itemId]);

  // When VAT checkbox changes: auto-pick matching variant if available (VAT vs NON_VAT)
  useEffect(() => {
    if (!priceOptions.length) return;
    const desired = f.vatEnabled ? "VAT" : "NON_VAT";
    const found = priceOptions.find(
      (r) => String(r.variant || "").toUpperCase() === desired,
    );
    if (found) {
      update("priceRuleId", found.id);
      update("machineId", found.machineId);
      update("unitPrice", found.unitPrice);
      // keep vatEnabled as user chose
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.vatEnabled, priceOptions]);

  // When price rule changes, update machine/unit price; and sync VAT checkbox to rule.vatEnabled (optional)
  useEffect(() => {
    if (!f.priceRuleId) return;
    const rule = priceOptions.find((r) => r.id === f.priceRuleId);
    if (!rule) return;
    update("machineId", rule.machineId);
    update("unitPrice", rule.unitPrice);

    // Keep invoice VAT behavior aligned with selected rule variant if user chooses manually
    if (String(rule.variant || "").toUpperCase() === "NON_VAT")
      update("vatEnabled", false);
    if (String(rule.variant || "").toUpperCase() === "VAT")
      update("vatEnabled", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.priceRuleId]);

  const qtyNum = Number(f.qty || 0);
  const unitPriceNum = Number(f.unitPrice || 0);

  const deliveryFee = f.deliveryType === "DELIVERY" ? 500 : 0;
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

  // PAID => deposit paid full
  useEffect(() => {
    if (f.paymentStatus === "PAID") {
      setF((p) => ({
        ...p,
        depositPaid: true,
        depositAmount: String(Math.round(total)),
      }));
    }
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
    // validations
    const name = f.customerName.trim();
    if (!name) return alert("Fail: Customer name required");
    if (!/^[A-Za-z\s]+$/.test(name))
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
        customerName: name,
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
      navigate(role === "CS" ? "/app/cs/overview" : "/app/admin/jobs");
    } catch (e) {
      alert(e?.response?.data?.message || "Fail: Failed to create job");
      navigate("/login");
    }
  }

  async function handleCreateModal() {
    try {
      if (modal === "customer") {
        const name = onlyLettersSpaces(tmp.name).trim();
        const phone = onlyDigitsMax10(tmp.phone).trim();
        if (!name) return alert("Fail: Name required");
        if (phone && phone.length !== 10)
          return alert("Fail: Phone must be exactly 10 digits");
        await addCustomer(name, phone || "");
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

        // variant support
        const variant = String(
          tmp.variant || (tmp.vatEnabled === false ? "NON_VAT" : "VAT"),
        ).trim();
        const label = tmp.variantLabel ? String(tmp.variantLabel).trim() : null;

        await addPrice(
          tmp.itemId,
          tmp.machineId,
          Number(tmp.unitPrice),
          tmp.vatEnabled !== false,
          variant,
          label,
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
          <h2 className="text-2xl font-semibold text-primary">Create Order</h2>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setModal("customer");
                setTmp({ name: "", phone: "" });
              }}
              className="px-3 py-2 rounded-xl bg-bgLight text-primary font-semibold hover:opacity-90"
            >
              Register Customer
            </button>

            <button
              onClick={() => {
                setModal("item");
                setTmp({ name: "", defaultUnit: "pcs" });
              }}
              className="px-3 py-2 rounded-xl bg-bgLight text-primary font-semibold hover:opacity-90"
            >
              Add Item
            </button>

            <button
              onClick={() => {
                setModal("machine");
                setTmp({ name: "" });
              }}
              className="px-3 py-2 rounded-xl bg-bgLight text-primary font-semibold hover:opacity-90"
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
                  variant: "VAT",
                  variantLabel: "",
                });
              }}
              className="px-3 py-2 rounded-xl bg-bgLight text-primary font-semibold hover:opacity-90"
            >
              Add Price
            </button>
          </div>
        </div>

        {/* CUSTOMER INFORMATION */}
        <div className="mt-6">
          <div className="font-semibold text-zinc-900 border-b border-zinc-200 pb-2">
            Customer Information
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-zinc-700 mb-1">
                Customer name
              </div>
              <input
                list="customerNames"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.customerName}
                onChange={(e) =>
                  update("customerName", onlyLettersSpaces(e.target.value))
                }
                placeholder="Start typing..."
              />
              <datalist id="customerNames">
                {customers.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>

            <div>
              <div className="text-sm font-semibold text-zinc-700 mb-1">
                Phone
              </div>
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
          <div className="font-semibold text-zinc-900 border-b border-zinc-200 pb-2">
            Job Details
          </div>

          <div className="mt-4 grid gap-3">
            {/* ONE LINE: Work type + Machine + Unit Type */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <div className="text-sm font-semibold text-zinc-700 mb-1">
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

              <div>
                <div className="text-sm font-semibold text-zinc-700 mb-1">
                  Machine
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50"
                  value={machine?.name || "Auto selected by price"}
                  disabled
                />
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-700 mb-1">
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
              <div className="text-sm font-semibold text-zinc-700 mb-1">
                Description
              </div>
              <textarea
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[90px]"
                placeholder="Very important for Designer / Operator"
                value={f.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-sm font-semibold text-zinc-700 mb-1">
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
                  <div className="text-sm font-semibold text-zinc-700 mb-1">
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
                  <div className="text-sm font-semibold text-zinc-700 mb-1">
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

            {/* PRICE LIST (variant-based) */}
            {/* PRICE LIST (show only unit price in options; details shown below) */}
            <div>
              <div className="text-sm font-semibold text-zinc-700 mb-1">
                Price list
              </div>

              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                value={f.priceRuleId}
                onChange={(e) => update("priceRuleId", e.target.value)}
                disabled={!f.itemId}
              >
                <option value="">Select Price</option>

                {priceOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {Math.round(r.unitPrice).toLocaleString()}
                  </option>
                ))}
              </select>

              {/* Details below dropdown (small font) */}
              {(() => {
                const rule = priceOptions.find((x) => x.id === f.priceRuleId);
                if (!rule) return null;

                const ruleVariant = String(
                  rule.variant || (rule.vatEnabled ? "VAT" : "NON_VAT"),
                ).toUpperCase();
                const variantLabel = rule.variantLabel
                  ? rule.variantLabel
                  : "-";

                const noVatTotal = qtyNum ? rule.unitPrice * qtyNum : 0;
                const vatTotal = qtyNum ? rule.unitPrice * qtyNum * 1.15 : 0;

                return (
                  <div className="mt-2 text-xs font-semibold text-zinc-500 leading-5">
                    <div>
                      <span className="text-zinc-400">Machine:</span>{" "}
                      <span className="text-zinc-800">
                        {rule.machine?.name || machine?.name || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Variant:</span>{" "}
                      <span className="text-zinc-800">{ruleVariant}</span>{" "}
                      <span className="text-zinc-400">Label:</span>{" "}
                      <span className="text-zinc-800">{variantLabel}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div>
                        <span className="text-zinc-400">No-VAT Total:</span>{" "}
                        <span className="text-zinc-800">
                          {qtyNum
                            ? Math.round(noVatTotal).toLocaleString()
                            : "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400">VAT Total:</span>{" "}
                        <span className="text-zinc-800">
                          {qtyNum ? Math.round(vatTotal).toLocaleString() : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* DELIVERY DETAILS */}
        <div className="mt-8">
          <div className="font-semibold text-zinc-900 border-b border-zinc-200 pb-2">
            Delivery Details
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-zinc-700 mb-1">
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
              <div className="text-sm font-semibold text-zinc-700 mb-1">
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
              <div className="text-sm font-semibold text-zinc-700 mb-1">
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
          <div className="font-semibold text-zinc-900 border-b border-zinc-200 pb-2">
            Pricing
          </div>

          <div className="mt-4 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <div className="text-sm font-semibold text-zinc-700 mb-1">
                  Unit Price
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50"
                  value={Math.round(unitPriceNum || 0).toLocaleString()}
                  disabled
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 font-semibold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={f.vatEnabled}
                    onChange={(e) => update("vatEnabled", e.target.checked)}
                  />
                  {f.vatEnabled ? "VAT?" : "Non-VAT?"}
                </label>
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-700 mb-1">
                  Total Price
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50"
                  value={Math.round(total).toLocaleString()}
                  disabled
                />
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-700 mb-1">
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
                <label className="flex items-center gap-2 font-semibold text-zinc-700">
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
                <div className="text-sm font-semibold text-zinc-700 mb-1">
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
                <div className="text-sm font-semibold text-zinc-700 mb-1">
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
        <h2 className="ml-7 text-2xl font-semibold text-primary">Summary</h2>
        <div className="ml-7 text-xs text-zinc-400 font-semibold mt-1">
          Fill details - Review summary - Save
        </div>

        {/* COMPACT SUMMARY (labels left, values right) */}
        <div className="mt-4 text-[13px] grid gap-2">
          <div className="text-center font-semibold text-zinc-900">
            Customer Info
          </div>

          <div className="grid grid-cols-[160px_1fr] gap-2 items-center">
            <div className="text-right font-semibold text-zinc-600">
              Customer name:
            </div>
            <div className=" font-semibold text-zinc-900 truncate">
              {f.customerName || "..."}
            </div>

            <div className="text-right font-semibold text-zinc-600">
              Phone number:
            </div>
            <div className=" font-semibold text-zinc-900 truncate">
              {f.customerPhone || "..."}
            </div>
          </div>

          <div className="text-center font-semibold text-zinc-900 mt-2">
            Job Details
          </div>
          <div className="grid grid-cols-[160px_1fr] gap-2 items-center">
            <div className="text-right font-bolsemiboldd text-zinc-600">
              Machine:
            </div>
            <div className=" font-semibold text-zinc-900 truncate">
              {machine?.name || "..."}
            </div>

            <div className="text-right font-semibold text-zinc-600">
              Work Type:
            </div>
            <div className=" font-semibold text-zinc-900 truncate">
              {item?.name || "..."}
            </div>

            <div className="text-right font-semibold text-zinc-600">
              Description:
            </div>
            <div className=" font-semibold text-zinc-900 truncate">
              {f.description || "..."}
            </div>

            <div className="text-right font-semibold text-zinc-600">
              Quantity:
            </div>
            <div className=" font-semibold text-zinc-900">{f.qty || "..."}</div>

            <div className="text-right font-semibold text-zinc-600">
              Unit Type:
            </div>
            <div className=" font-semibold text-zinc-900">
              {f.unitType || "..."}
            </div>

            <div className="text-right font-medium text-zinc-600">
              Designer Required?:
            </div>
            <div className=" font-semibold text-zinc-900">
              {f.designerRequired ? "Yes" : "No"}
            </div>

            <div className="text-right font-medium text-zinc-600">
              Urgency Level:
            </div>
            <div className=" font-semibold text-zinc-900">{f.urgency}</div>
          </div>

          <div className="text-center font-semibold text-zinc-900 mt-2">
            Delivery Details
          </div>
          <div className="grid grid-cols-[160px_1fr] gap-2 items-center">
            <div className="text-right font-semibold text-zinc-600">
              Delivery Date:
            </div>
            <div className=" font-semibold text-zinc-900">
              {f.deliveryDate || "..."}
            </div>

            <div className="text-right font-medium text-zinc-600">
              Delivery Time:
            </div>
            <div className=" font-semibold text-zinc-900">
              {f.deliveryTime || "..."}
            </div>
          </div>

          <div className=" text-center font-semibold text-zinc-900 mt-2">
            Pricing
          </div>
          <div className="grid grid-cols-[160px_1fr] gap-2 items-center">
            <div className="text-right font-medium text-zinc-600">
              Unit Price:
            </div>
            <div className=" font-semibold text-zinc-900">
              {Math.round(unitPriceNum || 0).toLocaleString()}
            </div>

            <div className="text-right font-medium text-zinc-600">VAT ?:</div>
            <div className=" font-semibold text-zinc-900">
              {f.vatEnabled ? "Yes" : "No"}
            </div>

            <div className="text-right font-medium text-zinc-600">
              Total price:
            </div>
            <div className=" font-semibold text-zinc-900">
              {Math.round(total).toLocaleString()}
            </div>

            <div className="text-right font-medium text-zinc-600">
              Payment Status:{" "}
            </div>
            <div className=" font-semibold text-zinc-900">
              {f.paymentStatus}
            </div>

            <div className="text-right font-medium text-zinc-600">
              Deposit Paid? :
            </div>
            <div className=" font-semibold text-zinc-900">
              {f.depositPaid || f.paymentStatus === "PAID" ? "Yes" : "No"}
            </div>

            <div className="text-right  font-medium  text-zinc-600">
              Deposit Amount:
            </div>
            <div className="font-semibold text-zinc-900">
              {Math.round(Number(f.depositAmount || 0)).toLocaleString()}
            </div>
            <div className="text-right last:font-meium text-zinc-600">
              Remaining Balance:
            </div>
            <div className=" font-semibold text-zinc-900">
              {Math.round(remainingBalance || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={copyQuotation}
            className="px-4 py-2 rounded-xl border border-zinc-200 font-semibold text-primary hover:bg-bgLight transition"
          >
            Copy quotation
          </button>
          <button
            onClick={approveQuotation}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition"
          >
            Approve quotation
          </button>
        </div>

        <div className="mt-4">
          <div className="text-zinc-500 font-semibold text-sm">
            Quotation Preview
          </div>
          <pre className="mt-2 p-3 rounded-xl bg-bgLight border border-zinc-200 text-xs whitespace-pre-wrap">
            {quotationText}
          </pre>
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
                <div className="font-semibold text-primary text-xl">
                  {modal === "customer" && "Register Customer"}
                  {modal === "machine" && "Add Machine"}
                  {modal === "item" && "Add Item"}
                  {modal === "price" && "Add Price"}
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="px-3 py-2 rounded-xl border border-zinc-200 font-semibold hover:bg-bgLight"
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

                    <select
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                      value={tmp.variant || "VAT"}
                      onChange={(e) =>
                        setTmp((p) => ({ ...p, variant: e.target.value }))
                      }
                    >
                      <option value="VAT">VAT</option>
                      <option value="NON_VAT">NON_VAT</option>
                      <option value="CUSTOM">CUSTOM</option>
                    </select>

                    <input
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                      placeholder="Variant label (optional) e.g. Corporate / Walk-in / Promo"
                      value={tmp.variantLabel || ""}
                      onChange={(e) =>
                        setTmp((p) => ({ ...p, variantLabel: e.target.value }))
                      }
                    />

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

                    <label className="flex items-center gap-2 font-semibold text-zinc-700">
                      <input
                        type="checkbox"
                        checked={tmp.vatEnabled !== false}
                        onChange={(e) =>
                          setTmp((p) => ({
                            ...p,
                            vatEnabled: e.target.checked,
                          }))
                        }
                      />
                      VAT enabled (for this rule)
                    </label>
                  </>
                )}

                <button
                  onClick={handleCreateModal}
                  className="mt-2 px-4 py-3 rounded-xl bg-success text-white font-semibold hover:opacity-90 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
return (
  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
    {/* LEFT */}
    <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm min-w-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-lg sm:text-xl font-semibold text-primary">
          Create Order
        </h2>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setModal("customer");
              setTmp({ name: "", phone: "" });
            }}
            className="px-3 py-2 rounded-xl bg-bgLight text-primary text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
          >
            Register Customer
          </button>

          <button
            onClick={() => {
              setModal("item");
              setTmp({ name: "", defaultUnit: "pcs" });
            }}
            className="px-3 py-2 rounded-xl bg-bgLight text-primary text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
          >
            Add Item
          </button>

          <button
            onClick={() => {
              setModal("machine");
              setTmp({ name: "" });
            }}
            className="px-3 py-2 rounded-xl bg-bgLight text-primary text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
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
                variant: "VAT",
                variantLabel: "",
              });
            }}
            className="px-3 py-2 rounded-xl bg-bgLight text-primary text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
          >
            Add Price
          </button>
        </div>
      </div>

      {/* CUSTOMER INFORMATION */}
      <div className="mt-5">
        <div className="font-semibold text-sm sm:text-base text-zinc-900 border-b border-zinc-200 pb-2">
          Customer Information
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
              Customer name
            </div>
            <input
              list="customerNames"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={f.customerName}
              onChange={(e) =>
                update("customerName", onlyLettersSpaces(e.target.value))
              }
              placeholder="Start typing..."
            />
            <datalist id="customerNames">
              {customers.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </div>

          <div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
              Phone
            </div>
            <input
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
      <div className="mt-6">
        <div className="font-semibold text-sm sm:text-base text-zinc-900 border-b border-zinc-200 pb-2">
          Job Details
        </div>

        <div className="mt-3 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                Work type
              </div>
              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
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

            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                Machine
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm"
                value={machine?.name || "Auto selected by price"}
                disabled
              />
            </div>

            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                Unit Type
              </div>
              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
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
            <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
              Description
            </div>
            <textarea
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[84px] text-sm"
              placeholder="Very important for Designer / Operator"
              value={f.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                Quantity
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                value={f.qty}
                onChange={(e) => update("qty", onlyNumberLike(e.target.value))}
                placeholder="numbers only"
              />
            </div>

            <div className="grid gap-3 grid-cols-2">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                  Designer Required?
                </div>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
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
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                  Urgency Level
                </div>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
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

          <div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
              Price list
            </div>

            <select
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
              value={f.priceRuleId}
              onChange={(e) => update("priceRuleId", e.target.value)}
              disabled={!f.itemId}
            >
              <option value="">Select Price</option>

              {priceOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {Math.round(r.unitPrice).toLocaleString()}
                </option>
              ))}
            </select>

            {(() => {
              const rule = priceOptions.find((x) => x.id === f.priceRuleId);
              if (!rule) return null;

              const ruleVariant = String(
                rule.variant || (rule.vatEnabled ? "VAT" : "NON_VAT"),
              ).toUpperCase();
              const variantLabel = rule.variantLabel ? rule.variantLabel : "-";

              const noVatTotal = qtyNum ? rule.unitPrice * qtyNum : 0;
              const vatTotal = qtyNum ? rule.unitPrice * qtyNum * 1.15 : 0;

              return (
                <div className="mt-2 text-[11px] sm:text-xs font-semibold text-zinc-500 leading-5">
                  <div>
                    <span className="text-zinc-400">Machine:</span>{" "}
                    <span className="text-zinc-800">
                      {rule.machine?.name || machine?.name || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Variant:</span>{" "}
                    <span className="text-zinc-800">{ruleVariant}</span>{" "}
                    <span className="text-zinc-400">Label:</span>{" "}
                    <span className="text-zinc-800">{variantLabel}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div>
                      <span className="text-zinc-400">No-VAT Total:</span>{" "}
                      <span className="text-zinc-800">
                        {qtyNum ? Math.round(noVatTotal).toLocaleString() : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400">VAT Total:</span>{" "}
                      <span className="text-zinc-800">
                        {qtyNum ? Math.round(vatTotal).toLocaleString() : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* DELIVERY DETAILS */}
      <div className="mt-6">
        <div className="font-semibold text-sm sm:text-base text-zinc-900 border-b border-zinc-200 pb-2">
          Delivery Details
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
              Delivery Date
            </div>
            <input
              type="date"
              min={minDate}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
              value={f.deliveryDate}
              onChange={(e) => update("deliveryDate", e.target.value)}
            />
          </div>

          <div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
              Delivery time
            </div>
            <input
              type="time"
              min={f.deliveryDate === minDate ? minTimeToday : undefined}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
              value={f.deliveryTime}
              onChange={(e) => update("deliveryTime", e.target.value)}
            />
          </div>

          <div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
              Pickup / Delivery
            </div>
            <select
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
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
      <div className="mt-6">
        <div className="font-semibold text-sm sm:text-base text-zinc-900 border-b border-zinc-200 pb-2">
          Pricing
        </div>

        <div className="mt-3 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                Unit Price
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm"
                value={Math.round(unitPriceNum || 0).toLocaleString()}
                disabled
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={f.vatEnabled}
                  onChange={(e) => update("vatEnabled", e.target.checked)}
                />
                {f.vatEnabled ? "VAT?" : "Non-VAT?"}
              </label>
            </div>

            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                Total Price
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm"
                value={Math.round(total).toLocaleString()}
                disabled
              />
            </div>

            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                Payment Status
              </div>
              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
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
              <label className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-zinc-700">
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
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                Deposit Amount
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                value={f.depositAmount}
                onChange={(e) =>
                  update("depositAmount", onlyNumberLike(e.target.value))
                }
                disabled={!f.depositPaid && f.paymentStatus !== "PAID"}
                placeholder="0"
              />
            </div>

            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                Remaining Balance
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm"
                value={Math.round(remainingBalance).toLocaleString()}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT */}
    <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold text-primary">Summary</h2>
      <div className="text-[11px] sm:text-xs text-zinc-400 font-semibold mt-1">
        Fill details - Review summary - Save
      </div>

      <div className="mt-4 text-[12px] sm:text-[13px] grid gap-2">
        <div className="text-center font-semibold text-zinc-900">
          Customer Info
        </div>

        <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-center">
          <div className="text-right font-semibold text-zinc-600">
            Customer name:
          </div>
          <div className="font-semibold text-zinc-900 truncate">
            {f.customerName || "..."}
          </div>

          <div className="text-right font-semibold text-zinc-600">
            Phone number:
          </div>
          <div className="font-semibold text-zinc-900 truncate">
            {f.customerPhone || "..."}
          </div>
        </div>

        <div className="text-center font-semibold text-zinc-900 mt-2">
          Job Details
        </div>
        <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-center">
          <div className="text-right font-semibold text-zinc-600">Machine:</div>
          <div className="font-semibold text-zinc-900 truncate">
            {machine?.name || "..."}
          </div>

          <div className="text-right font-semibold text-zinc-600">
            Work Type:
          </div>
          <div className="font-semibold text-zinc-900 truncate">
            {item?.name || "..."}
          </div>

          <div className="text-right font-semibold text-zinc-600">
            Description:
          </div>
          <div className="font-semibold text-zinc-900 truncate">
            {f.description || "..."}
          </div>

          <div className="text-right font-semibold text-zinc-600">
            Quantity:
          </div>
          <div className="font-semibold text-zinc-900">{f.qty || "..."}</div>

          <div className="text-right font-semibold text-zinc-600">
            Unit Type:
          </div>
          <div className="font-semibold text-zinc-900">
            {f.unitType || "..."}
          </div>

          <div className="text-right font-medium text-zinc-600">
            Designer Required?:
          </div>
          <div className="font-semibold text-zinc-900">
            {f.designerRequired ? "Yes" : "No"}
          </div>

          <div className="text-right font-medium text-zinc-600">
            Urgency Level:
          </div>
          <div className="font-semibold text-zinc-900">{f.urgency}</div>
        </div>

        <div className="text-center font-semibold text-zinc-900 mt-2">
          Delivery Details
        </div>
        <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-center">
          <div className="text-right font-semibold text-zinc-600">
            Delivery Date:
          </div>
          <div className="font-semibold text-zinc-900">
            {f.deliveryDate || "..."}
          </div>

          <div className="text-right font-medium text-zinc-600">
            Delivery Time:
          </div>
          <div className="font-semibold text-zinc-900">
            {f.deliveryTime || "..."}
          </div>
        </div>

        <div className="text-center font-semibold text-zinc-900 mt-2">
          Pricing
        </div>
        <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-center">
          <div className="text-right font-medium text-zinc-600">
            Unit Price:
          </div>
          <div className="font-semibold text-zinc-900">
            {Math.round(unitPriceNum || 0).toLocaleString()}
          </div>

          <div className="text-right font-medium text-zinc-600">VAT ?:</div>
          <div className="font-semibold text-zinc-900">
            {f.vatEnabled ? "Yes" : "No"}
          </div>

          <div className="text-right font-medium text-zinc-600">
            Total price:
          </div>
          <div className="font-semibold text-zinc-900">
            {Math.round(total).toLocaleString()}
          </div>

          <div className="text-right font-medium text-zinc-600">
            Payment Status:
          </div>
          <div className="font-semibold text-zinc-900">{f.paymentStatus}</div>

          <div className="text-right font-medium text-zinc-600">
            Deposit Paid? :
          </div>
          <div className="font-semibold text-zinc-900">
            {f.depositPaid || f.paymentStatus === "PAID" ? "Yes" : "No"}
          </div>

          <div className="text-right font-medium text-zinc-600">
            Deposit Amount:
          </div>
          <div className="font-semibold text-zinc-900">
            {Math.round(Number(f.depositAmount || 0)).toLocaleString()}
          </div>

          <div className="text-right text-zinc-600">Remaining Balance:</div>
          <div className="font-semibold text-zinc-900">
            {Math.round(remainingBalance || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={copyQuotation}
          className="px-4 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold text-primary hover:bg-bgLight transition"
        >
          Copy quotation
        </button>
        <button
          onClick={approveQuotation}
          className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition"
        >
          Approve quotation
        </button>
      </div>

      <div className="mt-4">
        <div className="text-zinc-500 font-semibold text-xs sm:text-sm">
          Quotation Preview
        </div>
        <pre className="mt-2 p-3 rounded-xl bg-bgLight border border-zinc-200 text-[11px] sm:text-xs whitespace-pre-wrap">
          {quotationText}
        </pre>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setModal(null)}
          />
          <div className="absolute left-1/2 top-1/2 w-[94%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-primary text-base sm:text-lg">
                {modal === "customer" && "Register Customer"}
                {modal === "machine" && "Add Machine"}
                {modal === "item" && "Add Item"}
                {modal === "price" && "Add Price"}
              </div>
              <button
                onClick={() => setModal(null)}
                className="px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold hover:bg-bgLight"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {modal === "customer" && (
                <>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
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
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
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
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
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
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                    placeholder="Work type name"
                    value={tmp.name || ""}
                    onChange={(e) =>
                      setTmp((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
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
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
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
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
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

                  <select
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
                    value={tmp.variant || "VAT"}
                    onChange={(e) =>
                      setTmp((p) => ({ ...p, variant: e.target.value }))
                    }
                  >
                    <option value="VAT">VAT</option>
                    <option value="NON_VAT">NON_VAT</option>
                    <option value="CUSTOM">CUSTOM</option>
                  </select>

                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                    placeholder="Variant label (optional) e.g. Corporate / Walk-in / Promo"
                    value={tmp.variantLabel || ""}
                    onChange={(e) =>
                      setTmp((p) => ({ ...p, variantLabel: e.target.value }))
                    }
                  />

                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                    placeholder="Unit price"
                    value={tmp.unitPrice || ""}
                    onChange={(e) =>
                      setTmp((p) => ({
                        ...p,
                        unitPrice: onlyNumberLike(e.target.value),
                      }))
                    }
                  />

                  <label className="flex items-center gap-2 font-semibold text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      checked={tmp.vatEnabled !== false}
                      onChange={(e) =>
                        setTmp((p) => ({
                          ...p,
                          vatEnabled: e.target.checked,
                        }))
                      }
                    />
                    VAT enabled (for this rule)
                  </label>
                </>
              )}

              <button
                onClick={handleCreateModal}
                className="mt-2 px-4 py-2.5 rounded-xl bg-success text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
