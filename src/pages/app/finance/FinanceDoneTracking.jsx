import { useEffect, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import { useDialog } from "../../../components/common/DialogProvider";
import { formatJobId } from "../../../utils/jobFormatting";
import { financeAction, listFinanceJobs } from "../../api/finance.api";
import JobDetailActionPanel from "../../../components/common/JobDetailActionPanel";

function money(v) {
  return `ETB ${Number(v || 0).toLocaleString()}`;
}

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function FinanceDoneTracking() {
  const dialog = useDialog();
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      const a = await listFinanceJobs("READY_FOR_DELIVERY");
      const b = await listFinanceJobs("DELIVERY_APPROVED").catch(() => []);
      const c = await listFinanceJobs("DELIVERED");
      const all = [...a, ...b, ...c].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
      setJobs(all);
      setSelected((prev) => all.find((x) => x.id === prev?.id) || all[0] || null);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load done jobs");
      setJobs([]);
      setSelected(null);
    }
  }

  useEffect(() => { load(); }, []);

  async function approveDelivery(jobId) {
    try {
      await financeAction(jobId, "FINANCE_APPROVE_DELIVERY");
      dialog.toast("Delivery approved", "success");
      load();
    } catch (e) {
      dialog.toast(e?.response?.data?.message || "Failed", "error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = jobs.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-primary">Finance — Done Tracking</h2>
          <button onClick={load} className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Refresh</button>
        </div>

        {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

        <div className="mt-4 overflow-auto rounded-2xl border border-zinc-200">
          <table className="min-w-[1160px] w-full table-fixed text-sm">
            <thead className="text-left text-zinc-600 bg-bgLight">
              <tr>
                <th className="py-3 px-4 w-[110px] whitespace-nowrap">Job#</th>
                <th className="py-3 px-4 w-[180px] whitespace-nowrap">Customer</th>
                <th className="py-3 px-4 w-[160px] whitespace-nowrap">Work</th>
                <th className="py-3 px-4 w-[120px] whitespace-nowrap">Total</th>
                <th className="py-3 px-4 w-[170px] whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((j) => (
                <tr key={j.id} onClick={() => setSelected(j)} className={cn("border-t border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors", selected?.id === j.id ? "bg-bgLight" : "") }>
                  <td className="py-3 px-4 font-bold text-primary whitespace-nowrap">{formatJobId(j.jobNo)}</td>
                  <td className="py-3 px-4 whitespace-nowrap truncate">{j.customerName}</td>
                  <td className="py-3 px-4 whitespace-nowrap truncate">{j.workType}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{money(j.total || j.totalAmount || j.grandTotal || 0)}</td>
                  <td className="py-3 px-4 whitespace-nowrap font-semibold">{j.status}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 flex-nowrap">
                      {j.status === "READY_FOR_DELIVERY" ? (
                        <button onClick={(e) => { e.stopPropagation(); approveDelivery(j.id); }} className="inline-flex items-center justify-center min-w-[150px] px-3 py-2 rounded-xl bg-success text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Approve Delivery</button>
                      ) : null}
                      {j.status === "DELIVERY_APPROVED" ? <span className="inline-flex items-center justify-center min-w-[150px] px-3 py-2 rounded-xl bg-bgLight text-primary font-semibold">Approved</span> : null}
                      {j.status === "DELIVERED" ? <span className="inline-flex items-center justify-center min-w-[150px] px-3 py-2 rounded-xl bg-green-100 text-green-700 font-semibold">Delivered</span> : null}
                    </div>
                  </td>
                </tr>
              ))}
              {slice.length === 0 && <tr><td colSpan={6} className="py-4 px-3 text-zinc-600">No done jobs yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </div>

      <JobDetailActionPanel selected={selected}>
        {selected?.status === "READY_FOR_DELIVERY" ? (
          <button onClick={() => approveDelivery(selected.id)} className="flex-1 px-4 py-3 rounded-xl bg-success text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">Approve Delivery</button>
        ) : selected?.status === "DELIVERY_APPROVED" ? (
          <div className="flex-1 px-4 py-3 rounded-xl bg-bgLight text-primary font-semibold text-center">Delivery approved - waiting assistant confirmation</div>
        ) : selected?.status === "DELIVERED" ? (
          <div className="flex-1 px-4 py-3 rounded-xl bg-green-100 text-green-700 font-semibold text-center">Delivered</div>
        ) : null}
      </JobDetailActionPanel>
    </div>
  );
}
