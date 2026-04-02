import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listJobsByStatus } from "../../api/cs.api";
import CSJobControlPanel from "./CSJobControlPanel";

function Card({ title, value, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm min-w-[240px] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20"
    >
      <div className="text-zinc-400 font-semibold">{title}</div>
      <div className="mt-2 text-primary text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-zinc-400 text-sm">{sub}</div>
    </button>
  );
}

export default function CSOverview() {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await listJobsByStatus();
        setAll(res || []);
      } catch {
        setAll([]);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const count = (s) => all.filter((j) => j.status === s).length;
    return {
      total: all.length,
      waitingFinance: count("FINANCE_WAITING_APPROVAL") + count("NEW_REQUEST"),
      inDesign: ["DESIGN_PENDING", "DESIGN_WAITING", "IN_DESIGN", "DESIGN_DONE"].reduce((a, s) => a + count(s), 0),
      inProduction: ["PRODUCTION_PENDING", "PRODUCTION_WAITING", "IN_PRODUCTION", "PRODUCTION_DONE"].reduce((a, s) => a + count(s), 0),
    };
  }, [all]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Jobs" value={stats.total} sub="All CS jobs" onClick={() => navigate('/app/cs/jobs')} />
        <Card title="Finance Waiting" value={stats.waitingFinance} sub="Pending approval" onClick={() => navigate('/app/cs/new')} />
        <Card title="In Design" value={stats.inDesign} sub="Design pipeline" onClick={() => navigate('/app/cs/design')} />
        <Card title="In Production" value={stats.inProduction} sub="Production pipeline" onClick={() => navigate('/app/cs/production')} />
      </div>
      <div className="grid grid-cols-1">
        <CSJobControlPanel />
      </div>
    </div>
  );
}
