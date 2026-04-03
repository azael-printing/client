import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FinanceSectionCard from "../../../components/common/FinanceSectionCard";
import FinanceSidePanel from "../../../components/common/FinanceSidePanel";
import FinanceStatCard from "../../../components/common/FinanceStatCard";
import { financePrimaryBtnClass } from "../../../components/common/financeUi";
import { getExpenseDashboard } from "../../api/finance.api";
import { money } from "./financeShared";

export default function FinanceExpensesDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/finance")
    ? "/app/admin/finance"
    : "/app/finance";

  const [expenseRows, setExpenseRows] = useState([]);
  const [summary, setSummary] = useState({
    totalVariableExpenses: 0,
    totalFixedExpenses: 0,
    governmentObligations: 0,
    grandTotalMonthlyExpense: 0,
  });
  const [reminders, setReminders] = useState([]);
  const [insights, setInsights] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const data = await getExpenseDashboard();
      setExpenseRows(data?.expenses || []);
      setSummary(
        data?.summary || {
          totalVariableExpenses: 0,
          totalFixedExpenses: 0,
          governmentObligations: 0,
          grandTotalMonthlyExpense: 0,
        },
      );
      setReminders(data?.reminders || []);
      setInsights(data?.insights || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load expense dashboard");
      setExpenseRows([]);
      setSummary({
        totalVariableExpenses: 0,
        totalFixedExpenses: 0,
        governmentObligations: 0,
        grandTotalMonthlyExpense: 0,
      });
      setReminders([]);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(
    () =>
      expenseRows.map((row) => ({
        id: row.id,
        description: row.description || "-",
        qty: row.qty || 0,
        total: row.total || 0,
        purchasedBy: row.purchasedBy || row.createdByName || "-",
        category: row.category || row.categoryLabel || "-",
      })),
    [expenseRows],
  );

  return (
    <div className="grid gap-5">
      {err ? <div className="text-sm font-semibold text-red-600">{err}</div> : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <FinanceStatCard
          title="Total Variable Expenses"
          value={money(summary.totalVariableExpenses)}
          subtitle="Saved expense entries"
          onClick={() => navigate(`${basePath}/expenses/report`)}
        />
        <FinanceStatCard
          title="Total Fixed Expenses"
          value={money(summary.totalFixedExpenses)}
          subtitle="Not connected yet"
          onClick={() => navigate(`${basePath}/expenses/overview`)}
        />
        <FinanceStatCard
          title="Government Obligations"
          value={money(summary.governmentObligations)}
          subtitle="Not connected yet"
          onClick={() => navigate(`${basePath}/expenses/overview`)}
        />
        <FinanceStatCard
          title="Grand Total Monthly Expense"
          value={money(summary.grandTotalMonthlyExpense)}
          subtitle="Current tracked total"
          onClick={() => navigate(`${basePath}/expenses/report`)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
        <FinanceSectionCard title="Expense report" subtitle="Filter by payer, category or description.">
          <div className="mt-6 overflow-x-auto rounded-[18px] bg-white">
            <table className="min-w-[760px] w-full text-sm text-zinc-900">
              <thead>
                <tr className="bg-bgLight text-left">
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Qty</th>
                  <th className="px-4 py-3 font-semibold">Total (ETB)</th>
                  <th className="px-4 py-3 font-semibold">Purchased By</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-5 text-sm font-semibold text-zinc-500">Loading expenses...</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-5 text-sm font-semibold text-zinc-500">No tracked expense data found.</td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/70 last:border-b-0">
                      <td className="px-4 py-1.5 font-medium text-zinc-800">{row.description}</td>
                      <td className="px-4 py-1.5 font-medium text-zinc-800">{row.qty}</td>
                      <td className="px-4 py-1.5 font-medium text-zinc-800">{Number(row.total || 0).toLocaleString()}</td>
                      <td className="px-4 py-1.5 font-medium text-zinc-800">{row.purchasedBy}</td>
                      <td className="px-4 py-1.5 font-medium text-zinc-800">{row.category}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-full bg-bgLight px-5 py-4">
            <div className="text-primary font-extrabold text-[18px]">Grand total (filtered)</div>
            <div className="text-primary font-extrabold text-[20px]">{money(summary.totalVariableExpenses)}</div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-5 sm:justify-start">
            <button
              type="button"
              className={`${financePrimaryBtnClass} min-w-[152px]`}
              onClick={() => navigate(`${basePath}/expenses/register`)}
            >
              +Add Expense
            </button>
            <button type="button" className={`${financePrimaryBtnClass} min-w-[152px]`} onClick={load}>
              Refresh
            </button>
          </div>
        </FinanceSectionCard>

        <FinanceSidePanel title="Tax & Compliance Reminders" subtitle="Keep monthly finance work from slipping." className="min-h-[386px]">
          <div className="space-y-3 text-[14px] leading-[1.45] text-zinc-900">
            {(reminders.length ? reminders : [
              { title: "VAT Payment", body: "Due by 30th of the month." },
              { title: "Salary Income Tax", body: "Due within first 10 days of next month." },
              { title: "Pension Contribution", body: "Align with salary payment date." },
              { title: "Check", body: "All tax payments should have receipts attached in the finance records." },
            ]).map((item) => (
              <div key={item.title}>
                <div className="font-extrabold">{item.title}:</div>
                <div>{item.body}</div>
              </div>
            ))}
          </div>

          <div className="mt-7 border-t border-zinc-100 pt-5">
            <h4 className="text-[18px] font-extrabold text-primary">Insights</h4>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-[14px] leading-[1.45] text-zinc-900">
              {(insights.length ? insights : [
                "Watch fuel, outsourcing and stock purchases under Variable Expenses.",
                "Make sure all fixed payments are marked as paid.",
                "Track VAT, salary tax and pension so there are no late penalties.",
              ]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </FinanceSidePanel>
      </div>
    </div>
  );
}
