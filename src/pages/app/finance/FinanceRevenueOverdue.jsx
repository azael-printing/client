import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import FinanceSectionCard from "../../../components/common/FinanceSectionCard";
import FinanceSidePanel from "../../../components/common/FinanceSidePanel";
import FinanceTableShell from "../../../components/common/FinanceTableShell";
import {
  financePrimaryBtnClass,
  financeSecondaryBtnClass,
} from "../../../components/common/financeUi";
import { exportRowsToCsv } from "../../../utils/exportCsv";
import { fetchFinanceCollection, isOlderThan30Days, money, toInvoiceRows } from "./financeShared";

export default function FinanceRevenueOverdue() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const jobs = await fetchFinanceCollection();
      const normalized = toInvoiceRows(jobs).filter(
        (row) => Number(row.balance || 0) > 0 && isOlderThan30Days(row.createdAt),
      );
      setRows(normalized);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load overdue list");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);
  const overdueTotal = rows.reduce((sum, row) => sum + Number(row.balance || 0), 0);

  function exportCsv() {
    exportRowsToCsv(
      "finance-overdue.csv",
      ["Invoice", "JobID", "Customer", "Total", "Balance", "Created"],
      rows.map((row) => [
        row.invoiceNo,
        row.displayJobId,
        row.customerName || "-",
        row.total || 0,
        row.balance || 0,
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
      ]),
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <FinanceSectionCard
        title="Overdue Invoices"
        subtitle="Invoices older than 30 days with unpaid balance."
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
        {err ? <div className="mt-4 text-sm font-semibold text-red-600">{err}</div> : null}

        <FinanceTableShell
          minWidth={860}
          loading={loading}
          rowCount={pageRows.length}
          emptyText="No overdue invoices found."
          headers={[
            { key: "invoice", label: "Invoice", className: "w-[130px]" },
            { key: "job", label: "JobID", className: "w-[96px]" },
            { key: "customer", label: "Customer" },
            { key: "total", label: "Total", className: "w-[92px]" },
            { key: "balance", label: "Balance", className: "w-[92px]" },
            { key: "created", label: "Created", className: "w-[120px]" },
          ]}
          colSpan={6}
        >
          {pageRows.map((row) => (
            <tr key={row.id} className="border-t border-zinc-200 transition-colors hover:bg-zinc-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-zinc-800">{row.invoiceNo}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-primary">{row.displayJobId}</td>
              <td className="truncate px-4 py-3 text-sm font-semibold text-zinc-800">{row.customerName || "-"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-zinc-800">{Number(row.total || 0).toLocaleString()}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-red-600">{Number(row.balance || 0).toLocaleString()}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-zinc-800">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</td>
            </tr>
          ))}
        </FinanceTableShell>

        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </FinanceSectionCard>

      <FinanceSidePanel title="Collections Focus" subtitle="Hit the oldest money first.">
        <div className="space-y-6 text-[14px] leading-[1.45] text-zinc-900">
          <div>
            <div className="font-semibold text-zinc-900">Overdue balance</div>
            <div className="mt-1 text-[28px] font-semibold text-primary">{money(overdueTotal)}</div>
          </div>
          <div>
            <div className="font-semibold text-zinc-900">Big balance first</div>
            <div className="mt-1 text-zinc-700">Call or message the largest overdue balances before you waste time on tiny accounts.</div>
          </div>
          <div>
            <div className="font-semibold text-zinc-900">Reminder proof</div>
            <div className="mt-1 text-zinc-700">Ask for transfer receipts immediately and match them against the invoice log the same day.</div>
          </div>
        </div>
      </FinanceSidePanel>
    </div>
  );
}
