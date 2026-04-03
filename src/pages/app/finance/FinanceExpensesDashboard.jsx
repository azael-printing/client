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
import { getExpenseDashboard } from "../../api/finance.api";
import { fetchFinanceCollection, getAmount, money } from "./financeShared";

export default function FinanceExpensesDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/finance")
    ? "/app/admin/finance"
    : "/app/finance";

  const [jobs, setJobs] = useState([]);
  const [expenseRows, setExpenseRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [routeMissing, setRouteMissing] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      setRouteMissing(false);

      const financeRows = await fetchFinanceCollection();
      setJobs(financeRows || []);

      try {
        const data = await getExpenseDashboard();
        setExpenseRows(data?.expenses || []);
      } catch (e) {
        if (e?.response?.status === 404) {
          setRouteMissing(true);
          setExpenseRows([]);
        } else {
          setErr(e?.response?.data?.message || "Failed to load expense dashboard");
          setExpenseRows([]);
        }
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load expense dashboard");
      setJobs([]);
      setExpenseRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const fallbackRows = useMemo(() => {
    return jobs
      .filter((job) => getAmount(job, ["expense", "expenseTotal", "cost"], 0) > 0)
      .slice(0, 12)
      .map((job) => {
        const cost = getAmount(job, ["expense", "expenseTotal", "cost"], 0);
        return {
          id: job.id,
          description: job.description || job.workType || "-",
          qty: Number(job.qty || 1),
          unitPrice: cost,
          total: cost,
          receipt: "-",
          purchasedBy: job.customerName || "-",
          category: job.machine || "-",
        };
      });
  }, [jobs]);

  const rows = useMemo(() => {
    if (expenseRows.length) {
      return expenseRows.map((row) => ({
        id: row.id,
        description: row.description || "-",
        qty: row.qty || 0,
        unitPrice: row.unitPrice || 0,
        total: row.total || 0,
        receipt: row.receipt ? "yes" : "no",
        purchasedBy: row.purchasedBy || row.createdByName || "-",
        category: row.category || row.categoryLabel || "-",
      }));
    }
    return fallbackRows;
  }, [expenseRows, fallbackRows]);

  const summary = useMemo(() => {
    const totalVariableExpenses = rows.reduce(
      (sum, row) => sum + Number(row.total || 0),
      0,
    );
    const totalFixedExpenses = 0;
    const governmentObligations = 0;
    const grandTotalMonthlyExpense =
      totalVariableExpenses + totalFixedExpenses + governmentObligations;

    return {
      totalVariableExpenses,
      totalFixedExpenses,
      governmentObligations,
      grandTotalMonthlyExpense,
    };
  }, [rows]);

  return (
    <div className="grid gap-5">
      {err ? <div className="text-sm font-semibold text-red-600">{err}</div> : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <FinanceStatCard
          title="Variable Expenses"
          value={money(summary.totalVariableExpenses)}
          subtitle={routeMissing ? "fallback from tracked job costs" : "saved backend expenses"}
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <FinanceSectionCard
          title="Expense Report"
          subtitle={routeMissing ? "Backend expense route missing — showing fallback tracked costs instead." : "Saved expenses from the register form."}
          action={
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={load} className={financeSecondaryBtnClass}>
                Refresh
              </button>
              <button
                type="button"
                onClick={() => navigate(`${basePath}/expenses/register`)}
                className={financePrimaryBtnClass}
              >
                + Add Expense
              </button>
            </div>
          }
        >
          {routeMissing ? (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
              The expense API route is still missing on Railway, so this page is using fallback job-cost rows instead of real saved expenses.
            </div>
          ) : null}

          <FinanceTableShell
            minWidth={980}
            loading={loading}
            rowCount={rows.length}
            emptyText="No expense data found yet."
            headers={[
              { key: "description", label: "Description" },
              { key: "qty", label: "Qty", className: "w-[90px]" },
              { key: "unitPrice", label: "Unit Price", className: "w-[120px]" },
              { key: "total", label: "Total (ETB)", className: "w-[140px]" },
              { key: "receipt", label: "Receipt", className: "w-[100px]" },
              { key: "purchasedBy", label: "Purchased By", className: "w-[150px]" },
              { key: "category", label: "Category", className: "w-[140px]" },
            ]}
            colSpan={7}
          >
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-100 transition-colors hover:bg-zinc-50/70">
                <td className="px-5 py-3 font-medium text-zinc-800">{row.description}</td>
                <td className="px-4 py-3 font-medium text-zinc-800">{row.qty}</td>
                <td className="px-4 py-3 font-medium text-zinc-800">{Number(row.unitPrice || 0).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium text-zinc-800">{Number(row.total || 0).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium text-zinc-800">{row.receipt}</td>
                <td className="px-4 py-3 font-medium text-zinc-800">{row.purchasedBy}</td>
                <td className="px-4 py-3 font-medium text-zinc-800">{row.category}</td>
              </tr>
            ))}
          </FinanceTableShell>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-zinc-200 bg-bgLight px-5 py-4">
            <div className="text-[15px] font-semibold text-zinc-800">Grand total</div>
            <div className="text-[20px] font-semibold text-primary">
              {money(summary.totalVariableExpenses)}
            </div>
          </div>
        </FinanceSectionCard>

        <FinanceSidePanel
          title="Tax & Compliance"
          subtitle={routeMissing ? "Backend save route is still missing on Railway." : "Now backed by real saved expenses."}
        >
          <div className="space-y-4 text-[14px] leading-[1.45] text-zinc-900">
            <div>
              <div className="font-semibold">VAT Payment</div>
              <div className="mt-1 text-zinc-700">Due by 30th of the month.</div>
            </div>
            <div>
              <div className="font-semibold">Salary Income Tax</div>
              <div className="mt-1 text-zinc-700">Due within the first 10 days of the next month.</div>
            </div>
            <div>
              <div className="font-semibold">Pension Contribution</div>
              <div className="mt-1 text-zinc-700">Align with salary payment date.</div>
            </div>
          </div>

          <div className="mt-7 border-t border-zinc-100 pt-5">
            <h4 className="text-[18px] font-semibold text-primary">Insights</h4>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[14px] leading-[1.45] text-zinc-900">
              <li>Deploy the finance backend route to stop the 404.</li>
              <li>Run the expense migration so saved rows can load normally.</li>
              <li>Until then, this page can only show fallback job-cost data.</li>
            </ul>
          </div>
        </FinanceSidePanel>
      </div>
    </div>
  );
}
