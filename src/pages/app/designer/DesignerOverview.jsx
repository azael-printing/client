import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listDesignerJobsByStatus } from "../../api/designer.api";

function Card({ title, value, sub, onClick }) {
  return <button onClick={onClick} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm min-w-[240px] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20"><div className="text-zinc-400 font-semibold">{title}</div><div className="mt-2 text-primary text-3xl font-semibold">{value}</div><div className="mt-1 text-zinc-400 text-sm">{sub}</div></button>;
}

export default function DesignerOverview() {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  useEffect(() => { (async () => { try { const a = await listDesignerJobsByStatus(); setAll(a || []); } catch { setAll([]); } })(); }, []);
  const stats = useMemo(() => { const count = (s) => all.filter((j) => j.status === s).length; return { total: all.length, queue: ["DESIGN_ASSIGNED","DESIGN_PENDING","DESIGN_WAITING"].reduce((a,s)=>a+count(s),0), inDesign: count("IN_DESIGN"), done: count("DESIGN_DONE")}; }, [all]);
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Card title="Total Jobs" value={stats.total} sub="Assigned/visible" onClick={()=>navigate('/app/designer/overview')} /><Card title="Queue" value={stats.queue} sub="Pending / waiting" onClick={()=>navigate('/app/designer/queue')} /><Card title="In Design" value={stats.inDesign} sub="Active work" onClick={()=>navigate('/app/designer/in-design')} /><Card title="Completed" value={stats.done} sub="Design done" onClick={()=>navigate('/app/designer/completed')} /></div>;
}
