import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listFinanceJobs } from "../../api/finance.api";
import Pagination from "../../../components/common/Pagination";

function money(v) {
  return `ETB ${Number(v || 0).toLocaleString()}`;
}

function FinanceStatCard({ title, value, subtitle, onClick }) {
  return (
    <button onClick={onClick} className="w-full text-left bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
      <div className="text-zinc-900 font-extrabold text-[16px] leading-tight">
        {title}
      </div>
      <div className="mt-2 text-primary font-extrabold text-[30px] leading-none tracking-tight">
        {value}
      </div>
      <div className="mt-2 text-zinc-500 font-semibold text-sm">{subtitle}</div>
    </button>
  );
}

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

function getAmount(row, keys, fallback = 0) {
  for (const key of keys) {
    const val = row?.[key];
    if (val !== undefined && val !== null && val !== "") {
      return Number(val || 0);
    }
  }
  return fallback;
}

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [tablePage, setTablePage] = useState(1);
  const tablePageSize = 10;

  const viewportRef = useRef(null);
  const contentRef = useRef(null);

  const BASE_WIDTH = 1120;
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);

  async function load() {
    try {
      setErr("");
      setLoading(true);

      const [newReq, waiting, approved, readyForDelivery, delivered] =
        await Promise.all([
          listFinanceJobs("NEW_REQUEST").catch(() => []),
          listFinanceJobs("FINANCE_WAITING_APPROVAL").catch(() => []),
          listFinanceJobs("FINANCE_APPROVED").catch(() => []),
          listFinanceJobs("READY_FOR_DELIVERY").catch(() => []),
          listFinanceJobs("DELIVERED").catch(() => []),
        ]);

      const merged = [
        ...newReq,
        ...waiting,
        ...approved,
        ...readyForDelivery,
        ...delivered,
      ];

      const unique = Array.from(
        new Map(merged.map((item) => [item.id, item])).values(),
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

  useLayoutEffect(() => {
    function updateScale() {
      const viewport = viewportRef.current;
      const content = contentRef.current;
      if (!viewport || !content) return;

      const availableWidth = viewport.clientWidth;
      const nextScale = Math.min(1, availableWidth / BASE_WIDTH);

      setScale(nextScale);
      setScaledHeight(content.scrollHeight * nextScale);
    }

    updateScale();

    const ro = new ResizeObserver(() => {
      updateScale();
    });

    if (viewportRef.current) ro.observe(viewportRef.current);
    if (contentRef.current) ro.observe(contentRef.current);

    window.addEventListener("resize", updateScale);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [jobs, loading, err]);

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

  const invoiceRows = useMemo(() => {
    return jobs.map((j) => {
      const total = getAmount(j, ["total", "totalAmount", "grandTotal"], 0);
      const paid = getAmount(j, ["paid", "paidAmount", "amountPaid"], 0);
      const balance =
        j.balance !== undefined && j.balance !== null
          ? Number(j.balance || 0)
          : Math.max(total - paid, 0);

      return {
        id: j.id,
        invoiceNo: j.invoiceNo || j.invoiceNumber || `INV-${j.jobNo || j.id}`,
        jobId: j.jobNo || j.jobId || j.id,
        customerName: j.customerName || "-",
        total,
        paid,
        balance,
        status: j.paymentStatus || j.status || "-",
      };
    });
  }, [jobs]);

  const tableTotalPages = Math.max(1, Math.ceil(invoiceRows.length / tablePageSize));
  const tablePageSafe = Math.min(tablePage, tableTotalPages);
  const pagedInvoiceRows = useMemo(() => {
    return invoiceRows.slice(
      (tablePageSafe - 1) * tablePageSize,
      tablePageSafe * tablePageSize,
    );
  }, [invoiceRows, tablePageSafe]);

  return (
    <div ref={viewportRef} className="w-full overflow-x-hidden">
      <div
        className="relative"
        style={{ height: scaledHeight ? `${scaledHeight}px` : "auto" }}
      >
        <div
          ref={contentRef}
          className="origin-top-left"
          style={{
            width: `${BASE_WIDTH}px`,
            transform: `scale(${scale})`,
          }}
        >
          <div className="grid gap-5">
            {err && (
              <div className="text-red-600 font-semibold text-sm">{err}</div>
            )}

            <div className="grid grid-cols-4 gap-4">
              <FinanceStatCard
                title="Monthly Revenue"
                value={money(summary.monthRevenue)}
                subtitle="payment received"
              />
              <FinanceStatCard
                title="Monthly Expenses"
                value={money(summary.monthExpenses)}
                subtitle="tracked from job costs"
              />
              <FinanceStatCard
                title="Customer credit"
                value={money(summary.customerCredit)}
                subtitle="unpaid balance"
              />
              <FinanceStatCard
                title="Monthly Net income"
                value={money(summary.monthNetIncome)}
                subtitle="revenue minus cost"
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
        </div>
      </div>
    </div>
  );
}
