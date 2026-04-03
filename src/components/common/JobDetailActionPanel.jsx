import { formatJobId } from "../../utils/jobFormatting";

export default function JobDetailActionPanel({
  selected,
  title = "Job Details",
  emptyText = "No job selected — select a job to see the detail",
  children,
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm w-full lg:w-[320px] xl:w-[348px] self-start lg:sticky lg:top-5 transition-all duration-300 hover:shadow-md hover:border-primary/20 overflow-hidden lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto text-[13px] font-semibold">
      {!selected ? (
        <div className="text-zinc-500 font-bold text-center mt-10">{emptyText}</div>
      ) : (
        <div className="grid gap-3">
          <div className="text-zinc-500 font-bold">{title}</div>
          <div className="text-primary font-bold text-[18px] leading-tight break-words">
            {formatJobId(selected.jobNo)} — {selected.workType}
          </div>
          <div className="text-[13px] text-zinc-700 font-bold">Customer: <span className="font-medium">{selected.customerName}</span></div>
          <div className="text-[13px] text-zinc-700 font-bold">Phone: <span className="font-medium">{selected.customerPhone || "-"}</span></div>
          <div className="text-[13px] text-zinc-700 font-bold">Status: <span className="font-medium">{selected.status || "-"}</span></div>
          <div className="text-[13px] text-zinc-700 font-bold">Description:</div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-600 font-semibold break-words min-h-[56px]">
            {selected.description || "-"}
          </div>
          <div className="text-[13px] text-zinc-700 font-bold">Qty: <span className="font-medium">{selected.qty} {selected.unitType}</span></div>
          {children ? <div className="grid gap-2 pt-1">{children}</div> : null}
        </div>
      )}
    </div>
  );
}
