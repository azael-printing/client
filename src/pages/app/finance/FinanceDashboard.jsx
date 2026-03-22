// import { Link } from "react-router-dom";
// import NotificationsPanel from "../../../components/app/NotificationsPanel";

// export default function FinanceDashboard() {
//   return (
//     <div className="grid gap-4">
//       <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
//         <h2 className="text-2xl font-extrabold text-primary">
//           Finance Dashboard
//         </h2>
//         <p className="mt-2 text-zinc-700">
//           Review new jobs, set waiting/approve, and track completed jobs sent by
//           CS.
//         </p>

//         <div className="mt-5 flex gap-3 flex-wrap">
//           <Link
//             to="/app/finance-waiting"
//             className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
//           >
//             Waiting Approval
//           </Link>

//           <Link
//             to="/app/finance-done"
//             className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-extrabold hover:bg-bgLight transition"
//           >
//             Done Tracking
//           </Link>
//         </div>
//       </div>

//       <NotificationsPanel />
//     </div>
//   );
// }
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NotificationsPanel from "../../../components/app/NotificationsPanel";
import { getFinanceDashboard } from "../../api/finance.api";

function FinanceStatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
      <div className="text-zinc-900 font-extrabold text-[16px] leading-tight">
        {title}
      </div>
      <div className="mt-2 text-primary font-extrabold text-[30px] leading-none tracking-tight">
        {value}
      </div>
      <div className="mt-2 text-zinc-500 font-semibold text-sm">{subtitle}</div>
    </div>
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
  if (normalized === "paid") cls = "bg-green-100 text-green-700";
  if (normalized === "partial") cls = "bg-yellow-100 text-yellow-700";
  if (normalized === "unpaid") cls = "bg-red-100 text-red-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>
      {status || "Unknown"}
    </span>
  );
}

function money(v) {
  return `ETB ${Number(v || 0).toLocaleString()}`;
}

export default function FinanceDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const viewportRef = useRef(null);
  const contentRef = useRef(null);

  const BASE_WIDTH = 1120;
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const res = await getFinanceDashboard();
      setData(res);
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
  }, [data, loading, err]);

  const summary = data?.summary || {
    monthRevenue: 0,
    monthExpenses: 0,
    customerCredit: 0,
    monthNetIncome: 0,
    paidThisMonth: 0,
  };

  const invoices = Array.isArray(data?.invoices) ? data.invoices : [];

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
                subtitle="Invoiced, not settled"
              />
              <FinanceStatCard
                title="Customer credit"
                value={money(summary.customerCredit)}
                subtitle="> 30 days"
              />
              <FinanceStatCard
                title="Monthly Net income"
                value={money(summary.monthNetIncome)}
                subtitle="Credit holdings"
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
                        ) : invoices.length === 0 ? (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-4 py-6 text-zinc-500 font-semibold"
                            >
                              No invoice data found.
                            </td>
                          </tr>
                        ) : (
                          invoices.map((row, idx) => (
                            <tr
                              key={row.id || row.invoiceNo || idx}
                              className="border-t border-zinc-100 hover:bg-zinc-50/70 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium text-zinc-800">
                                {row.invoiceNo || "-"}
                              </td>
                              <td className="px-4 py-3 font-medium text-zinc-800">
                                {row.jobId || "-"}
                              </td>
                              <td className="px-4 py-3 font-medium text-zinc-800">
                                {row.customerName || "-"}
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
                      to="/app/finance-waiting"
                      className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
                    >
                      Waiting Approval
                    </Link>

                    <Link
                      to="/app/finance-done"
                      className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-extrabold hover:bg-zinc-50 transition"
                    >
                      Done Tracking
                    </Link>

                    <Link
                      to="/app/finance/expenses"
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
              </div>
            </div>

            <NotificationsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
