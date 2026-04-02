import { useMemo, useState } from "react";
import { useDialog } from "../../../components/common/DialogProvider";

function money(v) {
  return `ETB ${Number(v || 0).toLocaleString()}`;
}

const initialForm = {
  date: "",
  category: "",
  description: "",
  qty: "",
  unitPrice: "",
  receipt: "YES",
  paidBy: "",
};

export default function FinanceRegisterExpense() {
  const dialog = useDialog();
  const [form, setForm] = useState(initialForm);

  const total = useMemo(() => Number(form.qty || 0) * Number(form.unitPrice || 0), [form.qty, form.unitPrice]);

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function clear() {
    setForm(initialForm);
  }

  function submit() {
    dialog.toast("Expense register UI updated. Backend save endpoint is not wired yet.", "success");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="bg-white border border-zinc-200 rounded-[28px] p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
        <div>
          <h2 className="text-primary text-[30px] font-extrabold leading-none">New Expense</h2>
          <p className="mt-1 text-zinc-500 font-semibold text-sm">Record a purchase and who paid for it.</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-7">
          <label className="block">
            <div className="mb-2 text-[14px] font-extrabold text-zinc-900">Date</div>
            <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="w-full rounded-full border border-sky-200 bg-bgLight px-4 py-3 text-sm font-semibold text-zinc-700 outline-none" />
          </label>

          <label className="block">
            <div className="mb-2 text-[14px] font-extrabold text-zinc-900">Category</div>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full rounded-full border border-sky-200 bg-bgLight px-4 py-3 text-sm font-semibold text-zinc-700 outline-none">
              <option value="">Select category</option>
              <option value="Materials">Materials</option>
              <option value="Outsourcing">Outsourcing</option>
              <option value="Fuel">Fuel</option>
              <option value="Salary">Salary</option>
              <option value="Utility">Utility</option>
            </select>
          </label>

          <label className="col-span-2 block">
            <div className="mb-2 text-[14px] font-extrabold text-zinc-900">Description</div>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="h-44 w-full rounded-2xl border border-sky-200 bg-bgLight px-4 py-4 text-sm font-semibold text-zinc-700 outline-none resize-none" placeholder="Abc" />
          </label>

          <label className="block">
            <div className="mb-2 text-[14px] font-extrabold text-zinc-900">Qty</div>
            <input value={form.qty} onChange={(e) => update("qty", e.target.value)} className="w-full rounded-full border border-sky-200 bg-bgLight px-4 py-3 text-sm font-semibold text-zinc-700 outline-none" placeholder="1,2,3..." />
          </label>

          <label className="block">
            <div className="mb-2 text-[14px] font-extrabold text-zinc-900">Unit price (ETB)</div>
            <input value={form.unitPrice} onChange={(e) => update("unitPrice", e.target.value)} className="w-full rounded-full border border-sky-200 bg-bgLight px-4 py-3 text-sm font-semibold text-zinc-700 outline-none" placeholder="1,2,3..." />
          </label>

          <div className="block">
            <div className="mb-2 text-[14px] font-extrabold text-zinc-900">Receipt / specification</div>
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800"><input type="radio" checked={form.receipt === "YES"} onChange={() => update("receipt", "YES")} /> YES</label>
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800"><input type="radio" checked={form.receipt === "NO"} onChange={() => update("receipt", "NO")} /> NO</label>
          </div>

          <label className="block">
            <div className="mb-2 text-[14px] font-extrabold text-zinc-900">Paid by</div>
            <select value={form.paidBy} onChange={(e) => update("paidBy", e.target.value)} className="w-full rounded-full border border-sky-200 bg-bgLight px-4 py-3 text-sm font-semibold text-zinc-700 outline-none">
              <option value="">Select payer</option>
              <option value="Cash">Cash</option>
              <option value="Company">Company</option>
              <option value="Fikade">Fikade</option>
            </select>
          </label>

          <div>
            <div className="mb-2 text-[14px] font-extrabold text-zinc-900">Total price(ETB)</div>
            <div className="text-primary text-[34px] font-extrabold leading-none">{money(total)}</div>
          </div>
        </div>

        <div className="mt-10 flex gap-6">
          <button onClick={clear} className="min-w-[180px] rounded-xl bg-primary px-6 py-3 text-white font-extrabold shadow-sm hover:opacity-95 transition">Clear data</button>
          <button onClick={submit} className="min-w-[180px] rounded-xl bg-primary px-6 py-3 text-white font-extrabold shadow-sm hover:opacity-95 transition">+Add Expense</button>
        </div>
      </div>

      <aside className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-sm lg:sticky lg:top-4 self-start">
        <div className="text-primary text-[30px] font-extrabold leading-none">Summary</div>
        <div className="mt-2 text-zinc-400 text-[13px] font-bold">Fill details - Review summary - Save</div>

        <div className="mt-8 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-[14px] leading-tight text-zinc-900">
          <div className="font-extrabold">Date</div><div className="text-zinc-400">{form.date || "dd/mm/yyyy"}</div>
          <div className="font-extrabold">Category</div><div className="text-zinc-400">{form.category || "Abc"}</div>
          <div className="font-extrabold">Description</div><div className="text-zinc-400">{form.description || "Abc"}</div>
          <div className="font-extrabold">Qty</div><div className="text-zinc-400">{form.qty || "1,2,3..."}</div>
          <div className="font-extrabold">Unit price (ETB)</div><div className="text-zinc-400">{form.unitPrice || "1,2,3..."}</div>
          <div className="font-extrabold">Receipt / specification</div><div className="text-zinc-400">{form.receipt.toLowerCase()}</div>
          <div className="font-extrabold">Paid by</div><div className="text-zinc-400">{form.paidBy || "Abc"}</div>
          <div className="font-extrabold">Total price(ETB)</div><div className="text-zinc-400">{total ? Number(total).toLocaleString() : "123"}</div>
        </div>

        <button onClick={submit} className="mt-10 w-full rounded-xl bg-primary px-6 py-3 text-white font-extrabold shadow-sm hover:opacity-95 transition">Submit Expense</button>
      </aside>
    </div>
  );
}
