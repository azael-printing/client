import { useMemo, useState } from "react";
import FinanceSectionCard from "../../../components/common/FinanceSectionCard";
import FinanceSidePanel from "../../../components/common/FinanceSidePanel";
import {
  financeMetaGridClass,
  financeMetaLabelClass,
  financeMetaValueClass,
  financePrimaryBtnClass,
  financeSecondaryBtnClass,
} from "../../../components/common/financeUi";
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
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <FinanceSectionCard title="New Expense" subtitle="Record a purchase and who paid for it." className="rounded-[28px] p-8">
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2">
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

          <label className="md:col-span-2 block">
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
            <label className="mt-1 flex items-center gap-2 text-sm font-semibold text-zinc-800"><input type="radio" checked={form.receipt === "NO"} onChange={() => update("receipt", "NO")} /> NO</label>
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

        <div className="mt-10 flex flex-wrap gap-4">
          <button onClick={clear} className={financeSecondaryBtnClass}>Clear data</button>
          <button onClick={submit} className={financePrimaryBtnClass}>+Add Expense</button>
        </div>
      </FinanceSectionCard>

      <FinanceSidePanel title="Summary" subtitle="Fill details - Review summary - Save">
        <div className={financeMetaGridClass}>
          <div className={financeMetaLabelClass}>Date</div><div className={financeMetaValueClass}>{form.date || "dd/mm/yyyy"}</div>
          <div className={financeMetaLabelClass}>Category</div><div className={financeMetaValueClass}>{form.category || "Abc"}</div>
          <div className={financeMetaLabelClass}>Description</div><div className={financeMetaValueClass}>{form.description || "Abc"}</div>
          <div className={financeMetaLabelClass}>Qty</div><div className={financeMetaValueClass}>{form.qty || "1,2,3..."}</div>
          <div className={financeMetaLabelClass}>Unit price (ETB)</div><div className={financeMetaValueClass}>{form.unitPrice || "1,2,3..."}</div>
          <div className={financeMetaLabelClass}>Receipt / specification</div><div className={financeMetaValueClass}>{form.receipt.toLowerCase()}</div>
          <div className={financeMetaLabelClass}>Paid by</div><div className={financeMetaValueClass}>{form.paidBy || "Abc"}</div>
          <div className={financeMetaLabelClass}>Total price(ETB)</div><div className={financeMetaValueClass}>{total ? Number(total).toLocaleString() : "123"}</div>
        </div>

        <button onClick={submit} className={`${financePrimaryBtnClass} mt-8 w-full min-w-0`}>
          Submit Expense
        </button>
      </FinanceSidePanel>
    </div>
  );
}
