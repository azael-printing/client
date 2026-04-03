import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import FinanceStatCard from "../../../components/common/FinanceStatCard";
import { fetchFinanceCollection, getAmount, money, toInvoiceRows } from "./financeShared";

function SideAmountCard({ title, value, subtitle }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
      <div className="text-zinc-900 font-extrabold text-[16px] leading-tight">
        {title}
      </div>
      <div className="mt-1 text-primary font-extrabold text-[30px] leading-none tracking-tight">
        {value}
      </div>
      <div className="mt-1 text-zinc-500 font-semibold text-sm">{subtitle}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  let cls = "bg-zinc-100 text-zinc-700";
  if (normalized.includes("paid") || normalized === "delivered") {
    cls = "bg-green-100 text-green-700";
  } else if (normalized.includes("waiting") || normalized.includes("partial")) {
    cls = "bg-yellow-100 text-yellow-700";
  } else if (normalized.includes("new") || normalized.includes("unpaid")) {
    cls = "bg-red-100 text-red-700";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>
      {status || "Unknown"}
    </span>
  );
}


export default function FinanceDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/finance") ? "/app/admin/finance" : "/app/finance";
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [tablePage, setTablePage] = useState(1);
  const tablePageSize = 10;


  async function load() {
    try {
      setErr("");
      setLoading(true);

      const unique = await fetchFinanceCollection();
      setJobs(unique);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load finance dashboard");
    } finally {
      setLoading(false);
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

    const monthExpenses = jobs.reduce((sum, j) => {
      const expense = getAmount(j, ["expense", "expenseTotal", "cost"], 0);
      return sum + expense;
    }, 0);

    const customerCredit = jobs.reduce((sum, j) => {
      const total = getAmount(j, ["total", "totalAmount", "grandTotal"], 0);
      const paid = getAmount(j, ["paid", "paidAmount", "amountPaid"], 0);
      const balance =
        j.balance !== undefined && j.balance !== null
          ? Number(j.balance || 0)
          : Math.max(total - paid, 0);

      return sum + balance;
    }, 0);

    const paidThisMonth = monthRevenue;
    const monthNetIncome = monthRevenue - monthExpenses;

    return {
      monthRevenue,
      monthExpenses,
      customerCredit,
      monthNetIncome,
      paidThisMonth,
    };
  }, [jobs]);

  const invoiceRows = useMemo(() => toInvoiceRows(jobs), [jobs]);

  const tableTotalPages = Math.max(1, Math.ceil(invoiceRows.length / tablePageSize));
  const tablePageSafe = Math.min(tablePage, tableTotalPages);
  const pagedInvoiceRows = useMemo(() => {
    return invoiceRows.slice(
      (tablePageSafe - 1) * tablePageSize,
      tablePageSafe * tablePageSize,
    );
  }, [invoiceRows, tablePageSafe]);

  return (
    <div className="grid gap-5">
            {err && (
              <div className="text-red-600 font-semibold text-sm">{err}</div>
            )}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <FinanceStatCard
                title="Monthly Revenue"
                value={money(summary.monthRevenue)}
                subtitle="payment received"
                onClick={() => navigate(`${basePath}/revenue/overview`)}
              />
              <FinanceStatCard
                title="Monthly Expenses"
                value={money(summary.monthExpenses)}
                subtitle="tracked from job costs"
                onClick={() => navigate(`${basePath}/expenses/overview`)}
              />
              <FinanceStatCard
                title="Customer credit"
                value={money(summary.customerCredit)}
                subtitle="unpaid balance"
                onClick={() => navigate(`${basePath}/revenue/invoice`)}
              />
              <FinanceStatCard
                title="Monthly Net income"
                value={money(summary.monthNetIncome)}
                subtitle="revenue minus cost"
                onClick={() => navigate(`${basePath}/revenue/overview`)}
              />
            </div>

            <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
              <div className="grid grid-cols-[1fr_230px] gap-6 items-start">
                <div>
                  <h2 className="text-primary text-[28px] font-extrabold leading-none">
                    Invoices & jobs
                  </h2>
                  <p className="mt-1 text-zinc-500 font-semibold text-sm">
                    Finance-only view tab.
                  </p>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-100">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-50 text-zinc-900">
                        <tr className="text-left">
                          <th className="px-4 py-3 font-extrabold">Invoices</th>
                          <th className="px-4 py-3 font-extrabold">JobID</th>
                          <th className="px-4 py-3 font-extrabold">Customer</th>
                          <th className="px-4 py-3 font-extrabold">Total</th>
                          <th className="px-4 py-3 font-extrabold">Paid</th>
                          <th className="px-4 py-3 font-extrabold">Balance</th>
                          <th className="px-4 py-3 font-extrabold">Status</th>
                        </tr>
                      </thead>

                      <tbody className="bg-white">
                        {loading ? (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-4 py-6 text-zinc-500 font-semibold"
                            >
                              Loading finance data...
                            </td>
                          </tr>
                        ) : invoiceRows.length === 0 ? (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-4 py-6 text-zinc-500 font-semibold"
                            >
                              No invoice data found.
                            </td>
                          </tr>
                        ) : (
                          pagedInvoiceRows.map((row) => (
                            <tr
                              key={row.id}
                              className="border-t border-zinc-100 hover:bg-zinc-50/70 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium text-zinc-800">
                                {row.invoiceNo}
                              </td>
                              <td className="px-4 py-3 font-medium text-zinc-800">
                                {row.jobId}
                              </td>
                              <td className="px-4 py-3 font-medium text-zinc-800">
                                {row.customerName}
                              </td>
                              <td className="px-4 py-3 font-medium text-zinc-800">
                                {Number(row.total || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 font-medium text-zinc-800">
                                {Number(row.paid || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 font-medium text-zinc-800">
                                {Number(row.balance || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                <StatusBadge status={row.status} />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      to="/app/finance/revenue/overview"
                      className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-extrabold hover:bg-zinc-50 transition"
                    >
                      Revenue Page
                    </Link>

                    <Link
                      to="/app/finance/jobs/waiting"
                      className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
                    >
                      Waiting Approval
                    </Link>

                    <Link
                      to="/app/finance/jobs/done"
                      className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-extrabold hover:bg-zinc-50 transition"
                    >
                      Done Tracking
                    </Link>

                    <Link
                      to="/app/finance/expenses/report"
                      className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-extrabold hover:bg-zinc-50 transition"
                    >
                      Expense Report
                    </Link>
                  </div>
                </div>

                <div className="pt-[52px]">
                  <SideAmountCard
                    title="Paid This Month"
                    value={money(summary.paidThisMonth)}
                    subtitle="Cash Received"
                  />
                </div>
                <Pagination page={tablePageSafe} totalPages={tableTotalPages} onChange={setTablePage} />
              </div>
            </div>
    </div>
  );
}
