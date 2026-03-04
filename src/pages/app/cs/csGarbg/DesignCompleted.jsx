// import { useEffect, useState } from "react";
// import { listJobs, workflowAction } from "../../api/jobs.api";

// export default function DesignCompleted() {
//   const [jobs, setJobs] = useState([]);
//   const [err, setErr] = useState("");

//   async function load() {
//     try {
//       setErr("");
//       setJobs(await listJobs("DESIGN_DONE"));
//     } catch (e) {
//       setErr(
//         e?.response?.data?.message || "Failed to load design completed jobs",
//       );
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function approve(jobId) {
//     await workflowAction(jobId, "CS_PRODUCTION_READY");
//     load();
//   }

//   return (
//     <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-extrabold text-primary">
//           Design Completed
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
//               <th className="py-2 pr-4">Work</th>
//               <th className="py-2 pr-4">Customer</th>
//               <th className="py-2 pr-4">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {jobs.map((j) => (
//               <tr key={j.id} className="border-t border-zinc-200">
//                 <td className="py-2 pr-4 font-bold text-primary">#{j.jobNo}</td>
//                 <td className="py-2 pr-4">{j.workType}</td>
//                 <td className="py-2 pr-4">{j.customerName}</td>
//                 <td className="py-2 pr-4">
//                   <button
//                     onClick={() => approve(j.id)}
//                     className="px-3 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90"
//                   >
//                     Approve → Production Ready
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {jobs.length === 0 && (
//               <tr>
//                 <td colSpan={4} className="py-4 text-zinc-600">
//                   No design completed jobs.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
