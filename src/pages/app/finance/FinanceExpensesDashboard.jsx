// import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { getExpenseDashboard } from "../../api/finance.api";

// function money(v) {
//   return `ETB ${Number(v || 0).toLocaleString()}`;
// }

// function StatCard({ title, value, subtitle }) {
//   return (
//     <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
//       <div className="text-zinc-900 font-extrabold text-[16px] leading-tight">
//         {title}
//       </div>
//       <div className="mt-2 text-primary font-extrabold text-[30px] leading-none tracking-tight">
//         {value}
//       </div>
//       <div className="mt-2 text-zinc-500 font-semibold text-sm">{subtitle}</div>
//     </div>
//   );
// }

// export default function FinanceExpensesDashboard() {
//   const [data, setData] = useState(null);
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(true);

//   const viewportRef = useRef(null);
//   const contentRef = useRef(null);

//   const BASE_WIDTH = 1280;
//   const [scale, setScale] = useState(1);
//   const [scaledHeight, setScaledHeight] = useState(0);

//   async function load() {
//     try {
//       setErr("");
//       setLoading(true);
//       const res = await getExpenseDashboard();
//       setData(res);
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Failed to load expense dashboard");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   useLayoutEffect(() => {
//     function updateScale() {
//       const viewport = viewportRef.current;
//       const content = contentRef.current;
//       if (!viewport || !content) return;

//       const availableWidth = viewport.clientWidth;
//       const nextScale = Math.min(1, availableWidth / BASE_WIDTH);

//       setScale(nextScale);
//       setScaledHeight(content.scrollHeight * nextScale);
//     }

//     updateScale();

//     const ro = new ResizeObserver(() => {
//       updateScale();
//     });

//     if (viewportRef.current) ro.observe(viewportRef.current);
//     if (contentRef.current) ro.observe(contentRef.current);

//     window.addEventListener("resize", updateScale);

//     return () => {
//       ro.disconnect();
//       window.removeEventListener("resize", updateScale);
//     };
//   }, [data, loading, err]);

//   const summary = data?.summary || {
//     totalVariableExpenses: 0,
//     totalFixedExpenses: 0,
//     governmentObligations: 0,
//     grandTotalMonthlyExpense: 0,
//   };

//   const expenses = Array.isArray(data?.expenses) ? data.expenses : [];
//   const reminders = Array.isArray(data?.reminders) ? data.reminders : [];
//   const insights = Array.isArray(data?.insights) ? data.insights : [];

//   const filteredGrandTotal = expenses.reduce(
//     (sum, row) => sum + Number(row.total || 0),
//     0,
//   );

//   return (
//     <div ref={viewportRef} className="w-full overflow-x-hidden">
//       <div
//         className="relative"
//         style={{ height: scaledHeight ? `${scaledHeight}px` : "auto" }}
//       >
//         <div
//           ref={contentRef}
//           className="origin-top-left"
//           style={{
//             width: `${BASE_WIDTH}px`,
//             transform: `scale(${scale})`,
//           }}
//         >
//           <div className="grid gap-5">
//             {err && (
//               <div className="text-red-600 font-semibold text-sm">{err}</div>
//             )}

//             <div className="grid grid-cols-4 gap-4">
//               <StatCard
//                 title="Total Variable Expenses"
//                 value={money(summary.totalVariableExpenses)}
//                 subtitle="payment received"
//               />
//               <StatCard
//                 title="Total Fixed Expenses"
//                 value={money(summary.totalFixedExpenses)}
//                 subtitle="Invoiced, not settled"
//               />
//               <StatCard
//                 title="Government Obligations"
//                 value={money(summary.governmentObligations)}
//                 subtitle="> 30 days"
//               />
//               <StatCard
//                 title="Grand Total Monthly Expense"
//                 value={money(summary.grandTotalMonthlyExpense)}
//                 subtitle="Credit holdings"
//               />
//             </div>

//             <div className="grid grid-cols-[1fr_320px] gap-6">
//               <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
//                 <h2 className="text-primary text-[30px] font-extrabold leading-none">
//                   Expense report
//                 </h2>
//                 <p className="mt-1 text-zinc-500 font-semibold text-sm">
//                   Filter by payer, category or description.
//                 </p>

//                 <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100">
//                   <table className="w-full text-sm">
//                     <thead className="bg-zinc-50 text-zinc-900">
//                       <tr className="text-left">
//                         <th className="px-5 py-3 font-extrabold">
//                           Description
//                         </th>
//                         <th className="px-4 py-3 font-extrabold">Qty</th>
//                         <th className="px-4 py-3 font-extrabold">
//                           Total (ETB)
//                         </th>
//                         <th className="px-4 py-3 font-extrabold">
//                           Purchased By
//                         </th>
//                         <th className="px-4 py-3 font-extrabold">Category</th>
//                       </tr>
//                     </thead>

//                     <tbody className="bg-white">
//                       {loading ? (
//                         <tr>
//                           <td
//                             colSpan="5"
//                             className="px-5 py-6 text-zinc-500 font-semibold"
//                           >
//                             Loading expense data...
//                           </td>
//                         </tr>
//                       ) : expenses.length === 0 ? (
//                         <tr>
//                           <td
//                             colSpan="5"
//                             className="px-5 py-6 text-zinc-500 font-semibold"
//                           >
//                             No expense data found.
//                           </td>
//                         </tr>
//                       ) : (
//                         expenses.map((row, idx) => (
//                           <tr
//                             key={row.id || idx}
//                             className="border-t border-zinc-100 hover:bg-zinc-50/70 transition-colors"
//                           >
//                             <td className="px-5 py-3 font-medium text-zinc-800">
//                               {row.description || "-"}
//                             </td>
//                             <td className="px-4 py-3 font-medium text-zinc-800">
//                               {row.qty ?? "-"}
//                             </td>
//                             <td className="px-4 py-3 font-medium text-zinc-800">
//                               {Number(row.total || 0).toLocaleString()}
//                             </td>
//                             <td className="px-4 py-3 font-medium text-zinc-800">
//                               {row.purchasedBy || "-"}
//                             </td>
//                             <td className="px-4 py-3 font-medium text-zinc-800">
//                               {row.category || "-"}
//                             </td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="mt-6 flex items-center justify-between rounded-full bg-zinc-100 px-5 py-4">
//                   <div className="text-primary font-extrabold text-[18px]">
//                     Grand total (filtered)
//                   </div>
//                   <div className="text-primary font-extrabold text-[20px]">
//                     {money(filteredGrandTotal)}
//                   </div>
//                 </div>

//                 <div className="mt-8 flex gap-4">
//                   <button className="min-w-[190px] rounded-xl bg-primary px-6 py-3 text-white font-extrabold shadow-sm hover:opacity-95 transition">
//                     +Add Expense
//                   </button>

//                   <button className="min-w-[190px] rounded-xl bg-primary px-6 py-3 text-white font-extrabold shadow-sm hover:opacity-95 transition">
//                     Export to excel
//                   </button>
//                 </div>
//               </div>

//               <div className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
//                 <h3 className="text-primary text-[18px] font-extrabold">
//                   Tax & Compliance Reminders
//                 </h3>

//                 <div className="mt-4 space-y-3 text-[15px] leading-[1.35] text-zinc-900">
//                   {reminders.length === 0 ? (
//                     <div className="text-zinc-500 font-medium">
//                       No reminders available.
//                     </div>
//                   ) : (
//                     reminders.map((item, idx) => (
//                       <div key={idx}>
//                         <div className="font-extrabold">{item.title}</div>
//                         <div>{item.body}</div>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 <h3 className="mt-8 text-primary text-[18px] font-extrabold">
//                   Insights for December 2025
//                 </h3>

//                 <ul className="mt-4 list-disc pl-5 space-y-2 text-[15px] leading-[1.35] text-zinc-900">
//                   {insights.length === 0 ? (
//                     <li className="text-zinc-500">No insights available.</li>
//                   ) : (
//                     insights.map((item, idx) => <li key={idx}>{item}</li>)
//                   )}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { listFinanceJobs } from "../../api/finance.api";

function money(v) {
  return `ETB ${Number(v || 0).toLocaleString()}`;
}

function StatCard({ title, value, subtitle }) {
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

function getAmount(row, keys, fallback = 0) {
  for (const key of keys) {
    const val = row?.[key];
    if (val !== undefined && val !== null && val !== "")
      return Number(val || 0);
  }
  return fallback;
}

export default function FinanceExpensesDashboard() {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const viewportRef = useRef(null);
  const contentRef = useRef(null);

  const BASE_WIDTH = 1280;
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
      setErr(e?.response?.data?.message || "Failed to load expense dashboard");
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

  const expenseRows = useMemo(() => {
    return jobs
      .map((j) => {
        const total = getAmount(j, ["expenseTotal", "expense", "cost"], 0);
        return {
          id: j.id,
          description: j.workType || j.description || "Job expense",
          qty: j.qty || j.quantity || 1,
          total,
          purchasedBy: j.purchasedBy || j.createdByName || "-",
          category: j.category || "General",
        };
      })
      .filter((x) => Number(x.total) > 0);
  }, [jobs]);

  const summary = useMemo(() => {
    const totalVariableExpenses = expenseRows.reduce(
      (sum, row) => sum + Number(row.total || 0),
      0,
    );

    const totalFixedExpenses = 0;
    const governmentObligations = 0;
    const grandTotalMonthlyExpense =
      totalVariableExpenses + totalFixedExpenses + governmentObligations;

    return {
      totalVariableExpenses,
      totalFixedExpenses,
      governmentObligations,
      grandTotalMonthlyExpense,
    };
  }, [expenseRows]);

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
                title="Total Variable Expenses"
                value={money(summary.totalVariableExpenses)}
                subtitle="from recorded job costs"
              />
              <StatCard
                title="Total Fixed Expenses"
                value={money(summary.totalFixedExpenses)}
                subtitle="not connected yet"
              />
              <StatCard
                title="Government Obligations"
                value={money(summary.governmentObligations)}
                subtitle="not connected yet"
              />
              <StatCard
                title="Grand Total Monthly Expense"
                value={money(summary.grandTotalMonthlyExpense)}
                subtitle="current tracked total"
              />
            </div>

            <div className="grid grid-cols-[1fr_320px] gap-6">
              <div className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                <h2 className="text-primary text-[30px] font-extrabold leading-none">
                  Expense report
                </h2>
                <p className="mt-1 text-zinc-500 font-semibold text-sm">
                  Filter by payer, category or description.
                </p>

                <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-900">
                      <tr className="text-left">
                        <th className="px-5 py-3 font-extrabold">
                          Description
                        </th>
                        <th className="px-4 py-3 font-extrabold">Qty</th>
                        <th className="px-4 py-3 font-extrabold">
                          Total (ETB)
                        </th>
                        <th className="px-4 py-3 font-extrabold">
                          Purchased By
                        </th>
                        <th className="px-4 py-3 font-extrabold">Category</th>
                      </tr>
                    </thead>

                    <tbody className="bg-white">
                      {loading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-5 py-6 text-zinc-500 font-semibold"
                          >
                            Loading expense data...
                          </td>
                        </tr>
                      ) : expenseRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-5 py-6 text-zinc-500 font-semibold"
                          >
                            No tracked expense data found from backend rows.
                          </td>
                        </tr>
                      ) : (
                        expenseRows.map((row) => (
                          <tr
                            key={row.id}
                            className="border-t border-zinc-100 hover:bg-zinc-50/70 transition-colors"
                          >
                            <td className="px-5 py-3 font-medium text-zinc-800">
                              {row.description}
                            </td>
                            <td className="px-4 py-3 font-medium text-zinc-800">
                              {row.qty}
                            </td>
                            <td className="px-4 py-3 font-medium text-zinc-800">
                              {Number(row.total || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-medium text-zinc-800">
                              {row.purchasedBy}
                            </td>
                            <td className="px-4 py-3 font-medium text-zinc-800">
                              {row.category}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-full bg-zinc-100 px-5 py-4">
                  <div className="text-primary font-extrabold text-[18px]">
                    Grand total (filtered)
                  </div>
                  <div className="text-primary font-extrabold text-[20px]">
                    {money(summary.totalVariableExpenses)}
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button className="min-w-[190px] rounded-xl bg-primary px-6 py-3 text-white font-extrabold shadow-sm hover:opacity-95 transition">
                    +Add Expense
                  </button>

                  <button className="min-w-[190px] rounded-xl bg-primary px-6 py-3 text-white font-extrabold shadow-sm hover:opacity-95 transition">
                    Export to excel
                  </button>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
                <h3 className="text-primary text-[18px] font-extrabold">
                  Tax & Compliance Reminders
                </h3>

                <div className="mt-4 space-y-3 text-[15px] leading-[1.35] text-zinc-900">
                  <div>
                    <div className="font-extrabold">VAT Payment</div>
                    <div>Due by 30th of the month.</div>
                  </div>

                  <div>
                    <div className="font-extrabold">Salary Income Tax</div>
                    <div>Due within first 10 days of next month.</div>
                  </div>

                  <div>
                    <div className="font-extrabold">Pension Contribution</div>
                    <div>Align with salary payment date.</div>
                  </div>

                  <div>
                    <div className="font-extrabold">Check</div>
                    <div>
                      All tax payments should have receipts attached in the
                      finance records.
                    </div>
                  </div>
                </div>

                <h3 className="mt-8 text-primary text-[18px] font-extrabold">
                  Insights
                </h3>

                <ul className="mt-4 list-disc pl-5 space-y-2 text-[15px] leading-[1.35] text-zinc-900">
                  <li>Track costs on every job record consistently.</li>
                  <li>
                    Move fixed monthly expenses into a dedicated backend table.
                  </li>
                  <li>
                    Add tax, pension, and utility records to get a true monthly
                    expense total.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
