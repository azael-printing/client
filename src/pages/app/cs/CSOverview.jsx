import { useEffect, useMemo, useState } from "react";
import { listJobsByStatus } from "../../api/cs.api";

function Card({ title, value, sub }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm min-w-[240px]">
      <div className="text-zinc-400 font-bold">{title}</div>
      <div className="mt-2 text-primary text-3xl font-extrabold">{value}</div>
      <div className="mt-1 text-zinc-400">{sub}</div>
    </div>
  );
}

export default function CSOverview() {
  const [all, setAll] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await listJobsByStatus(); // CS backend should return CS-visible jobs
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
      waitingFinance: count("FINANCE_WAITING_APPROVAL"),
      inDesign: [
        "DESIGN_PENDING",
        "DESIGN_WAITING",
        "IN_DESIGN",
        "DESIGN_DONE",
      ].reduce((a, s) => a + count(s), 0),
      inProduction: [
        "PRODUCTION_PENDING",
        "PRODUCTION_WAITING",
        "IN_PRODUCTION",
        "PRODUCTION_DONE",
      ].reduce((a, s) => a + count(s), 0),
    };
  }, [all]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Jobs" value={stats.total} sub="All CS jobs" />
        <Card
          title="Finance Waiting"
          value={stats.waitingFinance}
          sub="Pending approval"
        />
        <Card title="In Design" value={stats.inDesign} sub="Design pipeline" />
        <Card
          title="In Production"
          value={stats.inProduction}
          sub="Production pipeline"
        />
      </div>
    </div>
  );
}
