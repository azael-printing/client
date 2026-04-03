import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import FinanceSectionCard from "../../../components/common/FinanceSectionCard";
import FinanceSidePanel from "../../../components/common/FinanceSidePanel";
import FinanceTableShell from "../../../components/common/FinanceTableShell";
import {
  financeMetaGridClass,
  financeMetaLabelClass,
  financeMetaValueClass,
  financePrimaryBtnClass,
} from "../../../components/common/financeUi";
import { fetchFinanceCollection, money, toInvoiceRows } from "./financeShared";

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  let cls = "bg-zinc-100 text-zinc-700";
  if (s.includes("paid") || s.includes("delivered")) cls = "bg-green-100 text-green-700";
  else if (s.includes("partial")) cls = "bg-yellow-100 text-yellow-700";
  else if (s.includes("credit")) cls = "bg-red-100 text-red-700";
  else if (s.includes("unpaid")) cls = "bg-orange-100 text-orange-700";

  return (
    <span className={`inline-flex min-w-[78px] justify-center rounded-full px-3 py-1 text-xs font-bold ${cls}`}>
      {status || "-"}
    </span>
  );
}

export default function FinanceInvoiceDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const unique = await fetchFinanceCollection();
      setJobs(unique);
      setSelectedId((prev) => prev || unique[0]?.id || "");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load invoice dashboard");
      setJobs([]);
      setSelectedId("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(() => toInvoiceRows(jobs), [jobs]);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);
  const selected = rows.find((row) => row.id === selectedId) || rows[0] || null;

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <FinanceSectionCard
        title="Invoices"
        subtitle="Finance-only view tab."
        action={
          <button type="button" className={financePrimaryBtnClass}>
            Export to excel
          </button>
        }
      >
        {err ? <div className="mt-4 text-sm font-semibold text-red-600">{err}</div> : null}

        <FinanceTableShell
          minWidth={900}
          loading={loading}
          rowCount={pageRows.length}
          emptyText="No invoices found."
          headers={[
            { key: "invoice", label: "Invoices", className: "w-[135px]" },
            { key: "job", label: "JobID", className: "w-[96px]" },
            { key: "customer", label: "Customer" },
            { key: "total", label: "Total", className: "w-[92px]" },
            { key: "paid", label: "Paid", className: "w-[92px]" },
            { key: "balance", label: "Balance", className: "w-[92px]" },
            { key: "status", label: "Status", className: "w-[105px]" },
          ]}
          colSpan={7}
        >
          {pageRows.map((row) => (
            <tr
              key={row.id}
              onClick={() => setSelectedId(row.id)}
              className={`cursor-pointer border-t border-zinc-100 transition-colors hover:bg-zinc-50/70 ${selected?.id === row.id ? "bg-bgLight" : ""}`}
            >
              <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-800">{row.invoiceNo}</td>
              <td className="whitespace-nowrap px-4 py-3 font-extrabold text-primary">{row.displayJobId}</td>
              <td className="truncate px-4 py-3 font-medium text-zinc-800">{row.customerName || "-"}</td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-800">{Number(row.total || 0).toLocaleString()}</td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-800">{Number(row.paid || 0).toLocaleString()}</td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-800">{Number(row.balance || 0).toLocaleString()}</td>
              <td className="px-4 py-3"><StatusBadge status={row.paymentLabel} /></td>
            </tr>
          ))}
        </FinanceTableShell>

        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      </FinanceSectionCard>

      <FinanceSidePanel title="Job Details" subtitle={selected?.displayJobId || "AZ-0000"} className="min-h-[420px]">
        <div className="space-y-5 text-[14px] leading-tight text-zinc-900">
          <div>
            <div className="text-[17px] font-extrabold text-zinc-900">Customer Info</div>
            <div className={financeMetaGridClass}>
              <div className={financeMetaLabelClass}>Customer name</div><div className={financeMetaValueClass}>{selected?.customerName || "-"}</div>
              <div className={financeMetaLabelClass}>Phone number</div><div className={financeMetaValueClass}>{selected?.customerPhone || "-"}</div>
            </div>
          </div>

          <div>
            <div className="text-[17px] font-extrabold text-zinc-900">Job Details</div>
            <div className={financeMetaGridClass}>
              <div className={financeMetaLabelClass}>Machine</div><div className={financeMetaValueClass}>{selected?.machine || "-"}</div>
              <div className={financeMetaLabelClass}>Work Type</div><div className={financeMetaValueClass}>{selected?.workType || "-"}</div>
              <div className={financeMetaLabelClass}>Description</div><div className={financeMetaValueClass}>{selected?.description || "-"}</div>
              <div className={financeMetaLabelClass}>Quantity</div><div className={financeMetaValueClass}>{selected?.qty || "-"}</div>
              <div className={financeMetaLabelClass}>Unit Type</div><div className={financeMetaValueClass}>{selected?.unitType || "-"}</div>
            </div>
          </div>

          <div>
            <div className="text-[17px] font-extrabold text-zinc-900">Delivery Details</div>
            <div className={financeMetaGridClass}>
              <div className={financeMetaLabelClass}>Delivery Date</div><div className={financeMetaValueClass}>{selected?.deliveryDate ? new Date(selected.deliveryDate).toLocaleDateString() : "-"}</div>
              <div className={financeMetaLabelClass}>Delivery Time</div><div className={financeMetaValueClass}>{selected?.deliveryTime || "-"}</div>
              <div className={financeMetaLabelClass}>Pickup or Delivery</div><div className={financeMetaValueClass}>{selected?.deliveryType || "-"}</div>
            </div>
          </div>

          <div>
            <div className="text-[17px] font-extrabold text-zinc-900">Pricing</div>
            <div className={financeMetaGridClass}>
              <div className={financeMetaLabelClass}>Total price</div><div className={financeMetaValueClass}>{money(selected?.total || 0)}</div>
              <div className={financeMetaLabelClass}>Payment Status</div><div className={financeMetaValueClass}>{selected?.paymentLabel || "-"}</div>
              <div className={financeMetaLabelClass}>Deposit Amount</div><div className={financeMetaValueClass}>{money(selected?.paid || 0)}</div>
              <div className={financeMetaLabelClass}>Remaining Balance</div><div className={financeMetaValueClass}>{money(selected?.balance || 0)}</div>
            </div>
          </div>
        </div>
      </FinanceSidePanel>
    </div>
  );
}
