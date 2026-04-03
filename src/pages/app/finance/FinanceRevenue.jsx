import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import FinanceSectionCard from "../../../components/common/FinanceSectionCard";
import FinanceSidePanel from "../../../components/common/FinanceSidePanel";
import FinanceStatCard from "../../../components/common/FinanceStatCard";
import FinanceTableShell from "../../../components/common/FinanceTableShell";
import {
  financePrimaryBtnClass,
  financeSecondaryBtnClass,
} from "../../../components/common/financeUi";
import { exportRowsToCsv } from "../../../utils/exportCsv";
import { fetchFinanceCollection, isOlderThan30Days, money, toInvoiceRows } from "./financeShared";

function StatusBadge({ status }) {
  const value = String(status || "").toLowerCase();
  let cls = "bg-zinc-100 text-zinc-700";

  if (value === "paid" || value === "delivered") cls = "bg-green-100 text-green-700";
  else if (value === "partial") cls = "bg-yellow-100 text-yellow-700";
  else if (value === "credit") cls = "bg-red-100 text-red-700";
  else if (value === "unpaid") cls = "bg-orange-100 text-orange-700";

  return (
    <span className={`inline-flex min-w-[84px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {status || "-"}
    </span>
  );
}

export default function FinanceRevenue() {
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
      setErr(e?.response?.data?.message || "Failed to load revenue page");
      setJobs([]);
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
      .filter((row) => row.paymentLabel === "Paid")
      .reduce((sum, row) => sum + Number(row.paid || row.total || 0), 0);

    const unpaid = rows
      .filter((row) => row.paymentLabel === "Unpaid" || row.paymentLabel === "Partial")
      .reduce((sum, row) => sum + Number(row.balance || 0), 0);

    const overdue = rows
      .filter(
        (row) => isOlderThan30Days(row.createdAt) && ["Unpaid", "Partial"].includes(row.paymentLabel),
      )
      .reduce((sum, row) => sum + Number(row.balance || 0), 0);

    const credit = rows
      .filter((row) => row.paymentLabel === "Credit" || Number(row.balance || 0) > 0)
      .reduce((sum, row) => sum + Number(row.balance || 0), 0);

    return { paidThisMonth, unpaid, overdue, credit };
  }, [rows]);

  function exportCsv() {
    exportRowsToCsv(
      "finance-revenue.csv",
      ["Invoice", "JobID", "Customer", "Total", "Paid", "Balance", "Status", "Created"],
      rows.map((row) => [
        row.invoiceNo,
        row.displayJobId,
        row.customerName || "-",
        row.total || 0,
        row.paid || 0,
        row.balance || 0,
        row.paymentLabel || "-",
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
      ]),
    );
  }

  return (
    <div className="grid gap-5">
      {err ? <div className="text-sm font-semibold text-red-600">{err}</div> : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <FinanceStatCard
          title="Paid This Month"
          value={money(summary.paidThisMonth)}
          subtitle="Payment received"
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
          subtitle="Outstanding holdings"
          onClick={() => navigate(`${basePath}/revenue/invoice`)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <FinanceSectionCard
          title="Invoices & Jobs"
          subtitle="Cleaner revenue tracking with working export controls."
          action={
            <div className="flex flex-wrap gap-3">
              <button onClick={load} className={financeSecondaryBtnClass}>
                Refresh
              </button>
              <button onClick={exportCsv} className={financePrimaryBtnClass}>
                Export CSV
              </button>
            </div>
          }
        >
          <FinanceTableShell
            minWidth={940}
            loading={loading}
            rowCount={rowsPage.length}
            emptyText="No revenue data found."
            headers={[
              { key: "invoice", label: "Invoice", className: "w-[140px]" },
              { key: "job", label: "JobID", className: "w-[108px]" },
              { key: "customer", label: "Customer" },
              { key: "total", label: "Total", className: "w-[112px]" },
              { key: "balance", label: "Balance", className: "w-[112px]" },
              { key: "status", label: "Status", className: "w-[108px]" },
            ]}
            colSpan={6}
          >
            {rowsPage.map((row) => (
              <tr key={row.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{row.invoiceNo}</td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">{row.displayJobId}</td>
                <td className="truncate px-4 py-3 text-sm font-semibold text-zinc-800">{row.customerName}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{Number(row.total || 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-800">{Number(row.balance || 0).toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={row.paymentLabel} /></td>
              </tr>
            ))}
          </FinanceTableShell>

          <Pagination page={tablePageSafe} totalPages={tableTotalPages} onChange={setTablePage} />
        </FinanceSectionCard>

        <FinanceSidePanel title="Collections Focus" subtitle="Top things finance should hit today.">
          <div className="space-y-6 text-[14px] leading-[1.45] text-zinc-900">
            <div>
              <div className="font-semibold">Overdue jobs</div>
              <div className="mt-1 text-zinc-700">
                Call or message invoices older than 30 days first. Big balance first, excuses later.
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => navigate(`${basePath}/revenue/overdue`)}
                  className={financePrimaryBtnClass}
                >
                  View overdue list
                </button>
              </div>
            </div>

            <div>
              <div className="font-semibold">Reminder follow-up</div>
              <div className="mt-1 text-zinc-700">
                Use Telegram or text reminders for unpaid and partial jobs, and ask for transfer proof.
              </div>
            </div>

            <div>
              <div className="font-semibold">Unpaid & partial queue</div>
              <div className="mt-1 text-zinc-700">
                Review invoice details and confirm every balance before the owner sees the report.
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => navigate(`${basePath}/revenue/invoice`)}
                  className={financeSecondaryBtnClass}
                >
                  Open invoice list
                </button>
              </div>
            </div>
          </div>
        </FinanceSidePanel>
      </div>
    </div>
  );
}
