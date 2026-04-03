import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FinanceSectionCard from "../../../components/common/FinanceSectionCard";
import FinanceSidePanel from "../../../components/common/FinanceSidePanel";
import FinanceStatCard from "../../../components/common/FinanceStatCard";
import FinanceTableShell from "../../../components/common/FinanceTableShell";
import { financePrimaryBtnClass } from "../../../components/common/financeUi";
import { fetchFinanceCollection, money, toExpenseRows } from "./financeShared";

export default function FinanceExpensesDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/finance") ? "/app/admin/finance" : "/app/finance";
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);


  async function load() {
    try {
      setErr("");
      setLoading(true);
      const unique = await fetchFinanceCollection();
      setJobs(unique);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load expense dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);



  const expenseRows = useMemo(() => toExpenseRows(jobs), [jobs]);

  const summary = useMemo(() => {
    const totalVariableExpenses = expenseRows.reduce((sum, row) => sum + Number(row.total || 0), 0);
    const totalFixedExpenses = 0;
    const governmentObligations = 0;
    const grandTotalMonthlyExpense = totalVariableExpenses + totalFixedExpenses + governmentObligations;
    return { totalVariableExpenses, totalFixedExpenses, governmentObligations, grandTotalMonthlyExpense };
  }, [expenseRows]);

  return (
    <div className="grid gap-5">
            {err && <div className="text-red-600 font-semibold text-sm">{err}</div>}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <FinanceStatCard title="Total Variable Expenses" value={money(summary.totalVariableExpenses)} subtitle="from recorded job costs" onClick={() => navigate(`${basePath}/expenses/report`)} />
              <FinanceStatCard title="Total Fixed Expenses" value={money(summary.totalFixedExpenses)} subtitle="not connected yet" onClick={() => navigate(`${basePath}/expenses/overview`)} />
              <FinanceStatCard title="Government Obligations" value={money(summary.governmentObligations)} subtitle="not connected yet" onClick={() => navigate(`${basePath}/expenses/overview`)} />
              <FinanceStatCard title="Grand Total Monthly Expense" value={money(summary.grandTotalMonthlyExpense)} subtitle="current tracked total" onClick={() => navigate(`${basePath}/expenses/report`)} />
            </div>

            <div className="grid grid-cols-[1fr_320px] gap-6">
              <FinanceSectionCard title="Expense report" subtitle="Filter by payer, category or description.">
                <FinanceTableShell
                  minWidth={860}
                  loading={loading}
                  rowCount={expenseRows.length}
                  emptyText="No tracked expense data found from backend rows."
                  headers={[
                    { key: "description", label: "Description" },
                    { key: "qty", label: "Qty", className: "w-[90px]" },
                    { key: "total", label: "Total (ETB)", className: "w-[120px]" },
                    { key: "buyer", label: "Purchased By", className: "w-[140px]" },
                    { key: "category", label: "Category", className: "w-[140px]" },
                  ]}
                  colSpan={5}
                >
                  {expenseRows.map((row) => (
                    <tr key={row.id} className="border-t border-zinc-100 hover:bg-zinc-50/70 transition-colors">
                      <td className="px-5 py-3 font-medium text-zinc-800">{row.description}</td>
                      <td className="px-4 py-3 font-medium text-zinc-800">{row.qty}</td>
                      <td className="px-4 py-3 font-medium text-zinc-800">{Number(row.total || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-zinc-800">{row.purchasedBy}</td>
                      <td className="px-4 py-3 font-medium text-zinc-800">{row.category}</td>
                    </tr>
                  ))}
                </FinanceTableShell>

                <div className="mt-6 flex items-center justify-between rounded-full bg-zinc-100 px-5 py-4">
                  <div className="text-primary font-extrabold text-[18px]">Grand total (filtered)</div>
                  <div className="text-primary font-extrabold text-[20px]">{money(summary.totalVariableExpenses)}</div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button type="button" className={financePrimaryBtnClass} onClick={() => navigate(`${basePath}/expenses/register`)}>+Add Expense</button>
                  <button type="button" className={financePrimaryBtnClass}>Export to excel</button>
                </div>
              </FinanceSectionCard>

              <FinanceSidePanel title="Tax & Compliance Reminders" subtitle="Keep monthly finance work from slipping.">
                <div className="space-y-3 text-[14px] leading-[1.45] text-zinc-900">
                  <div><div className="font-extrabold">VAT Payment</div><div>Due by 30th of the month.</div></div>
                  <div><div className="font-extrabold">Salary Income Tax</div><div>Due within first 10 days of next month.</div></div>
                  <div><div className="font-extrabold">Pension Contribution</div><div>Align with salary payment date.</div></div>
                  <div><div className="font-extrabold">Check</div><div>All tax payments should have receipts attached in the finance records.</div></div>
                </div>
                <div className="mt-7 border-t border-zinc-100 pt-5">
                  <h4 className="text-[18px] font-extrabold text-primary">Insights</h4>
                  <ul className="mt-4 list-disc pl-5 space-y-2 text-[14px] leading-[1.45] text-zinc-900">
                    <li>Track costs on every job record consistently.</li>
                    <li>Move fixed monthly expenses into a dedicated backend table.</li>
                    <li>Add tax, pension, and utility records to get a true monthly expense total.</li>
                  </ul>
                </div>
              </FinanceSidePanel>
            </div>
    </div>
  );
}
