// CreateOrder
import { useState } from "react";
import { createJob } from "../../api/jobs.api";

export default function CreateOrder() {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    machine: "UV / Engraving",
    workType: "",
    description: "",
    qty: 1,
    unitType: "pcs",
    designerRequired: true,
    urgency: "NORMAL",
    deliveryType: "PICKUP",
    deliveryDate: "",
    deliveryTime: "",
    unitPrice: 1,
    vatEnabled: true,
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        qty: Number(form.qty),
        unitPrice: Number(form.unitPrice),
        deliveryDate: form.deliveryDate ? form.deliveryDate : undefined,
        deliveryTime: form.deliveryTime ? form.deliveryTime : undefined,
      };
      const job = await createJob(payload);
      setMsg(`Created Job #${job.jobNo} successfully.`);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-extrabold text-primary">Create Order</h2>

      <form onSubmit={onSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
        <input
          className="p-3 rounded-xl border border-zinc-200"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={(e) => setField("customerName", e.target.value)}
        />

        <input
          className="p-3 rounded-xl border border-zinc-200"
          placeholder="Customer Phone"
          value={form.customerPhone}
          onChange={(e) => setField("customerPhone", e.target.value)}
        />

        <input
          className="p-3 rounded-xl border border-zinc-200"
          placeholder="Machine"
          value={form.machine}
          onChange={(e) => setField("machine", e.target.value)}
        />

        <input
          className="p-3 rounded-xl border border-zinc-200"
          placeholder="Work Type"
          value={form.workType}
          onChange={(e) => setField("workType", e.target.value)}
        />

        <textarea
          className="p-3 rounded-xl border border-zinc-200 md:col-span-2 min-h-[100px]"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
        />

        <input
          className="p-3 rounded-xl border border-zinc-200"
          type="number"
          step="1"
          min="1"
          value={form.qty}
          onChange={(e) => setField("qty", e.target.value)}
        />

        <input
          className="p-3 rounded-xl border border-zinc-200"
          placeholder="Unit Type (pcs, m2, etc)"
          value={form.unitType}
          onChange={(e) => setField("unitType", e.target.value)}
        />

        <select
          className="p-3 rounded-xl border border-zinc-200"
          value={form.designerRequired ? "YES" : "NO"}
          onChange={(e) =>
            setField("designerRequired", e.target.value === "YES")
          }
        >
          <option value="YES">Designer Required: Yes</option>
          <option value="NO">Designer Required: No</option>
        </select>

        <select
          className="p-3 rounded-xl border border-zinc-200"
          value={form.urgency}
          onChange={(e) => setField("urgency", e.target.value)}
        >
          <option value="NORMAL">Urgency: Normal</option>
          <option value="HIGH">Urgency: High (+300)</option>
          <option value="URGENT">Urgency: Urgent (+1000)</option>
        </select>

        <select
          className="p-3 rounded-xl border border-zinc-200"
          value={form.deliveryType}
          onChange={(e) => setField("deliveryType", e.target.value)}
        >
          <option value="PICKUP">Pickup</option>
          <option value="DELIVERY">Delivery</option>
        </select>

        <input
          className="p-3 rounded-xl border border-zinc-200"
          type="date"
          value={form.deliveryDate}
          onChange={(e) => setField("deliveryDate", e.target.value)}
        />

        <input
          className="p-3 rounded-xl border border-zinc-200"
          type="time"
          value={form.deliveryTime}
          onChange={(e) => setField("deliveryTime", e.target.value)}
        />

        <input
          className="p-3 rounded-xl border border-zinc-200"
          type="number"
          step="0.01"
          min="0"
          value={form.unitPrice}
          onChange={(e) => setField("unitPrice", e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
          <input
            type="checkbox"
            checked={form.vatEnabled}
            onChange={(e) => setField("vatEnabled", e.target.checked)}
          />
          VAT Enabled (15%)
        </label>

        <button
          disabled={loading}
          className="md:col-span-2 p-3 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Order"}
        </button>

        {msg && (
          <div className="md:col-span-2 text-success font-bold">{msg}</div>
        )}
        {err && (
          <div className="md:col-span-2 text-red-600 font-bold">{err}</div>
        )}
      </form>
    </div>
  );
}
