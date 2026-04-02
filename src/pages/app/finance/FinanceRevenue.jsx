import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listFinanceJobs } from "../../api/finance.api";
import Pagination from "../../../components/common/Pagination";

function money(v) {
  return `ETB ${Number(v || 0).toLocaleString()}`;
}

function StatCard({ title, value, subtitle, onClick }) {
  return (
    <button onClick={onClick} className="text-left bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 w-full">
      <div className="text-zinc-900 font-extrabold text-[16px] leading-tight">
        {title}
      </div>
      <div className="mt-3 text-primary font-extrabold text-[30px] leading-none tracking-tight">
        {value}
      </div>
      <div className="mt-2 text-zinc-500 font-semibold text-sm">{subtitle}</div>
    </button>
  );
}

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

function getAmount(row, keys, fallback = 0) {
  for (const key of keys) {
    const val = row?.[key];
    if (val !== undefined && val !== null && val !== "") {
      return Number(val || 0);
    }
  }
  return fallback;
}

function getPaymentStatus(job) {
  const explicit =
    job?.paymentStatus ||
    job?.financeStatus ||
    job?.invoiceStatus ||
    job?.statusLabel;

  if (explicit) {
    const text = String(explicit).toLowerCase();
    if (text.includes("partial")) return "Partial";
    if (text.includes("credit")) return "Credit";
    if (text.includes("unpaid")) return "Unpaid";
    if (text.includes("paid")) return "Paid";
  }

  const total = getAmount(job, ["total", "totalAmount", "grandTotal"], 0);
  const paid = getAmount(job, ["paid", "paidAmount", "amountPaid"], 0);
  const balance =
    job.balance !== undefined && job.balance !== null
      ? Number(job.balance || 0)
      : Math.max(total - paid, 0);

  if (balance <= 0 && total > 0) return "Paid";
  if (paid > 0 && balance > 0) return "Partial";
  if (balance > 0) return "Unpaid";
  return "Paid";
}

function isOlderThan30Days(dateValue) {
  if (!dateValue) return false;
  const created = new Date(dateValue);
  if (Number.isNaN(created.getTime())) return false;
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const days = diffMs / (1000 * 60 * 60 * 24);
  return days > 30;
}

export default function FinanceRevenue() {
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
      setErr(e?.response?.data?.message || "Failed to load revenue page");
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

  const rows = useMemo(() => {
    return jobs.map((j) => {
      const total = getAmount(j, ["total", "totalAmount", "grandTotal"], 0);
      const paid = getAmount(j, ["paid", "paidAmount", "amountPaid"], 0);
      const balance =
        j.balance !== undefined && j.balance !== null
          ? Number(j.balance || 0)
          : Math.max(total - paid, 0);

      const status = getPaymentStatus(j);

      return {
        id: j.id,
        invoiceNo: j.invoiceNo || j.invoiceNumber || `INV-${j.jobNo || j.id}`,
        jobId: j.jobNo || j.jobId || j.id,
        customerName: j.customerName || "-",
        total,
        paid,
        balance,
        status,
        createdAt: j.createdAt,
      };
    });
  }, [jobs]);

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
              <StatCard
                title="Paid This Month"
                value={money(summary.paidThisMonth)}
                subtitle="payment received"
                onClick={() => navigate("/app/finance/revenue/overview")}
              />
              <StatCard
                title="Unpaid"
                value={money(summary.unpaid)}
                subtitle="Invoiced, not settled"
                onClick={() => navigate("/app/finance/revenue/overview")}
              />
              <StatCard
                title="Overdue"
                value={money(summary.overdue)}
                subtitle="> 30 days"
                onClick={() => navigate("/app/finance/revenue/overview")}
              />
              <StatCard
                title="Credit"
                value={money(summary.credit)}
                subtitle="Credit holdings"
                onClick={() => navigate("/app/finance/revenue/overview")}
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
        </div>
      </div>
    </div>
  );
}
