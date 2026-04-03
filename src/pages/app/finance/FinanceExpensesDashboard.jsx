import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FinanceSectionCard from "../../../components/common/FinanceSectionCard";
import FinanceSidePanel from "../../../components/common/FinanceSidePanel";
import FinanceStatCard from "../../../components/common/FinanceStatCard";
import FinanceTableShell from "../../../components/common/FinanceTableShell";
import {
  financePrimaryBtnClass,
  financeSecondaryBtnClass,
} from "../../../components/common/financeUi";
import { exportRowsToCsv } from "../../../utils/exportCsv";
import { getExpenseDashboard } from "../../api/finance.api";

function money(value) {
  return `ETB ${Number(value || 0).toLocaleString()}`;
}

export default function FinanceExpensesDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/finance")
    ? "/app/admin/finance"
    : "/app/finance";

  const [rows, setRows] = useState([]);
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
      setRows(data?.expenses || []);
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
      setRows([]);
      setReminders([]);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const exportRows = useMemo(
    () => rows.map((row) => [row.date ? new Date(row.date).toLocaleDateString() : "-", row.category, row.description, row.qty, row.unitPrice, row.total, row.purchasedBy, row.receipt ? "YES" : "NO"]),
    [rows],
  );

  function exportCsv() {
    exportRowsToCsv(
      "finance-expenses.csv",
      ["Date", "Category", "Description", "Qty", "Unit Price", "Total", "Paid By", "Receipt"],
      exportRows,
    );
  }

  return (
    <div className="grid gap-5">
      {err ? <div className="text-sm font-semibold text-red-600">{err}</div> : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <FinanceStatCard
          title="Variable Expenses"
          value={money(summary.totalVariableExpenses)}
          subtitle="Saved backend expenses"
          onClick={() => navigate(`${basePath}/expenses/report`)}
        />
        <FinanceStatCard
          title="Fixed Expenses"
          value={money(summary.totalFixedExpenses)}
          subtitle="Not connected yet"
          onClick={() => navigate(`${basePath}/expenses/overview`)}
        />
        <FinanceStatCard
          title="Gov Obligations"
          value={money(summary.governmentObligations)}
          subtitle="Not connected yet"
          onClick={() => navigate(`${basePath}/expenses/overview`)}
        />
        <FinanceStatCard
          title="Monthly Total"
          value={money(summary.grandTotalMonthlyExpense)}
          subtitle="Current tracked total"
          onClick={() => navigate(`${basePath}/expenses/report`)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <FinanceSectionCard
          title="Expense Report"
          subtitle="Saved expenses from the register form."
          action={
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={load} className={financeSecondaryBtnClass}>
                Refresh
              </button>
              <button type="button" onClick={exportCsv} className={financePrimaryBtnClass}>
                Export CSV
              </button>
            </div>
          }
        >
          <FinanceTableShell
            minWidth={1040}
            loading={loading}
            rowCount={rows.length}
            emptyText="No saved expenses found yet."
            headers={[
              { key: "date", label: "Date", className: "w-[120px]" },
              { key: "category", label: "Category", className: "w-[120px]" },
              { key: "description", label: "Description" },
              { key: "qty", label: "Qty", className: "w-[80px]" },
              { key: "unitPrice", label: "Unit Price", className: "w-[110px]" },
              { key: "total", label: "Total", className: "w-[110px]" },
              { key: "paidBy", label: "Paid By", className: "w-[120px]" },
              { key: "receipt", label: "Receipt", className: "w-[100px]" },
            ]}
            colSpan={8}
          >
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{row.date ? new Date(row.date).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{row.category}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{row.description}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{row.qty}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{Number(row.unitPrice || 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{Number(row.total || 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{row.purchasedBy}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{row.receipt ? "YES" : "NO"}</td>
              </tr>
            ))}
          </FinanceTableShell>

          <div className="mt-5 flex items-center justify-between rounded-2xl border border-zinc-200 bg-bgLight px-5 py-4">
            <div className="text-[15px] font-semibold text-zinc-800">Grand total</div>
            <div className="text-[20px] font-semibold text-primary">{money(summary.totalVariableExpenses)}</div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className={financePrimaryBtnClass}
              onClick={() => navigate(`${basePath}/expenses/register`)}
            >
              + Add Expense
            </button>
            <button type="button" className={financeSecondaryBtnClass} onClick={exportCsv}>
              Export CSV
            </button>
          </div>
        </FinanceSectionCard>

        <FinanceSidePanel title="Tax & Compliance" subtitle="Now backed by real saved expenses.">
          <div className="space-y-4 text-[14px] leading-[1.45] text-zinc-900">
            {reminders.map((item) => (
              <div key={item.title}>
                <div className="font-semibold">{item.title}</div>
                <div className="mt-1 text-zinc-700">{item.body}</div>
              </div>
            ))}
          </div>

          <div className="mt-7 border-t border-zinc-100 pt-5">
            <h4 className="text-[17px] font-semibold text-primary">Insights</h4>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[14px] leading-[1.45] text-zinc-900">
              {insights.map((item, idx) => (
                <li key={`${idx}-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        </FinanceSidePanel>
      </div>
    </div>
  );
}
