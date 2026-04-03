import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getExpenseDashboard } from "../../api/finance.api";
import {
  fetchFinanceCollection,
  getAmount,
  money,
  toInvoiceRows,
} from "./financeShared";

function TopStatCard({ title, value, subtitle, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="min-h-[120px] rounded-[22px] border border-zinc-200 bg-white px-4 py-3 text-left shadow-[0_10px_22px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_16px_34px_rgba(15,23,42,0.18)]"
    >
      <div className="text-[16px] leading-[1.02] font-semibold text-zinc-900 sm:text-[18px]">
        {title}
      </div>
      <div className="mt-2 text-[28px] leading-none font-semibold tracking-tight text-primary sm:text-[30px]">
        {value}
      </div>
      <div className="mt-2 text-[12px] font-semibold text-zinc-500">{subtitle}</div>
    </Tag>
  );
}

function SideAmountCard({ title, value, subtitle, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="w-full rounded-[20px] border border-zinc-200 bg-white p-4 text-left shadow-[0_10px_22px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_16px_34px_rgba(15,23,42,0.18)]"
    >
      <div className="text-[16px] leading-[1.02] font-semibold text-zinc-900 sm:text-[17px]">
        {title}
      </div>
      <div className="mt-1 text-[28px] leading-none font-semibold tracking-tight text-primary sm:text-[30px]">
        {value}
      </div>
      <div className="mt-1 text-[12px] font-semibold text-zinc-500">{subtitle}</div>
    </Tag>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  let cls = "bg-zinc-100 text-zinc-700";
  if (normalized.includes("paid") || normalized === "delivered") {
    cls = "bg-green-100 text-green-700";
  } else if (normalized.includes("partial") || normalized.includes("waiting")) {
    cls = "bg-yellow-300 text-red-600";
  } else if (normalized.includes("unpaid") || normalized.includes("credit")) {
    cls = "bg-red-100 text-red-700";
  }

  return (
    <span className={`inline-flex min-w-[58px] items-center justify-center rounded-full px-3 py-1 text-[12px] font-semibold leading-none ${cls}`}>
      {status || "Unknown"}
    </span>
  );
}

function SectionShell({ children }) {
  return (
    <section className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.12)] transition-all duration-300 hover:border-primary/10 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] sm:p-6">
      {children}
    </section>
  );
}

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/finance")
    ? "/app/admin/finance"
    : "/app/finance";

  const [jobs, setJobs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [err, setErr] = useState("");
  const [expenseErr, setExpenseErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setErr("");
      setLoading(true);

      const financeRows = await fetchFinanceCollection();
      setJobs(financeRows || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load finance dashboard");
      setJobs([]);
    } finally {
      setLoading(false);
    }

    try {
      setExpenseErr("");
      const expenseData = await getExpenseDashboard();
      setExpenses(expenseData?.expenses || []);
    } catch (e) {
      setExpenseErr(e?.response?.status === 404 ? "Expense backend route is not deployed yet." : e?.response?.data?.message || "Failed to load expense report");
      setExpenses([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(() => {
    const deliveredLike = jobs.filter(
      (j) => j.status === "READY_FOR_DELIVERY" || j.status === "DELIVERED",
    );

    const monthRevenue = deliveredLike.reduce((sum, j) => {
      const paid = getAmount(j, ["paid", "paidAmount", "amountPaid"], 0);
      const total = getAmount(j, ["total", "totalAmount", "grandTotal"], 0);
      return sum + (paid || total || 0);
    }, 0);

    const fallbackJobExpenses = jobs.reduce((sum, j) => {
      const expense = getAmount(j, ["expense", "expenseTotal", "cost"], 0);
      return sum + expense;
    }, 0);

    const monthExpenses = expenses.length
      ? expenses.reduce((sum, item) => sum + Number(item.total || 0), 0)
      : fallbackJobExpenses;

    const customerCredit = jobs.reduce((sum, j) => {
      const total = getAmount(j, ["total", "totalAmount", "grandTotal"], 0);
      const paid = getAmount(j, ["paid", "paidAmount", "amountPaid"], 0);
      const balance =
        j.balance !== undefined && j.balance !== null
          ? Number(j.balance || 0)
          : Math.max(total - paid, 0);

      return sum + balance;
    }, 0);

    const monthNetIncome = monthRevenue - monthExpenses;

    return {
      monthRevenue,
      monthExpenses,
      customerCredit,
      monthNetIncome,
      paidThisMonth: monthRevenue,
      grandTotalMonthlyExpense: monthExpenses,
    };
  }, [jobs, expenses]);

  const invoiceRows = useMemo(() => toInvoiceRows(jobs).slice(0, 6), [jobs]);

  const expenseRows = useMemo(() => {
    if (expenses.length) {
      return expenses.slice(0, 6).map((row) => ({
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

    return jobs
      .filter((job) => getAmount(job, ["expense", "expenseTotal", "cost"], 0) > 0)
      .slice(0, 6)
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
  }, [expenses, jobs]);

  return (
    <div className="grid gap-7">
      {err ? <div className="text-sm font-semibold text-red-600">{err}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TopStatCard
          title="Monthly Revenue"
          value={money(summary.monthRevenue)}
          subtitle="payment received"
          onClick={() => navigate(`${basePath}/revenue/overview`)}
        />
        <TopStatCard
          title="Monthly Expenses"
          value={money(summary.monthExpenses)}
          subtitle="invoiced, not settled"
          onClick={() => navigate(`${basePath}/expenses/overview`)}
        />
        <TopStatCard
          title="Customer credit"
          value={money(summary.customerCredit)}
          subtitle="> 30 days"
          onClick={() => navigate(`${basePath}/revenue/overdue`)}
        />
        <TopStatCard
          title="Monthly Net income"
          value={money(summary.monthNetIncome)}
          subtitle="Credit holdings"
          onClick={() => navigate(`${basePath}/revenue/overview`)}
        />
      </div>

      <SectionShell>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_170px] xl:items-start">
          <div>
            <h2 className="text-[26px] leading-none font-semibold text-primary sm:text-[30px]">
              Invoices & jobs
            </h2>
            <p className="mt-1 text-sm font-semibold text-zinc-500">
              Finance-only view tab.
            </p>

            <div className="mt-5 overflow-auto rounded-2xl bg-white">
              <table className="min-w-[760px] w-full text-[13px] text-zinc-900">
                <thead>
                  <tr className="bg-bgLight text-left">
                    <th className="px-3 py-2 font-semibold">Invoices</th>
                    <th className="px-3 py-2 font-semibold">JobID</th>
                    <th className="px-3 py-2 font-semibold">Customer</th>
                    <th className="px-3 py-2 font-semibold">Total</th>
                    <th className="px-3 py-2 font-semibold">Paid</th>
                    <th className="px-3 py-2 font-semibold">Balance</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-4 text-sm font-semibold text-zinc-500">
                        Loading finance data...
                      </td>
                    </tr>
                  ) : invoiceRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-4 text-sm font-semibold text-zinc-500">
                        No invoice data found.
                      </td>
                    </tr>
                  ) : (
                    invoiceRows.map((row) => (
                      <tr key={row.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/70 transition-colors">
                        <td className="px-3 py-1.5 font-medium">{row.invoiceNo}</td>
                        <td className="px-3 py-1.5 font-medium">{row.jobId}</td>
                        <td className="px-3 py-1.5 font-medium">{row.customerName}</td>
                        <td className="px-3 py-1.5 font-medium">{Number(row.total || 0).toLocaleString()}</td>
                        <td className="px-3 py-1.5 font-medium">{Number(row.paid || 0).toLocaleString()}</td>
                        <td className="px-3 py-1.5 font-medium">{Number(row.balance || 0).toLocaleString()}</td>
                        <td className="px-3 py-1.5"><StatusBadge status={row.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="xl:pt-[52px]">
            <SideAmountCard
              title="Paid This Month"
              value={money(summary.paidThisMonth)}
              subtitle="Cash Received"
              onClick={() => navigate(`${basePath}/revenue/invoice`)}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_190px] xl:items-start">
          <div>
            <h2 className="text-[26px] leading-none font-semibold text-primary sm:text-[30px]">
              Expense report
            </h2>
            <p className="mt-1 text-sm font-semibold text-zinc-500">
              Filter by payer, category or description.
            </p>
            {expenseErr ? <div className="mt-2 text-xs font-semibold text-red-600">{expenseErr}</div> : null}

            <div className="mt-5 overflow-auto rounded-2xl bg-white">
              <table className="min-w-[760px] w-full text-[13px] text-zinc-900">
                <thead>
                  <tr className="bg-bgLight text-left">
                    <th className="px-3 py-2 font-semibold">Description</th>
                    <th className="px-3 py-2 font-semibold">Qty</th>
                    <th className="px-3 py-2 font-semibold">Unit Price</th>
                    <th className="px-3 py-2 font-semibold">Total (ETB)</th>
                    <th className="px-3 py-2 font-semibold">Receipt</th>
                    <th className="px-3 py-2 font-semibold">Purchased By</th>
                    <th className="px-3 py-2 font-semibold">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-4 text-sm font-semibold text-zinc-500">
                        No expense data found yet.
                      </td>
                    </tr>
                  ) : (
                    expenseRows.map((row) => (
                      <tr key={row.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/70 transition-colors">
                        <td className="px-3 py-1.5 font-medium">{row.description}</td>
                        <td className="px-3 py-1.5 font-medium">{row.qty}</td>
                        <td className="px-3 py-1.5 font-medium">{Number(row.unitPrice || 0).toLocaleString()}</td>
                        <td className="px-3 py-1.5 font-medium">{Number(row.total || 0).toLocaleString()}</td>
                        <td className="px-3 py-1.5 font-medium">{row.receipt}</td>
                        <td className="px-3 py-1.5 font-medium">{row.purchasedBy}</td>
                        <td className="px-3 py-1.5 font-medium">{row.category}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="xl:pt-[52px]">
            <SideAmountCard
              title="Grand Total Monthly Expense"
              value={money(summary.grandTotalMonthlyExpense)}
              subtitle="master number"
              onClick={() => navigate(`${basePath}/expenses/overview`)}
            />
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
