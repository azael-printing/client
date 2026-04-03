import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../components/common/DialogProvider";
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
    cbe: "1000542470333",
    tele: "0941413132",
  },
  novat: {
    cbe: "1000508510218",
    tele: "0944781211",
  },
};
const PAYMENT_META_KEY = "azael_job_payment_meta";

function readPaymentMeta() {
  try {
    return JSON.parse(localStorage.getItem(PAYMENT_META_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePaymentMeta(jobId, data) {
  if (!jobId) return;
  const current = readPaymentMeta();
  current[String(jobId)] = data;
  localStorage.setItem(PAYMENT_META_KEY, JSON.stringify(current));
}

function todayMinDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function nowMinTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function onlyLettersSpaces(s) {
  return String(s || "").replace(/[^A-Za-z\s]/g, "");
}
function onlyDigitsMax10(s) {
  return String(s || "").replace(/\D/g, "").slice(0, 10);
}
function onlyNumberLike(s) {
  const cleaned = String(s || "").replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  return parts.length <= 2 ? cleaned : `${parts[0]}.${parts.slice(1).join("")}`;
}

function getPriceRuleLabel(rule, machines = []) {
  const fallbackMachine = machines.find((m) => m.id === rule.machineId)?.name;
  const machineName = rule.machineName || fallbackMachine || "Machine";
  const variant = rule.variantLabel || rule.variant || (rule.vatEnabled ? "VAT" : "NON_VAT");
  const cleanVariant = String(variant).replace(/[_-]+/g, " ");
  return `${machineName} · ${cleanVariant} · ETB ${Math.round(Number(rule.unitPrice || 0)).toLocaleString()}`;
}

export default function CreateOrder() {
  const navigate = useNavigate();
  const dialog = useDialog();
  const { user } = useAuth();
  const role = user?.role;

  const [customers, setCustomers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [items, setItems] = useState([]);
  const [priceOptions, setPriceOptions] = useState([]);
  const [modal, setModal] = useState(null);
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
    vatEnabled: true,
    accountName: "Azael Printing",
    bankName: "CBE",
    accountNumber: PAYMENT_ACCOUNTS.vat.cbe,
  });

  function update(key, value) {
    setF((p) => ({ ...p, [key]: value }));
  }

  async function loadRefs() {
    const [c, m, i] = await Promise.all([getCustomers(), getMachines(), getItems()]);
    setCustomers(c || []);
    setMachines(m || []);
    setItems(i || []);
  }

  useEffect(() => {
    loadRefs().catch((e) => dialog.toast(e?.response?.data?.message || "Failed to load reference data", "error"));
  }, []);

  useEffect(() => {
    const name = f.customerName.trim().toLowerCase();
    if (!name) return;
    const match = customers.find((c) => String(c.name || "").trim().toLowerCase() === name);
    if (match?.phone) setF((p) => ({ ...p, customerPhone: onlyDigitsMax10(match.phone) }));
  }, [f.customerName, customers]);

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
      if (selectedItem?.defaultUnit) update("unitType", selectedItem.defaultUnit);
      const rules = await lookupPricesByItem(f.itemId);
      setPriceOptions(rules || []);
    })().catch((e) => alert(e?.response?.data?.message || "Failed to load price rules"));
  }, [f.itemId, items]);

  useEffect(() => {
    if (!priceOptions.length) return;
    const desired = f.vatEnabled ? "VAT" : "NON_VAT";
    const found = priceOptions.find((r) => String(r.variant || "").toUpperCase() === desired);
    if (found) {
      update("priceRuleId", found.id);
      update("machineId", found.machineId);
      update("unitPrice", found.unitPrice);
    }
  }, [f.vatEnabled, priceOptions]);

  useEffect(() => {
    if (!f.priceRuleId) return;
    const rule = priceOptions.find((r) => r.id === f.priceRuleId);
    if (!rule) return;
    update("machineId", rule.machineId);
    update("unitPrice", rule.unitPrice);
    update("vatEnabled", String(rule.variant || "").toUpperCase() !== "NON_VAT");
  }, [f.priceRuleId]);
  useEffect(() => {
    const vatDefault = PAYMENT_ACCOUNTS.vat.cbe;
    const nonVatDefault = PAYMENT_ACCOUNTS.novat.cbe;
    setF((prev) => {
      const nextDefault = prev.vatEnabled ? vatDefault : nonVatDefault;
      if (!prev.accountNumber || prev.accountNumber === vatDefault || prev.accountNumber === nonVatDefault) {
        return { ...prev, accountNumber: nextDefault, bankName: prev.bankName || "CBE" };
      }
      return prev;
    });
  }, [f.vatEnabled]);


  const qtyNum = Number(f.qty || 0);
  const unitPriceNum = Number(f.unitPrice || 0);
  const deliveryFee = f.deliveryType === "DELIVERY" ? 500 : 0;
  const urgencyFee = URGENCY_FEES[f.urgency] || 0;
  const subTotal = useMemo(() => {
    if (!qtyNum || !unitPriceNum) return 0;
    const effUnit = unitPriceNum + deliveryFee / qtyNum;
    return effUnit * qtyNum + urgencyFee;
  }, [qtyNum, unitPriceNum, deliveryFee, urgencyFee]);
  const vatAmount = useMemo(() => (f.vatEnabled ? subTotal * 0.15 : 0), [subTotal, f.vatEnabled]);
  const total = useMemo(() => subTotal + vatAmount, [subTotal, vatAmount]);

  const item = items.find((x) => x.id === f.itemId);
  const machine = machines.find((x) => x.id === f.machineId);

  function validateDateTime() {
    if (!f.deliveryDate) return true;
    if (f.deliveryDate < minDate) return false;
    if (f.deliveryDate === minDate && f.deliveryTime) return f.deliveryTime >= minTimeToday;
    return true;
  }

  const quotationText = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10);
    const jobDesc = f.description || item?.name || "-";
    return `Azael printing Proforma Invoice
Date: ${date}

Job Details:
- Job Description: ${jobDesc}
- Quantity: ${f.qty || "-"} ${f.unitType || ""}
- Unit Price: ${Math.round(unitPriceNum || 0).toLocaleString()}
- VAT: ${f.vatEnabled ? "Yes" : "No"}
- Urgency Level: ${f.urgency}
- Total Price: ${Math.round(total).toLocaleString()}

Payment Information:
- Account Name: ${f.accountName || "Azael Printing"}
- Bank Name: ${f.bankName || "CBE"}
- Account Number: ${f.accountNumber || "-"}

Note:
- Quotation only. Payment status and deposit will be updated after quotation approval.
- Thanks for choosing us.`;
  }, [f.description, item?.name, f.qty, f.unitType, unitPriceNum, f.vatEnabled, f.urgency, total, f.accountName, f.bankName, f.accountNumber]);

  async function copyQuotation() {
    try {
      await navigator.clipboard.writeText(quotationText);
      dialog.toast("Quotation copied", "success");
    } catch {
      dialog.toast("Could not copy quotation", "error");
    }
  }

  async function quotationSent() {
    const name = f.customerName.trim();
    if (!name) return dialog.alert("Customer name required");
    if (!/^[A-Za-z\s]+$/.test(name)) return dialog.alert("Customer name must be alphabets only");
    if (f.customerPhone && !/^\d{10}$/.test(f.customerPhone)) return dialog.alert("Phone must be exactly 10 digits (or leave empty)");
    if (!f.itemId) return dialog.alert("Select Work Type");
    if (!f.priceRuleId) return dialog.alert("Select Price");
    if (!qtyNum || qtyNum <= 0) return dialog.alert("Quantity must be a number");
    if (!validateDateTime()) return dialog.alert("Delivery date/time must be current or future only");

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
        deliveryDate: f.deliveryDate ? new Date(f.deliveryDate).toISOString() : null,
        deliveryTime: f.deliveryTime || null,
        unitPrice: unitPriceNum,
        vatEnabled: !!f.vatEnabled,
        paymentStatus: "UNPAID",
        depositAmount: 0,
        remainingBalance: total,
        accountName: f.accountName,
        bankName: f.bankName,
        accountNumber: f.accountNumber,
      };
      const job = await createJob(payload);
      savePaymentMeta(job?.id, {
        accountName: f.accountName,
        bankName: f.bankName,
        accountNumber: f.accountNumber,
      });
      dialog.toast(`Quotation sent ${job?.jobNo ? `for AZ-${String(job.jobNo).padStart(4, "0")}` : ""}`, "success");
      navigate(role === "CS" ? "/app/cs/jobs" : "/app/admin/jobs");
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Failed to create job", "error");
    }
  }

  async function handleCreateModal() {
    try {
      if (modal === "customer") {
        const name = onlyLettersSpaces(tmp.name).trim();
        const phone = onlyDigitsMax10(tmp.phone).trim();
        if (!name) return dialog.alert("Name required");
        if (phone && phone.length !== 10) return dialog.alert("Phone must be exactly 10 digits");
        await addCustomer(name, phone || "");
      }
      if (modal === "machine") {
        const name = String(tmp.name || "").trim();
        if (!name) return dialog.alert("Machine name required");
        await addMachine(name);
      }
      if (modal === "item") {
        const name = String(tmp.name || "").trim();
        if (!name) return dialog.alert("Item name required");
        await addItem(name, String(tmp.defaultUnit || "pcs").trim());
      }
      if (modal === "price") {
        if (!tmp.itemId) return dialog.alert("Select item");
        if (!tmp.machineId) return dialog.alert("Select machine");
        if (!tmp.unitPrice || Number(tmp.unitPrice) <= 0) return dialog.alert("Enter unit price");
        const variant = String(tmp.variant || (tmp.vatEnabled === false ? "NON_VAT" : "VAT")).trim();
        const label = tmp.variantLabel ? String(tmp.variantLabel).trim() : null;
        await addPrice(tmp.itemId, tmp.machineId, Number(tmp.unitPrice), tmp.vatEnabled !== false, variant, label);
      }
      if (modal === "payment") {
        const accountName = String(tmp.accountName || "").trim() || "Azael Printing";
        const bankName = String(tmp.bankName || "").trim() || "CBE";
        const accountNumber = String(tmp.accountNumber || "").trim();
        if (!accountNumber) return dialog.alert("Account number required");
        setF((prev) => ({ ...prev, accountName, bankName, accountNumber }));
      }
      setModal(null);
      setTmp({});
      await loadRefs();
      if (f.itemId) {
        const rules = await lookupPricesByItem(f.itemId);
        setPriceOptions(rules || []);
      }
      dialog.toast("Saved", "success");
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Save failed", "error");
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm min-w-0 xl:sticky xl:top-4 self-start">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-lg sm:text-xl font-semibold text-primary">Create Order</h2>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setModal("customer"); setTmp({ name: "", phone: "" }); }} className="px-3 py-2 rounded-xl bg-bgLight text-primary text-xs sm:text-sm font-semibold">Register Customer</button>
            <button onClick={() => { setModal("item"); setTmp({ name: "", defaultUnit: "pcs" }); }} className="px-3 py-2 rounded-xl bg-bgLight text-primary text-xs sm:text-sm font-semibold">Add Item</button>
            <button onClick={() => { setModal("machine"); setTmp({ name: "" }); }} className="px-3 py-2 rounded-xl bg-bgLight text-primary text-xs sm:text-sm font-semibold">Add Machine</button>
            <button onClick={() => { setModal("price"); setTmp({ itemId: "", machineId: "", unitPrice: "", vatEnabled: true, variant: "VAT", variantLabel: "" }); }} className="px-3 py-2 rounded-xl bg-bgLight text-primary text-xs sm:text-sm font-semibold">Add Price</button>
            <button onClick={() => { setModal("payment"); setTmp({ accountName: f.accountName, bankName: f.bankName || "CBE", accountNumber: f.accountNumber }); }} className="px-3 py-2 rounded-xl bg-bgLight text-primary text-xs sm:text-sm font-semibold">Add Payment Method</button>
          </div>
        </div>

        <div className="mt-5">
          <div className="font-semibold text-sm sm:text-base text-zinc-900 border-b border-zinc-200 pb-2">Customer Information</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Customer name</div>
              <input list="customerNames" className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" value={f.customerName} onChange={(e) => update("customerName", onlyLettersSpaces(e.target.value))} placeholder="Start typing..." />
              <datalist id="customerNames">{customers.map((c) => <option key={c.id} value={c.name} />)}</datalist>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Phone</div>
              <input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" value={f.customerPhone} onChange={(e) => update("customerPhone", onlyDigitsMax10(e.target.value))} placeholder="10 digits (optional)" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="font-semibold text-sm sm:text-base text-zinc-900 border-b border-zinc-200 pb-2">Job Details</div>
          <div className="mt-3 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Work Type</div>
                <select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={f.itemId} onChange={(e) => update("itemId", e.target.value)}>
                  <option value="">Select work type</option>
                  {items.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Price Rule</div>
                <select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={f.priceRuleId} onChange={(e) => update("priceRuleId", e.target.value)}>
                  <option value="">Select price</option>
                  {priceOptions.map((rule) => <option key={rule.id} value={rule.id}>{getPriceRuleLabel(rule, machines)}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Machine</div>
                <input className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" value={machine?.name || ""} disabled />
              </div>
            </div>

            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Description</div>
              <textarea className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[110px] text-sm" value={f.description} onChange={(e) => update("description", e.target.value)} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Quantity</div>
                <input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" value={f.qty} onChange={(e) => update("qty", onlyNumberLike(e.target.value))} />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Unit Type</div>
                <select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={f.unitType} onChange={(e) => update("unitType", e.target.value)}>
                  <option value="pcs">pcs</option><option value="sqm">sqm</option><option value="meter">meter</option><option value="set">set</option><option value="box">box</option>
                </select>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Designer Required</div>
                <select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={f.designerRequired ? "YES" : "NO"} onChange={(e) => update("designerRequired", e.target.value === "YES")}>
                  <option value="NO">No</option>
                  <option value="YES">Yes</option>
                </select>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Urgency</div>
                <select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={f.urgency} onChange={(e) => update("urgency", e.target.value)}>
                  <option value="NORMAL">Normal</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Delivery date</div>
                <input type="date" className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" min={minDate} value={f.deliveryDate} onChange={(e) => update("deliveryDate", e.target.value)} />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Delivery time</div>
                <input type="time" min={f.deliveryDate === minDate ? minTimeToday : undefined} className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" value={f.deliveryTime} onChange={(e) => update("deliveryTime", e.target.value)} />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Pickup / Delivery</div>
                <select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={f.deliveryType} onChange={(e) => update("deliveryType", e.target.value)}>
                  <option value="PICKUP">Pickup</option>
                  <option value="DELIVERY">Delivery</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="font-semibold text-sm sm:text-base text-zinc-900 border-b border-zinc-200 pb-2">Pricing</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Unit Price</div>
              <input className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={f.unitPrice} onChange={(e) => update("unitPrice", onlyNumberLike(e.target.value))} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">VAT</div>
              <select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={f.vatEnabled ? "YES" : "NO"} onChange={(e) => update("vatEnabled", e.target.value === "YES")}>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">Total Price</div>
              <input className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" value={Math.round(total).toLocaleString()} disabled />
            </div>
          </div>
          <div className="mt-3 text-xs sm:text-sm text-zinc-500 font-semibold">Payment status and deposit will be added after the job is created and quotation is approved.</div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm min-w-0">
        <h2 className="text-lg sm:text-xl font-semibold text-primary">Summary</h2>
        <div className="text-[11px] sm:text-xs text-zinc-400 font-semibold mt-1">Fill details • Review summary • Send quotation</div>
        <div className="mt-4 text-[12px] sm:text-[13px] grid gap-2">
          <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
            <div className="text-right font-semibold text-zinc-600">Customer:</div><div className="font-semibold text-zinc-900 truncate">{f.customerName || "..."}</div>
            <div className="text-right font-semibold text-zinc-600">Phone:</div><div className="font-semibold text-zinc-900 truncate">{f.customerPhone || "..."}</div>
            <div className="text-right font-semibold text-zinc-600">Machine:</div><div className="font-semibold text-zinc-900 truncate">{machine?.name || "..."}</div>
            <div className="text-right font-semibold text-zinc-600">Work Type:</div><div className="font-semibold text-zinc-900 truncate">{item?.name || "..."}</div>
            <div className="text-right font-semibold text-zinc-600">Description:</div><div className="font-semibold text-zinc-900 break-words">{f.description || "..."}</div>
            <div className="text-right font-semibold text-zinc-600">Quantity:</div><div className="font-semibold text-zinc-900">{f.qty || "..."} {f.unitType}</div>
            <div className="text-right font-semibold text-zinc-600">VAT:</div><div className="font-semibold text-zinc-900">{f.vatEnabled ? "Yes" : "No"}</div>
            <div className="text-right font-semibold text-zinc-600">Bank:</div><div className="font-semibold text-zinc-900 truncate">{f.bankName || "CBE"}</div>
            <div className="text-right font-semibold text-zinc-600">Account #:</div><div className="font-semibold text-zinc-900 truncate">{f.accountNumber || "..."}</div>
            <div className="text-right font-semibold text-zinc-600">Total:</div><div className="font-semibold text-zinc-900">{Math.round(total).toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={copyQuotation} className="px-4 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold text-primary hover:bg-bgLight transition">Copy Quotation</button>
          <button onClick={quotationSent} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition">Quotation sent</button>
        </div>

        <div className="mt-4">
          <div className="text-zinc-500 font-semibold text-xs sm:text-sm">Quotation Preview</div>
          <pre className="mt-2 p-3 rounded-xl bg-bgLight border border-zinc-200 text-[11px] sm:text-xs whitespace-pre-wrap overflow-auto">{quotationText}</pre>
        </div>

        {modal && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={() => setModal(null)} />
            <div className="absolute left-1/2 top-1/2 w-[94%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-primary text-base sm:text-lg">{modal === "customer" && "Register Customer"}{modal === "machine" && "Add Machine"}{modal === "item" && "Add Item"}{modal === "price" && "Add Price"}{modal === "payment" && "Add Payment Method"}</div>
                <button onClick={() => setModal(null)} className="px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold hover:bg-bgLight">Close</button>
              </div>
              <div className="mt-4 grid gap-3">
                {modal === "customer" && <><input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" placeholder="Customer name" value={tmp.name || ""} onChange={(e) => setTmp((p) => ({ ...p, name: e.target.value }))} /><input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" placeholder="Phone" value={tmp.phone || ""} onChange={(e) => setTmp((p) => ({ ...p, phone: e.target.value }))} /></>}
                {modal === "machine" && <input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" placeholder="Machine name" value={tmp.name || ""} onChange={(e) => setTmp((p) => ({ ...p, name: e.target.value }))} />}
                {modal === "item" && <><input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" placeholder="Item name" value={tmp.name || ""} onChange={(e) => setTmp((p) => ({ ...p, name: e.target.value }))} /><select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={tmp.defaultUnit || "pcs"} onChange={(e) => setTmp((p) => ({ ...p, defaultUnit: e.target.value }))}><option value="pcs">pcs</option><option value="sqm">sqm</option><option value="meter">meter</option><option value="set">set</option><option value="box">box</option></select></>}
                {modal === "price" && <><select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={tmp.itemId || ""} onChange={(e) => setTmp((p) => ({ ...p, itemId: e.target.value }))}><option value="">Select item</option>{items.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select><select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={tmp.machineId || ""} onChange={(e) => setTmp((p) => ({ ...p, machineId: e.target.value }))}><option value="">Select machine</option>{machines.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select><input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" placeholder="Unit price" value={tmp.unitPrice || ""} onChange={(e) => setTmp((p) => ({ ...p, unitPrice: onlyNumberLike(e.target.value) }))} /><select className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm" value={tmp.variant || "VAT"} onChange={(e) => setTmp((p) => ({ ...p, variant: e.target.value, vatEnabled: e.target.value !== "NON_VAT" }))}><option value="VAT">VAT</option><option value="NON_VAT">NON_VAT</option></select></>}{modal === "payment" && <><input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" placeholder="Account Name" value={tmp.accountName || "Azael Printing"} onChange={(e) => setTmp((p) => ({ ...p, accountName: e.target.value }))} /><input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" placeholder="Bank Name" value={tmp.bankName || "CBE"} onChange={(e) => setTmp((p) => ({ ...p, bankName: e.target.value }))} /><input className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm" placeholder="Account Number" value={tmp.accountNumber || ""} onChange={(e) => setTmp((p) => ({ ...p, accountNumber: e.target.value }))} /></>}
                <button onClick={handleCreateModal} className="mt-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
