import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listOperatorJobsByStatus } from "../../api/operator.api";

function Card({ title, value, sub, onClick }) {
  return <button onClick={onClick} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm min-w-[240px] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20"><div className="text-zinc-400 font-semibold">{title}</div><div className="mt-2 text-primary text-3xl font-semibold">{value}</div><div className="mt-1 text-zinc-400 text-sm">{sub}</div></button>;
}

export default function OperatorOverview() {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  useEffect(() => { (async () => { try { const a = await listOperatorJobsByStatus(); setAll(a || []); } catch { setAll([]); } })(); }, []);
  const stats = useMemo(() => { const count = (s) => all.filter((j) => j.status === s).length; return { total: all.length, queue: ["PRODUCTION_READY","PRODUCTION_PENDING","PRODUCTION_WAITING"].reduce((a,s)=>a+count(s),0), inProd: count("IN_PRODUCTION"), done: count("PRODUCTION_DONE")}; }, [all]);
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Card title="Total Jobs" value={stats.total} sub="Assigned/visible" onClick={()=>navigate('/app/operator/overview')} /><Card title="Queue" value={stats.queue} sub="Pending / waiting" onClick={()=>navigate('/app/operator/queue')} /><Card title="In Production" value={stats.inProd} sub="Active work" onClick={()=>navigate('/app/operator/in-production')} /><Card title="Completed" value={stats.done} sub="Production done" onClick={()=>navigate('/app/operator/completed')} /></div>;
}
