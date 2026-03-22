// import { useEffect, useState } from "react";
// import { listFinanceJobs } from "../../api/finance.api";

// export default function FinanceDoneTracking() {
//   const [jobs, setJobs] = useState([]);
//   const [err, setErr] = useState("");

//   async function load() {
//     try {
//       setErr("");
//       const a = await listFinanceJobs("READY_FOR_DELIVERY");
//       const b = await listFinanceJobs("DELIVERED");
//       setJobs(
//         [...a, ...b].sort(
//           (x, y) => new Date(y.createdAt) - new Date(x.createdAt),
//         ),
//       );
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Failed to load done jobs");
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-extrabold text-primary">
//           Finance — Done Tracking
//         </h2>
//         <button
//           onClick={load}
//           className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
//         >
//           Refresh
//         </button>
//       </div>

//       {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

//       <div className="mt-4 overflow-auto">
//         <table className="min-w-full text-sm">
//           <thead className="text-left text-zinc-600">
//             <tr>
//               <th className="py-2 pr-4">Job#</th>
//               <th className="py-2 pr-4">Customer</th>
//               <th className="py-2 pr-4">Work</th>
//               <th className="py-2 pr-4">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {jobs.map((j) => (
//               <tr key={j.id} className="border-t border-zinc-200">
//                 <td className="py-2 pr-4 font-bold text-primary">#{j.jobNo}</td>
//                 <td className="py-2 pr-4">{j.customerName}</td>
//                 <td className="py-2 pr-4">{j.workType}</td>
//                 <td className="py-2 pr-4">{j.status}</td>
//               </tr>
//             ))}
//             {jobs.length === 0 && (
//               <tr>
//                 <td colSpan={4} className="py-4 text-zinc-600">
//                   No done jobs yet.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { listFinanceJobs } from "../../api/finance.api";

function money(v) {
  return `ETB ${Number(v || 0).toLocaleString()}`;
}

export default function FinanceDoneTracking() {
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");

      const a = await listFinanceJobs("READY_FOR_DELIVERY");
      const b = await listFinanceJobs("DELIVERED");

      setJobs(
        [...a, ...b].sort(
          (x, y) => new Date(y.createdAt) - new Date(x.createdAt),
        ),
      );
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load done jobs");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-primary">
          Finance — Done Tracking
        </h2>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

      <div className="mt-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-zinc-600">
            <tr>
              <th className="py-2 pr-4">Job#</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Work</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-zinc-200">
                <td className="py-2 pr-4 font-bold text-primary">#{j.jobNo}</td>
                <td className="py-2 pr-4">{j.customerName}</td>
                <td className="py-2 pr-4">{j.workType}</td>
                <td className="py-2 pr-4">
                  {money(j.total || j.totalAmount || j.grandTotal || 0)}
                </td>
                <td className="py-2 pr-4">{j.status}</td>
              </tr>
            ))}

            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-zinc-600">
                  No done jobs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
