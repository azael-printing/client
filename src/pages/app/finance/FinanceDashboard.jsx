import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import FinanceStatCard from "../../../components/common/FinanceStatCard";
import {
  roleActionClass,
  rolePageCardClass,
  roleSubtitleClass,
  roleTableClass,
  roleTableWrapClass,
  roleTdClass,
  roleThClass,
  roleTheadClass,
  roleTitleClass,
} from "../../../components/common/rolePageUi";
import {
  fetchFinanceCollection,
  getAmount,
  money,
  toInvoiceRows,
} from "./financeShared";

function SideAmountCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
      <div className="text-[13px] font-semibold text-zinc-500">{title}</div>
      <div className="mt-2 text-[28px] font-semibold leading-none text-primary">
        {value}
      </div>
      <div className="mt-2 text-sm font-semibold text-zinc-400">{subtitle}</div>
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
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {status || "Unknown"}
    </span>
  );
}

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/finance")
    ? "/app/admin/finance"
    : "/app/finance";
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
      (job) => job.status === "READY_FOR_DELIVERY" || job.status === "DELIVERED",
    );

    const monthRevenue = deliveredLike.reduce((sum, job) => {
      const paid = getAmount(job, ["paid", "paidAmount", "amountPaid"], 0);
      const total = getAmount(job, ["total", "totalAmount", "grandTotal"], 0);
      return sum + (paid || total || 0);
    }, 0);

    const monthExpenses = jobs.reduce((sum, job) => {
      const expense = getAmount(job, ["expense", "expenseTotal", "cost"], 0);
      return sum + expense;
    }, 0);

    const customerCredit = jobs.reduce((sum, job) => {
      const total = getAmount(job, ["total", "totalAmount", "grandTotal"], 0);
      const paid = getAmount(job, ["paid", "paidAmount", "amountPaid"], 0);
      const balance =
        job.balance !== undefined && job.balance !== null
          ? Number(job.balance || 0)
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
  const pagedInvoiceRows = useMemo(
    () =>
      invoiceRows.slice(
        (tablePageSafe - 1) * tablePageSize,
        tablePageSafe * tablePageSize,
      ),
    [invoiceRows, tablePageSafe],
  );

  return (
    <div className="grid gap-5">
      {err ? <div className="text-sm font-semibold text-red-600">{err}</div> : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <FinanceStatCard
          title="Monthly Revenue"
          value={money(summary.monthRevenue)}
          subtitle="Payment received"
          onClick={() => navigate(`${basePath}/revenue/overview`)}
        />
        <FinanceStatCard
          title="Monthly Expenses"
          value={money(summary.monthExpenses)}
          subtitle="Tracked from job costs"
          onClick={() => navigate(`${basePath}/expenses/overview`)}
        />
        <FinanceStatCard
          title="Customer Credit"
          value={money(summary.customerCredit)}
          subtitle="Unpaid balance"
          onClick={() => navigate(`${basePath}/revenue/invoice`)}
        />
        <FinanceStatCard
          title="Monthly Net Income"
          value={money(summary.monthNetIncome)}
          subtitle="Revenue minus cost"
          onClick={() => navigate(`${basePath}/revenue/overview`)}
        />
      </div>

      <div className={rolePageCardClass}>
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className={roleTitleClass}>Invoices & Jobs</h2>
                <p className={roleSubtitleClass}>
                  Finance-only summary with cleaner spacing and tighter table alignment.
                </p>
              </div>
              <button onClick={load} className={roleActionClass("neutral")}>
                Refresh
              </button>
            </div>

            <div className={roleTableWrapClass}>
              <table className={roleTableClass}>
                <thead className={roleTheadClass}>
                  <tr>
                    <th className={`${roleThClass} w-[150px]`}>Invoice</th>
                    <th className={`${roleThClass} w-[120px]`}>JobID</th>
                    <th className={`${roleThClass} w-[210px]`}>Customer</th>
                    <th className={`${roleThClass} w-[140px]`}>Total</th>
                    <th className={`${roleThClass} w-[140px]`}>Paid</th>
                    <th className={`${roleThClass} w-[140px]`}>Balance</th>
                    <th className={roleThClass}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-sm font-semibold text-zinc-500">
                        Loading finance data...
                      </td>
                    </tr>
                  ) : invoiceRows.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-sm font-semibold text-zinc-500">
                        No invoice data found.
                      </td>
                    </tr>
                  ) : (
                    pagedInvoiceRows.map((row) => (
                      <tr key={row.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
                        <td className={roleTdClass}>{row.invoiceNo}</td>
                        <td className={`${roleTdClass} text-primary`}>{row.jobId}</td>
                        <td className={`${roleTdClass} truncate`}>{row.customerName}</td>
                        <td className={roleTdClass}>{Number(row.total || 0).toLocaleString()}</td>
                        <td className={roleTdClass}>{Number(row.paid || 0).toLocaleString()}</td>
                        <td className={roleTdClass}>{Number(row.balance || 0).toLocaleString()}</td>
                        <td className={roleTdClass}>
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={`${basePath}/revenue/overview`} className={roleActionClass("outline")}>
                Revenue Page
              </Link>
              <Link to={`${basePath}/jobs/waiting`} className={roleActionClass("primary")}>
                Waiting Approval
              </Link>
              <Link to={`${basePath}/jobs/done`} className={roleActionClass("outline")}>
                Done Tracking
              </Link>
              <Link to={`${basePath}/expenses/report`} className={roleActionClass("outline")}>
                Expense Report
              </Link>
            </div>
          </div>

          <div className="min-w-0 xl:pt-8">
            <SideAmountCard
              title="Paid This Month"
              value={money(summary.paidThisMonth)}
              subtitle="Cash received"
            />
          </div>
        </div>

        <Pagination page={tablePageSafe} totalPages={tableTotalPages} onChange={setTablePage} />
      </div>
    </div>
  );
}
