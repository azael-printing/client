import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { formatJobId } from "../../../utils/jobFormatting";
import { listFinanceJobs } from "../../api/finance.api";

function money(v) {
  return `ETB ${Number(v || 0).toLocaleString()}`;
}

function isOlderThan30Days(dateValue) {
  if (!dateValue) return false;
  const created = new Date(dateValue);
  if (Number.isNaN(created.getTime())) return false;
  return (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24) > 30;
}

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
      const jobs = await listFinanceJobs();
      const normalized = (jobs || []).map((j) => {
        const total = Number(j.total || j.totalAmount || j.grandTotal || 0);
        const paid = Number(j.paid || j.paidAmount || j.amountPaid || 0);
        const balance = j.balance !== undefined && j.balance !== null ? Number(j.balance || 0) : Math.max(total - paid, 0);
        return {
          ...j,
          displayJobId: formatJobId(j.jobNo || j.jobId || j.id),
          invoiceNo: j.invoiceNo || j.invoiceNumber || `INV-${j.jobNo || j.id}`,
          total,
          paid,
          balance,
        };
      }).filter((j) => balanceFilter(j) && isOlderThan30Days(j.createdAt));
      setRows(normalized);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load overdue list");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  function balanceFilter(j) {
    return Number(j.balance || 0) > 0;
  }

  useEffect(() => { load(); }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);
  const overdueTotal = rows.reduce((sum, row) => sum + Number(row.balance || 0), 0);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-primary text-[30px] font-extrabold leading-none">Overdue invoices</h2>
            <p className="mt-1 text-zinc-500 font-semibold text-sm">Invoices older than 30 days with unpaid balance.</p>
          </div>
          <button onClick={load} className="min-w-[122px] rounded-xl bg-primary px-5 py-3 text-white font-extrabold shadow-sm hover:opacity-95 transition">Refresh</button>
        </div>
        {err && <div className="mt-4 text-red-600 font-semibold text-sm">{err}</div>}
        <div className="mt-6 overflow-auto rounded-2xl border border-zinc-100">
          <table className="min-w-[860px] w-full table-fixed text-sm">
            <thead className="bg-zinc-50 text-zinc-900">
              <tr className="text-left">
                <th className="w-[130px] px-4 py-3 font-extrabold whitespace-nowrap">Invoice</th>
                <th className="w-[90px] px-4 py-3 font-extrabold whitespace-nowrap">JobID</th>
                <th className="px-4 py-3 font-extrabold whitespace-nowrap">Customer</th>
                <th className="w-[84px] px-4 py-3 font-extrabold whitespace-nowrap">Total</th>
                <th className="w-[84px] px-4 py-3 font-extrabold whitespace-nowrap">Balance</th>
                <th className="w-[120px] px-4 py-3 font-extrabold whitespace-nowrap">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="px-4 py-6 text-zinc-500 font-semibold">Loading overdue invoices...</td></tr>
              ) : slice.length === 0 ? (
                <tr><td colSpan="6" className="px-4 py-6 text-zinc-500 font-semibold">No overdue invoices found.</td></tr>
              ) : (
                slice.map((row) => (
                  <tr key={row.id} className="border-t border-zinc-100 hover:bg-zinc-50/70 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-800 whitespace-nowrap">{row.invoiceNo}</td>
                    <td className="px-4 py-3 font-medium text-zinc-800 whitespace-nowrap">{row.displayJobId}</td>
                    <td className="px-4 py-3 font-medium text-zinc-800 truncate">{row.customerName || "-"}</td>
                    <td className="px-4 py-3 font-medium text-zinc-800 whitespace-nowrap">{Number(row.total || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-red-600 whitespace-nowrap">{Number(row.balance || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-zinc-800 whitespace-nowrap">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>

      <aside className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-sm lg:sticky lg:top-4 self-start">
        <h3 className="text-primary text-[18px] font-extrabold">Collections Focus</h3>
        <p className="mt-1 text-zinc-500 font-semibold text-sm">What finance should hit first.</p>
        <div className="mt-6 space-y-6 text-[14px] leading-[1.4] text-zinc-900">
          <div>
            <div className="font-extrabold">Overdue balance</div>
            <div className="mt-1 text-primary text-[28px] font-extrabold">{money(overdueTotal)}</div>
          </div>
          <div>
            <div className="font-extrabold">Call list</div>
            <div>Start with the biggest balance first. Clear Partial and Unpaid before chasing smaller cash jobs.</div>
          </div>
          <div>
            <div className="font-extrabold">Reminder message</div>
            <div>Send bank details, ask for receipt confirmation, and match transfer slips before marking anything paid.</div>
          </div>
          <div>
            <div className="font-extrabold">Close check</div>
            <div>Anything delivered but still unpaid needs a same-day follow-up.</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
