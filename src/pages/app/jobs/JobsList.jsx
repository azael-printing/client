// import { useEffect, useMemo, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { listJobs } from "../../api/jobs.api";

// function cn(...xs) {
//   return xs.filter(Boolean).join(" ");
// }

// function toCSV(rows) {
//   const headers = [
//     "jobNo",
//     "customerName",
//     "customerPhone",
//     "machine",
//     "status",
//     "paymentStatus",
//     "deliveryDate",
//     "workType",
//     "qty",
//     "unitType",
//     "total",
//     "remainingBalance",
//   ];

//   const esc = (v) => {
//     const s = String(v ?? "");
//     if (s.includes(",") || s.includes('"') || s.includes("\n")) {
//       return `"${s.replaceAll('"', '""')}"`;
//     }
//     return s;
//   };

//   const lines = [
//     headers.join(","),
//     ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
//   ];

//   return lines.join("\n");
// }

// function downloadFile(filename, content, mime = "text/csv;charset=utf-8") {
//   const blob = new Blob([content], { type: mime });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   a.click();
//   URL.revokeObjectURL(url);
// }

// function Badge({ text }) {
//   const map = {
//     IN_PRODUCTION: "bg-blue-100 text-blue-700",
//     IN_DESIGN: "bg-purple-100 text-purple-700",
//     NEW_REQUEST: "bg-zinc-100 text-zinc-700",
//     FINANCE_WAITING_APPROVAL: "bg-yellow-100 text-yellow-800",
//     FINANCE_APPROVED: "bg-green-100 text-green-700",
//     PRODUCTION_DONE: "bg-green-100 text-green-700",
//     DESIGN_DONE: "bg-green-100 text-green-700",
//     DELIVERED: "bg-zinc-200 text-zinc-700",
//     UNPAID: "bg-zinc-100 text-zinc-700",
//     PARTIAL: "bg-yellow-100 text-yellow-800",
//     PAID: "bg-green-100 text-green-700",
//   };
//   const cls = map[text] || "bg-zinc-100 text-zinc-700";
//   return (
//     <span className={cn("px-3 py-1 rounded-full text-xs font-extrabold", cls)}>
//       {text}
//     </span>
//   );
// }

// export default function JobsList() {
//   const location = useLocation();
//   const qs = useMemo(
//     () => new URLSearchParams(location.search),
//     [location.search],
//   );

//   const [jobs, setJobs] = useState([]);
//   const [err, setErr] = useState("");

//   const [machineFilter, setMachineFilter] = useState(qs.get("machine") || "");
//   const [statusFilter, setStatusFilter] = useState(qs.get("status") || "");
//   const [paymentFilter, setPaymentFilter] = useState("");

//   const [selected, setSelected] = useState(null);

//   // pagination
//   const [page, setPage] = useState(1);
//   const pageSize = 5;

//   async function load() {
//     try {
//       setErr("");
//       const data = await listJobs(); // server already filters per role
//       setJobs(data || []);
//       if (data?.length && !selected) setSelected(data[0]);
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Failed to load jobs");
//     }
//   }

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // update filters when URL query changes
//   useEffect(() => {
//     setMachineFilter(qs.get("machine") || "");
//     setStatusFilter(qs.get("status") || "");
//     setPage(1);
//   }, [qs]);

//   const filtered = useMemo(() => {
//     return jobs.filter((j) => {
//       const okMachine = machineFilter
//         ? (j.machine || "").toLowerCase().includes(machineFilter.toLowerCase())
//         : true;
//       const okStatus = statusFilter ? (j.status || "") === statusFilter : true;
//       const okPay = paymentFilter
//         ? (j.paymentStatus || "") === paymentFilter
//         : true;
//       return okMachine && okStatus && okPay;
//     });
//   }, [jobs, machineFilter, statusFilter, paymentFilter]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const pageSafe = Math.min(page, totalPages);
//   const slice = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

//   function exportExcel() {
//     const csv = toCSV(filtered);
//     downloadFile(
//       `jobs_export_${new Date().toISOString().slice(0, 10)}.csv`,
//       csv,
//     );
//   }

//   function pick(job) {
//     setSelected(job);
//   }

//   return (
//     <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
//       <div className="flex lg:grid-cols-4 md:grid-cols-2">
//         {/* LEFT: table */}
//         <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-extrabold text-primary">Jobs</h2>

//             <button
//               onClick={exportExcel}
//               className="px-4 py-2 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 transition"
//             >
//               Export to Excel
//             </button>
//           </div>

//           {/* Filters */}
//           <div className="mt-4 grid gap-3 sm:grid-cols-3">
//             <div>
//               <div className="text-sm font-extrabold text-primary mb-1">
//                 Machine
//               </div>
//               <input
//                 value={machineFilter}
//                 onChange={(e) => {
//                   setMachineFilter(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
//                 placeholder=""
//               />
//             </div>

//             <div>
//               <div className="text-sm font-extrabold text-primary mb-1">
//                 Status
//               </div>
//               <input
//                 value={statusFilter}
//                 onChange={(e) => {
//                   setStatusFilter(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
//                 placeholder=""
//               />
//             </div>

//             <div>
//               <div className="text-sm font-extrabold text-primary mb-1">
//                 Payment Status
//               </div>
//               <input
//                 value={paymentFilter}
//                 onChange={(e) => {
//                   setPaymentFilter(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
//                 placeholder=""
//               />
//             </div>
//           </div>

//           {err && <div className="mt-4 text-red-600 font-extrabold">{err}</div>}

//           {/* Table */}
//           <div className="mt-4 overflow-auto">
//             <table className="min-w-full text-sm">
//               <thead className="text-left text-zinc-500">
//                 <tr className="bg-bgLight">
//                   <th className="py-3 px-3">JobID</th>
//                   <th className="py-3 px-3">Customer</th>
//                   <th className="py-3 px-3">Number</th>
//                   <th className="py-3 px-3">Machine</th>
//                   <th className="py-3 px-3">Status</th>
//                   <th className="py-3 px-3">Payment Status</th>
//                   <th className="py-3 px-3">Delivery</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {slice.map((j) => (
//                   <tr
//                     key={j.id}
//                     onClick={() => pick(j)}
//                     className={cn(
//                       "border-t border-zinc-200 cursor-pointer",
//                       selected?.id === j.id ? "bg-bgLight" : "hover:bg-bgLight",
//                     )}
//                   >
//                     <td className="py-3 px-3 text-zinc-800 font-bold">
//                       {j.id}
//                     </td>
//                     <td className="py-3 px-3">{j.customerName}</td>
//                     <td className="py-3 px-3">{j.customerPhone || "-"}</td>
//                     <td className="py-3 px-3">{j.machine || "-"}</td>
//                     <td className="py-3 px-3">
//                       <Badge text={j.status} />
//                     </td>
//                     <td className="py-3 px-3">
//                       <Badge text={j.paymentStatus || "UNPAID"} />
//                     </td>
//                     <td className="py-3 px-3">
//                       {j.deliveryDate
//                         ? String(j.deliveryDate).slice(0, 10)
//                         : "-"}
//                     </td>
//                   </tr>
//                 ))}

//                 {slice.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="py-6 px-3 text-zinc-500 font-bold"
//                     >
//                       No jobs found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="mt-5 flex items-center justify-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               className="px-3 py-2 rounded-lg border border-zinc-200 font-bold hover:bg-bgLight"
//             >
//               Prev
//             </button>

//             {Array.from({ length: totalPages })
//               .slice(0, 5)
//               .map((_, idx) => {
//                 const p = idx + 1;
//                 const active = p === pageSafe;
//                 return (
//                   <button
//                     key={p}
//                     onClick={() => setPage(p)}
//                     className={cn(
//                       "px-3 py-2 rounded-lg border font-bold",
//                       active
//                         ? "bg-primary text-white border-primary"
//                         : "border-zinc-200 hover:bg-bgLight",
//                     )}
//                   >
//                     {p}
//                   </button>
//                 );
//               })}

//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               className="px-3 py-2 rounded-lg border border-zinc-200 font-bold hover:bg-bgLight"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//         {/* RIGHT: details */}
//         <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm ml-5 w-96">
//           {!selected ? (
//             <div className="text-zinc-500 font-bold text-center mt-10">
//               Select a job to view details
//             </div>
//           ) : (
//             <div className="grid gap-3">
//               <div className="text-zinc-500 font-extrabold">Job Details</div>

//               <div className="text-primary font-extrabold text-xl">
//                 #{selected.jobNo} — {selected.workType}
//               </div>

//               <div className="text-sm text-zinc-700 font-bold">
//                 Customer:{" "}
//                 <span className="font-medium">{selected.customerName}</span>
//               </div>
//               <div className="text-sm text-zinc-700 font-bold">
//                 Phone:{" "}
//                 <span className="font-medium">
//                   {selected.customerPhone || "-"}
//                 </span>
//               </div>
//               <div className="text-sm text-zinc-700 font-bold">
//                 Machine:{" "}
//                 <span className="font-medium">{selected.machine || "-"}</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-bold text-zinc-700">Status:</span>
//                 <Badge text={selected.status} />
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-bold text-zinc-700">
//                   Payment:
//                 </span>
//                 <Badge text={selected.paymentStatus || "UNPAID"} />
//               </div>

//               <div className="mt-3 grid gap-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-zinc-500 font-bold">Subtotal</span>
//                   <span className="text-zinc-900 font-extrabold">
//                     {Math.round(selected.subtotal || 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-zinc-500 font-bold">VAT</span>
//                   <span className="text-zinc-900 font-extrabold">
//                     {Math.round(selected.vatAmount || 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-zinc-500 font-bold">Total</span>
//                   <span className="text-primary font-extrabold">
//                     {Math.round(selected.total || 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-zinc-500 font-bold">Outstanding</span>
//                   <span className="text-red-600 font-extrabold">
//                     {Math.round(
//                       selected.remainingBalance || 0,
//                     ).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>{" "}
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { listJobs, updateJob } from "../../api/jobs.api";
import { useAuth } from "../../../app/providers/AuthProvider";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function toCSV(rows) {
  const headers = [
    "jobNo",
    "customerName",
    "customerPhone",
    "machine",
    "status",
    "paymentStatus",
    "deliveryDate",
    "workType",
    "qty",
    "unitType",
    "total",
    "remainingBalance",
  ];

  const esc = (v) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n"))
      return `"${s.replaceAll('"', '""')}"`;
    return s;
  };

  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ].join("\n");
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Badge({ text }) {
  const map = {
    IN_PRODUCTION: "bg-blue-100 text-blue-700",
    IN_DESIGN: "bg-purple-100 text-purple-700",
    NEW_REQUEST: "bg-zinc-100 text-zinc-700",
    FINANCE_WAITING_APPROVAL: "bg-yellow-100 text-yellow-800",
    FINANCE_APPROVED: "bg-green-100 text-green-700",
    PRODUCTION_DONE: "bg-green-100 text-green-700",
    DESIGN_DONE: "bg-green-100 text-green-700",
    DELIVERED: "bg-zinc-200 text-zinc-700",
    UNPAID: "bg-zinc-100 text-zinc-700",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-700",
    CREDIT: "bg-orange-100 text-orange-700",
  };
  const cls = map[text] || "bg-zinc-100 text-zinc-700";
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-extrabold", cls)}>
      {text}
    </span>
  );
}

export default function JobsList() {
  const { user } = useAuth();
  const role = user?.role;

  const location = useLocation();
  const qs = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState("");

  const [machineFilter, setMachineFilter] = useState(qs.get("machine") || "");
  const [statusFilter, setStatusFilter] = useState(qs.get("status") || "");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [selected, setSelected] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 8;

  async function load() {
    try {
      setErr("");
      const data = await listJobs();
      setJobs(data || []);
      // keep selection if still exists
      if (selected) {
        const found = (data || []).find((x) => x.id === selected.id);
        setSelected(found || null);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs");
    }
  }

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    setMachineFilter(qs.get("machine") || "");
    setStatusFilter(qs.get("status") || "");
    setPage(1);
  }, [qs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const okMachine = machineFilter
        ? (j.machine || "").toLowerCase().includes(machineFilter.toLowerCase())
        : true;
      const okStatus = statusFilter ? (j.status || "") === statusFilter : true;
      const okPay = paymentFilter
        ? (j.paymentStatus || "") === paymentFilter
        : true;
      return okMachine && okStatus && okPay;
    });
  }, [jobs, machineFilter, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  function exportExcel() {
    const csv = toCSV(filtered);
    downloadFile(
      `jobs_export_${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
    );
  }

  async function saveSelected(patch) {
    if (!selected) return;
    try {
      await updateJob(selected.id, patch);
      await load();
      alert("Updated");
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
      {/* LEFT */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-primary">Jobs</h2>
          <button
            onClick={exportExcel}
            className="px-4 py-2 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 transition"
          >
            Export to Excel
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <div className="text-sm font-extrabold text-primary mb-1">
              Machine
            </div>
            <input
              value={machineFilter}
              onChange={(e) => {
                setMachineFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
            />
          </div>

          <div>
            <div className="text-sm font-extrabold text-primary mb-1">
              Status
            </div>
            <input
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
            />
          </div>

          <div>
            <div className="text-sm font-extrabold text-primary mb-1">
              Payment Status
            </div>
            <input
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
            />
          </div>
        </div>

        {err && <div className="mt-4 text-red-600 font-extrabold">{err}</div>}

        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-zinc-500">
              <tr className="bg-bgLight">
                <th className="py-3 px-3">JobID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Number</th>
                <th className="py-3 px-3">Machine</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Payment Status</th>
                <th className="py-3 px-3">Delivery</th>
              </tr>
            </thead>

            <tbody>
              {slice.map((j) => (
                <tr
                  key={j.id}
                  onClick={() => setSelected(j)}
                  className={cn(
                    "border-t border-zinc-200 cursor-pointer",
                    selected?.id === j.id ? "bg-bgLight" : "hover:bg-bgLight",
                  )}
                >
                  <td className="py-3 px-3 font-bold text-zinc-800">{j.id}</td>
                  <td className="py-3 px-3">{j.customerName}</td>
                  <td className="py-3 px-3">{j.customerPhone || "-"}</td>
                  <td className="py-3 px-3">{j.machine || "-"}</td>
                  <td className="py-3 px-3">
                    <Badge text={j.status} />
                  </td>
                  <td className="py-3 px-3">
                    <Badge text={j.paymentStatus || "UNPAID"} />
                  </td>
                  <td className="py-3 px-3">
                    {j.deliveryDate ? String(j.deliveryDate).slice(0, 10) : "-"}
                  </td>
                </tr>
              ))}

              {slice.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 px-3 text-zinc-500 font-bold">
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-2 rounded-lg border border-zinc-200 font-bold hover:bg-bgLight"
          >
            Prev
          </button>

          {Array.from({ length: totalPages })
            .slice(0, 6)
            .map((_, idx) => {
              const p = idx + 1;
              const active = p === pageSafe;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "px-3 py-2 rounded-lg border font-bold",
                    active
                      ? "bg-primary text-white border-primary"
                      : "border-zinc-200 hover:bg-bgLight",
                  )}
                >
                  {p}
                </button>
              );
            })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-2 rounded-lg border border-zinc-200 font-bold hover:bg-bgLight"
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT: Details + Update */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        {!selected ? (
          <div className="text-zinc-500 font-bold text-center mt-10">
            no job selected — select the job to see the detail
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="text-zinc-500 font-extrabold">Job Details</div>

            <div className="text-primary font-extrabold text-xl">
              #{selected.jobNo} — {selected.workType}
            </div>

            <div className="text-sm text-zinc-700 font-bold">
              Customer:{" "}
              <span className="font-medium">{selected.customerName}</span>
            </div>
            <div className="text-sm text-zinc-700 font-bold">
              Phone:{" "}
              <span className="font-medium">
                {selected.customerPhone || "-"}
              </span>
            </div>

            <div className="mt-2 grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-zinc-700">Machine</div>
                <input
                  className="w-[240px] px-3 py-2 rounded-xl border border-zinc-200"
                  defaultValue={selected.machine || ""}
                  onBlur={(e) =>
                    role === "ADMIN" &&
                    saveSelected({ machine: e.target.value })
                  }
                  disabled={role !== "ADMIN"}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-zinc-700">Status</div>
                <input
                  className="w-[240px] px-3 py-2 rounded-xl border border-zinc-200"
                  defaultValue={selected.status || ""}
                  onBlur={(e) =>
                    role === "ADMIN" && saveSelected({ status: e.target.value })
                  }
                  disabled={role !== "ADMIN"}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-zinc-700">
                  Payment Status
                </div>
                <input
                  className="w-[240px] px-3 py-2 rounded-xl border border-zinc-200"
                  defaultValue={selected.paymentStatus || "UNPAID"}
                  onBlur={(e) =>
                    role === "ADMIN" &&
                    saveSelected({ paymentStatus: e.target.value })
                  }
                  disabled={role !== "ADMIN"}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-zinc-700">
                  Delivery Date
                </div>
                <input
                  type="date"
                  className="w-[240px] px-3 py-2 rounded-xl border border-zinc-200"
                  defaultValue={
                    selected.deliveryDate
                      ? String(selected.deliveryDate).slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    role === "ADMIN" &&
                    saveSelected({ deliveryDate: e.target.value || null })
                  }
                  disabled={role !== "ADMIN"}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-bold">Subtotal</span>
                <span className="text-zinc-900 font-extrabold">
                  {Math.round(selected.subtotal || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-bold">VAT</span>
                <span className="text-zinc-900 font-extrabold">
                  {Math.round(selected.vatAmount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-bold">Total</span>
                <span className="text-primary font-extrabold">
                  {Math.round(selected.total || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-bold">Outstanding</span>
                <span className="text-red-600 font-extrabold">
                  {Math.round(selected.remainingBalance || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {role !== "ADMIN" && (
              <div className="mt-4 text-zinc-500 font-bold">
                You can view details only. Admin can edit fields.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
