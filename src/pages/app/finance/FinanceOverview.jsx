import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listFinanceJobs } from "../../api/finance.api";

function Card({ title, value, sub, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm min-w-[240px] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
      <div className="text-zinc-400 font-bold">{title}</div>
      <div className="mt-2 text-primary text-3xl font-extrabold">{value}</div>
      <div className="mt-1 text-zinc-400">{sub}</div>
    </div>
  );
}

export default function FinanceOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/finance") ? "/app/admin/finance" : "/app/finance";
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // finance can see many statuses; for totals use everything finance can access
        const a = await listFinanceJobs(); // your API uses /api/jobs for finance role filtering
        setJobs(a || []);
      } catch {
        setJobs([]);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const revenueExVat = jobs.reduce(
      (s, j) => s + (Number(j.subtotal) || 0),
      0,
    );
    const vatTotal = jobs.reduce((s, j) => s + (Number(j.vatAmount) || 0), 0);
    const paid = jobs.reduce(
      (s, j) => s + (Number(j.total) - Number(j.remainingBalance || 0)),
      0,
    );
    const outstanding = jobs.reduce(
      (s, j) => s + (Number(j.remainingBalance) || 0),
      0,
    );

    const fmt = (n) => `ETB ${Math.round(n).toLocaleString()}`;

    return {
      revenueExVat: fmt(revenueExVat),
      vatTotal: fmt(vatTotal),
      paid: fmt(paid),
      outstanding: fmt(outstanding),
    };
  }, [jobs]);

  return (
    <div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card title="Net Revenue" value={stats.revenueExVat} sub="Excl VAT" onClick={() => navigate(`${basePath}/revenue/overview`)} />
        <Card title="VAT Total" value={stats.vatTotal} sub="15% VAT" onClick={() => navigate(`${basePath}/revenue/overview`)} />
        <Card title="Paid" value={stats.paid} sub="Collected" onClick={() => navigate(`${basePath}/revenue/invoice`)} />
        <Card title="Outstanding" value={stats.outstanding} sub="Remaining" onClick={() => navigate(`${basePath}/revenue/overdue`)} />
      </div>

      <div className="mt-6 text-zinc-500 font-bold">
        {/* keep blank area like screenshot */}
      </div>
    </div>
  );
}
