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

export default function CreateOrder() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [items, setItems] = useState([]);
  const [priceOptions, setPriceOptions] = useState([]); // rules for selected item

  // Modals
  const [modal, setModal] = useState(null); // "customer" | "machine" | "item" | "price" | null
  const [tmp, setTmp] = useState({}); // modal form fields

  const minDate = todayMinDate();
  const minTimeToday = nowMinTime();

  const [f, setF] = useState({
    customerId: "",
    itemId: "",
    priceRuleId: "",
    machineId: "",

    description: "",
    qty: "",
    unitType: "pcs",
    urgency: "NORMAL",
    designerRequired: false,

    deliveryDate: "",
    deliveryTime: "",
    deliveryType: "PICKUP",

    vatEnabled: true,
    unitPrice: 0,
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
    setCustomers(c);
    setMachines(m);
    setItems(i);
  }

  useEffect(() => {
    loadRefs();
  }, []);

  // when item selected, load price rules and auto-fill unitType + first price + machine
  useEffect(() => {
    (async () => {
      if (!f.itemId) {
        setPriceOptions([]);
        return;
      }
      const item = items.find((x) => x.id === f.itemId);
      if (item?.defaultUnit) update("unitType", item.defaultUnit);

      const rules = await lookupPricesByItem(f.itemId);
      setPriceOptions(rules);

      if (rules.length > 0) {
        // default to first rule
        update("priceRuleId", rules[0].id);
        update("machineId", rules[0].machineId);
        update("unitPrice", rules[0].unitPrice);
        update("vatEnabled", rules[0].vatEnabled);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.itemId]);

  // when price rule changes, auto-fill machine + unitPrice + vat
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

  // Delivery fee: hidden in quotation; distributed in unit price (simple fixed 500 if delivery)
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

  const customer = customers.find((x) => x.id === f.customerId);
  const item = items.find((x) => x.id === f.itemId);
  const machine = machines.find((x) => x.id === f.machineId);

  const quotationText = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10);
    const jobDesc = f.description || item?.name || "-";
    return `Azael printing Proforma Invoice
Date: ${date}

Job Details:
- Job Description: ${jobDesc}
- Quantity: ${f.qty || "-"} ${f.unitType || ""}
- Unit Price: ${unitPriceNum || "-"}
- Urgency level: ${f.urgency}
- Total Price: ${Math.round(total).toLocaleString()}

Payment Information:
${f.vatEnabled ? PAYMENT_ACCOUNTS.vat.cbe : PAYMENT_ACCOUNTS.novat.cbe}
${f.vatEnabled ? PAYMENT_ACCOUNTS.vat.tele : PAYMENT_ACCOUNTS.novat.tele}

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
  ]);

  async function copyQuotation() {
    await navigator.clipboard.writeText(quotationText);
    alert("Quotation copied");
  }

  function validateDateTime() {
    if (!f.deliveryDate) return true;
    if (f.deliveryDate < minDate) return false;
    if (f.deliveryDate === minDate && f.deliveryTime) {
      return f.deliveryTime >= minTimeToday;
    }
    return true;
  }

  async function submitCreate() {
    if (!f.customerId) return alert("Select Customer");
    if (!f.itemId) return alert("Select Work Type");
    if (!f.priceRuleId) return alert("Select Price");
    if (!f.qty || Number(f.qty) <= 0) return alert("Enter valid quantity");
    if (!validateDateTime())
      return alert("Delivery date/time must be current or future only");

    try {
      const payload = {
        customerName: customer?.name,
        customerPhone: customer?.phone,
        machine: machine?.name,
        workType: item?.name,
        description: f.description,
        qty: Number(f.qty),
        unitType: f.unitType,
        urgency: f.urgency,
        designerRequired: !!f.designerRequired,
        deliveryType: f.deliveryType,
        deliveryDate: f.deliveryDate
          ? new Date(f.deliveryDate).toISOString()
          : null,
        deliveryTime: f.deliveryTime || null,
        unitPrice: unitPriceNum,
        vatEnabled: !!f.vatEnabled,
      };

      const job = await createJob(payload);
      alert(`Job created: AZ-${job.jobNo}`);
      navigate("/app/admin/jobs", { replace: false });
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to create job");
    }
  }

  async function handleCreateModal() {
    try {
      if (modal === "customer") {
        await addCustomer(tmp.name, tmp.phone);
      } else if (modal === "machine") {
        await addMachine(tmp.name);
      } else if (modal === "item") {
        await addItem(tmp.name, tmp.defaultUnit || "pcs");
      } else if (modal === "price") {
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
      // reload price options if needed
      if (f.itemId) {
        const rules = await lookupPricesByItem(f.itemId);
        setPriceOptions(rules);
      }
      alert("Saved");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to save");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
      {/* LEFT FORM */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-2xl font-extrabold text-primary">Create Order</h2>

          {/* Top buttons */}
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

        {/* Customer */}
        <div className="mt-6">
          <div className="font-extrabold text-zinc-900">Customer</div>
          <select
            className="mt-2 w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
            value={f.customerId}
            onChange={(e) => update("customerId", e.target.value)}
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
        </div>

        {/* Work Type */}
        <div className="mt-6">
          <div className="font-extrabold text-zinc-900">Work Type</div>
          <select
            className="mt-2 w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
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

        {/* Price rule selection (auto fills machine & unit price) */}
        <div className="mt-6">
          <div className="font-extrabold text-zinc-900">Price</div>
          <select
            className="mt-2 w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
            value={f.priceRuleId}
            onChange={(e) => update("priceRuleId", e.target.value)}
            disabled={!f.itemId}
          >
            <option value="">Select Price</option>
            {priceOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.machine?.name} — {Math.round(r.unitPrice).toLocaleString()}{" "}
                (VAT {r.vatEnabled ? "Yes" : "No"})
              </option>
            ))}
          </select>

          <div className="mt-2 text-sm text-zinc-500 font-bold">
            Machine:{" "}
            <span className="text-zinc-800">{machine?.name || "-"}</span> | Unit
            price:{" "}
            <span className="text-primary font-extrabold">
              {Math.round(unitPriceNum || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6">
          <div className="font-extrabold text-zinc-900">Job Details</div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Description
              </div>
              <textarea
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[90px]"
                value={f.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Important notes for designer/operator"
              />
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">Qty</div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.qty}
                onChange={(e) => update("qty", e.target.value)}
                placeholder="number"
              />
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Unit Type
              </div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50"
                value={f.unitType}
                disabled
              />
            </div>

            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">
                Urgency
              </div>
              <select
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                value={f.urgency}
                onChange={(e) => update("urgency", e.target.value)}
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High (+300)</option>
                <option value="URGENT">Urgent (+1000)</option>
              </select>
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
          </div>
        </div>

        {/* Delivery restrictions */}
        <div className="mt-6">
          <div className="font-extrabold text-zinc-900">Delivery Details</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">Date</div>
              <input
                type="date"
                min={minDate}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.deliveryDate}
                onChange={(e) => update("deliveryDate", e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">Time</div>
              <input
                type="time"
                min={f.deliveryDate === minDate ? minTimeToday : undefined}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                value={f.deliveryTime}
                onChange={(e) => update("deliveryTime", e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-700 mb-1">Type</div>
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

        {/* Totals */}
        <div className="mt-6 text-sm font-bold text-zinc-700">
          Total:{" "}
          <span className="text-primary font-extrabold">
            {Math.round(total).toLocaleString()}
          </span>
          <span className="ml-2 text-zinc-400">
            (VAT {f.vatEnabled ? "Yes" : "No"})
          </span>
        </div>
      </div>

      {/* RIGHT: Summary + Quotation */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-primary">Summary</h2>
        <div className="text-xs text-zinc-400 font-bold mt-1">
          Fill details - Review summary - Save
        </div>

        <div className="mt-5 text-sm grid gap-2">
          <div>
            <span className="font-extrabold">Customer name:</span>{" "}
            {customer?.name || "..."}
          </div>
          <div>
            <span className="font-extrabold">Phone number:</span>{" "}
            {customer?.phone || "..."}
          </div>

          <div className="mt-2">
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
            <span className="font-extrabold">Quantity:</span> {f.qty || "..."}{" "}
            {f.unitType}
          </div>
          <div>
            <span className="font-extrabold">Urgency:</span> {f.urgency}
          </div>

          <div className="mt-2">
            <span className="font-extrabold">Delivery Date:</span>{" "}
            {f.deliveryDate || "..."}
          </div>
          <div>
            <span className="font-extrabold">Delivery Time:</span>{" "}
            {f.deliveryTime || "..."}
          </div>
          <div>
            <span className="font-extrabold">Delivery Type:</span>{" "}
            {f.deliveryType}
          </div>

          <div className="mt-2">
            <span className="font-extrabold">Unit Price:</span>{" "}
            {Math.round(unitPriceNum || 0).toLocaleString()}
          </div>
          <div>
            <span className="font-extrabold">VAT:</span>{" "}
            {f.vatEnabled ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-extrabold">Total price:</span>{" "}
            {Math.round(total).toLocaleString()}
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
            onClick={submitCreate}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 transition"
          >
            Sent quotation
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
                    placeholder="Name"
                    value={tmp.name || ""}
                    onChange={(e) =>
                      setTmp((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200"
                    placeholder="Phone"
                    value={tmp.phone || ""}
                    onChange={(e) =>
                      setTmp((p) => ({ ...p, phone: e.target.value }))
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
                      setTmp((p) => ({ ...p, unitPrice: e.target.value }))
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
                    VAT enabled
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
