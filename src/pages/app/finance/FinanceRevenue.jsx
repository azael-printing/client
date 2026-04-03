import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import FinanceStatCard from "../../../components/common/FinanceStatCard";
import { fetchFinanceCollection, isOlderThan30Days, money, toInvoiceRows } from "./financeShared";

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();

  let cls = "bg-zinc-100 text-zinc-700";
  if (s === "paid" || s === "delivered") cls = "bg-green-100 text-green-700";
  else if (s === "partial") cls = "bg-yellow-100 text-yellow-700";
  else if (s === "credit") cls = "bg-red-100 text-red-700";
  else if (s === "unpaid") cls = "bg-orange-100 text-orange-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>
      {status || "-"}
    </span>
  );
}


export default function FinanceRevenue() {
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
      setErr(e?.response?.data?.message || "Failed to load revenue page");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);



  const rows = useMemo(() => toInvoiceRows(jobs), [jobs]);

  const tableTotalPages = Math.max(1, Math.ceil(rows.length / tablePageSize));
  const tablePageSafe = Math.min(tablePage, tableTotalPages);
  const rowsPage = rows.slice((tablePageSafe - 1) * tablePageSize, tablePageSafe * tablePageSize);

  const summary = useMemo(() => {
    const paidThisMonth = rows
      .filter((r) => r.status === "Paid")
      .reduce((sum, r) => sum + Number(r.paid || r.total || 0), 0);

    const unpaid = rows
      .filter((r) => r.status === "Unpaid" || r.status === "Partial")
      .reduce((sum, r) => sum + Number(r.balance || 0), 0);

    const overdue = rows
      .filter(
        (r) =>
          isOlderThan30Days(r.createdAt) &&
          (r.status === "Unpaid" || r.status === "Partial"),
      )
      .reduce((sum, r) => sum + Number(r.balance || 0), 0);

    const credit = rows
      .filter((r) => r.status === "Credit" || r.balance > 0)
      .reduce((sum, r) => sum + Number(r.balance || 0), 0);

    return {
      paidThisMonth,
      unpaid,
      overdue,
      credit,
    };
  }, [rows]);

  const overdueRows = useMemo(() => {
    return rows.filter(
      (r) =>
        isOlderThan30Days(r.createdAt) &&
        (r.status === "Unpaid" || r.status === "Partial"),
    );
  }, [rows]);

  const unpaidOrPartialRows = useMemo(() => {
    return rows.filter((r) => r.status === "Unpaid" || r.status === "Partial");
  }, [rows]);

  return (
    <div className="grid gap-5">
            {err && (
              <div className="text-red-600 font-semibold text-sm">{err}</div>
            )}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <FinanceStatCard
                title="Paid This Month"
                value={money(summary.paidThisMonth)}
                subtitle="payment received"
                onClick={() => navigate(`${basePath}/revenue/invoice`)}
              />
              <FinanceStatCard
                title="Unpaid"
                value={money(summary.unpaid)}
                subtitle="Invoiced, not settled"
                onClick={() => navigate(`${basePath}/revenue/invoice`)}
              />
              <FinanceStatCard
                title="Overdue"
                value={money(summary.overdue)}
                subtitle="> 30 days"
                onClick={() => navigate(`${basePath}/revenue/overdue`)}
              />
              <FinanceStatCard
                title="Credit"
                value={money(summary.credit)}
                subtitle="Credit holdings"
                onClick={() => navigate(`${basePath}/revenue/invoice`)}
              />
            </div>

            <div className="grid grid-cols-[1fr_320px] gap-6">
              <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                <h2 className="text-primary text-[30px] font-extrabold leading-none">
                  Invoices & jobs
                </h2>
                <p className="mt-1 text-zinc-500 font-semibold text-sm">
                  Finance-only view tab.
                </p>

                <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-900">
                      <tr className="text-left">
                        <th className="px-4 py-3 font-extrabold">Invoices</th>
                        <th className="px-4 py-3 font-extrabold">JobID</th>
                        <th className="px-4 py-3 font-extrabold">Customer</th>
                        <th className="px-4 py-3 font-extrabold">Total</th>
                        <th className="px-4 py-3 font-extrabold">Balance</th>
                        <th className="px-4 py-3 font-extrabold">Status</th>
                      </tr>
                    </thead>

                    <tbody className="bg-white">
                      {loading ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-4 py-6 text-zinc-500 font-semibold"
                          >
                            Loading revenue data...
                          </td>
                        </tr>
                      ) : rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-4 py-6 text-zinc-500 font-semibold"
                          >
                            No revenue data found.
                          </td>
                        </tr>
                      ) : (
                        rowsPage.map((row) => (
                          <tr
                            key={row.id}
                            className="border-t border-zinc-100 hover:bg-zinc-50/70 transition-colors"
                          >
                            <td className="px-4 py-2 font-medium text-zinc-800">
                              {row.invoiceNo}
                            </td>
                            <td className="px-4 py-2 font-medium text-zinc-800">
                              {row.jobId}
                            </td>
                            <td className="px-4 py-2 font-medium text-zinc-800">
                              {row.customerName}
                            </td>
                            <td className="px-4 py-2 font-medium text-zinc-800">
                              {Number(row.total || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 font-medium text-zinc-800">
                              {Number(row.balance || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-2">
                              <StatusBadge status={row.status} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="min-w-[170px] rounded-xl bg-primary px-6 py-3 text-white font-extrabold shadow-sm hover:opacity-95 transition"
                    type="button"
                  >
                    Export to excel
                  </button>
                </div>
                <Pagination page={tablePageSafe} totalPages={tableTotalPages} onChange={setTablePage} />
              </div>

              <div className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                <h3 className="text-primary text-[18px] font-extrabold">
                  Collections Focus
                </h3>
                <p className="mt-1 text-zinc-500 font-semibold text-sm">
                  Top things finance should hit today.
                </p>

                <div className="mt-8 space-y-8 text-[14px] leading-[1.35] text-zinc-900">
                  <div>
                    <div className="font-extrabold">Overdue jobs</div>
                    <div>
                      Call or message customers for invoices older than 30 days.
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate("/app/finance/jobs/done")}
                        className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:opacity-95 transition"
                      >
                        View overdue list
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="font-extrabold">
                      Telegram / Text reminders
                    </div>
                    <div>
                      Send automatic payment reminder templates for Unpaid &
                      Partial.
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate("/app/finance/jobs/waiting")}
                        className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:opacity-95 transition"
                      >
                        view unpaid and partial
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="font-extrabold">Daily close check</div>
                    <div>Match cash / bank slips with logged payments.</div>
                    <div>Check any job marked Delivered but still Unpaid.</div>
                    <div>Export CSV and share with owner if needed.</div>
                  </div>
                </div>

                <div className="hidden">
                  {overdueRows.length}
                  {unpaidOrPartialRows.length}
                </div>
              </div>
            </div>
    </div>
  );
}
