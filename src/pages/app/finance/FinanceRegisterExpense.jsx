import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FinanceSectionCard from "../../../components/common/FinanceSectionCard";
import FinanceSidePanel from "../../../components/common/FinanceSidePanel";
import {
  financeInputClass,
  financeMetaGridClass,
  financeMetaLabelClass,
  financeMetaValueClass,
  financePrimaryBtnClass,
  financeSecondaryBtnClass,
  financeTextareaClass,
} from "../../../components/common/financeUi";
import { useDialog } from "../../../components/common/DialogProvider";
import { createExpense } from "../../api/finance.api";

function money(value) {
  return `ETB ${Number(value || 0).toLocaleString()}`;
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
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/finance")
    ? "/app/admin/finance"
    : "/app/finance";
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const total = useMemo(
    () => Number(form.qty || 0) * Number(form.unitPrice || 0),
    [form.qty, form.unitPrice],
  );

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function clear() {
    setForm(initialForm);
  }

  async function submit() {
    if (!form.date || !form.category || !form.description || !form.qty || !form.unitPrice || !form.paidBy) {
      dialog.toast("Fill all required expense fields first.", "error");
      return;
    }

    try {
      setSaving(true);
      await createExpense(form);
      dialog.toast("Expense saved", "success");
      clear();
      navigate(`${basePath}/expenses/overview`);
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Failed to save expense", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <FinanceSectionCard
        title="New Expense"
        subtitle="Record a purchase and send it straight to Expense Overview."
        className="p-6"
      >
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <label className="block">
            <div className="mb-2 text-[14px] font-semibold text-zinc-900">Date</div>
            <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={financeInputClass} />
          </label>

          <label className="block">
            <div className="mb-2 text-[14px] font-semibold text-zinc-900">Category</div>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className={financeInputClass}>
              <option value="">Select category</option>
              <option value="Materials">Materials</option>
              <option value="Outsourcing">Outsourcing</option>
              <option value="Fuel">Fuel</option>
              <option value="Salary">Salary</option>
              <option value="Utility">Utility</option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <div className="mb-2 text-[14px] font-semibold text-zinc-900">Description</div>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className={financeTextareaClass}
              placeholder="Describe the expense clearly"
            />
          </label>

          <label className="block">
            <div className="mb-2 text-[14px] font-semibold text-zinc-900">Qty</div>
            <input value={form.qty} onChange={(e) => update("qty", e.target.value)} className={financeInputClass} placeholder="1, 2, 3..." />
          </label>

          <label className="block">
            <div className="mb-2 text-[14px] font-semibold text-zinc-900">Unit price (ETB)</div>
            <input value={form.unitPrice} onChange={(e) => update("unitPrice", e.target.value)} className={financeInputClass} placeholder="Amount" />
          </label>

          <div className="block">
            <div className="mb-2 text-[14px] font-semibold text-zinc-900">Receipt / specification</div>
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
              <input type="radio" checked={form.receipt === "YES"} onChange={() => update("receipt", "YES")} /> YES
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm font-semibold text-zinc-800">
              <input type="radio" checked={form.receipt === "NO"} onChange={() => update("receipt", "NO")} /> NO
            </label>
          </div>

          <label className="block">
            <div className="mb-2 text-[14px] font-semibold text-zinc-900">Paid by</div>
            <select value={form.paidBy} onChange={(e) => update("paidBy", e.target.value)} className={financeInputClass}>
              <option value="">Select payer</option>
              <option value="Cash">Cash</option>
              <option value="Company">Company</option>
              <option value="Fikade">Fikade</option>
            </select>
          </label>

          <div>
            <div className="mb-2 text-[14px] font-semibold text-zinc-900">Total price (ETB)</div>
            <div className="text-[30px] font-semibold leading-none text-primary">{money(total)}</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={clear} className={financeSecondaryBtnClass}>Clear data</button>
          <button onClick={submit} disabled={saving} className={financePrimaryBtnClass}>
            {saving ? "Saving..." : "+ Add Expense"}
          </button>
        </div>
      </FinanceSectionCard>

      <FinanceSidePanel title="Summary" subtitle="Save → redirect → verify in Expense Overview">
        <div className={financeMetaGridClass}>
          <div className={financeMetaLabelClass}>Date</div><div className={financeMetaValueClass}>{form.date || "dd/mm/yyyy"}</div>
          <div className={financeMetaLabelClass}>Category</div><div className={financeMetaValueClass}>{form.category || "-"}</div>
          <div className={financeMetaLabelClass}>Description</div><div className={financeMetaValueClass}>{form.description || "-"}</div>
          <div className={financeMetaLabelClass}>Qty</div><div className={financeMetaValueClass}>{form.qty || "-"}</div>
          <div className={financeMetaLabelClass}>Unit price (ETB)</div><div className={financeMetaValueClass}>{form.unitPrice || "-"}</div>
          <div className={financeMetaLabelClass}>Receipt / specification</div><div className={financeMetaValueClass}>{form.receipt.toLowerCase()}</div>
          <div className={financeMetaLabelClass}>Paid by</div><div className={financeMetaValueClass}>{form.paidBy || "-"}</div>
          <div className={financeMetaLabelClass}>Total price (ETB)</div><div className={financeMetaValueClass}>{total ? Number(total).toLocaleString() : "0"}</div>
        </div>

        <button onClick={submit} disabled={saving} className={`${financePrimaryBtnClass} mt-8 w-full min-w-0`}>
          {saving ? "Saving..." : "Submit Expense"}
        </button>
      </FinanceSidePanel>
    </div>
  );
}
