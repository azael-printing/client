import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getAdminDashboard } from "../../api/dashboard.api";
import { useInterval } from "../../../app/hooks/useInterval";

function Pill({ label, count }) {
  return (
    <div className="inline-flex items-center justify-between px-3 py-2 rounded-full bg-zinc-100 text-zinc-700 font-semibold text-xs sm:text-sm">
      <span className="font-semibold">{label}</span>
      <span className="ml-2 px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-800 font-extrabold text-xs">
        {count}
      </span>
    </div>
  );
}

function StatCard({ title, value, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition w-full"
    >
      <div className="text-zinc-400 font-semibold text-sm">{title}</div>

      <div className="mt-2 text-primary text-2xl sm:text-3xl font-extrabold tracking-tight">
        {value}
      </div>

      <div className="mt-1 text-zinc-400 text-xs sm:text-sm font-medium">
        {subtitle}
      </div>
    </button>
  );
}

function Badge({ kind }) {
  const map = {
    Printing: "bg-green-100 text-green-700",
    Setup: "bg-yellow-100 text-yellow-700",
    Idle: "bg-zinc-100 text-zinc-600",
  };
  const cls = map[kind] || map.Idle;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${cls}`}>
      {kind}
    </span>
  );
}
function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}
export default function AdminDashboard() {
  const navigate = useNavigate();

  // machines come from AdminLayout via Outlet context (real-time)
  const { machines = [] } = useOutletContext() || {};

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const d = await getAdminDashboard();
      setData(d);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load dashboard");
      navigate("/login");
    }
  }

  useEffect(() => {
    load();
  }, []);

  // refresh dashboard numbers
  useInterval(load, 5000);

  const cards = data?.cards || {
    activeJobs: 0,
    newRequest: 0,
    monthRevenue: 0,
    outstanding: 0,
  };

  const pipeline = data?.pipelineCounts || {
    NEW_REQUEST: 0,
    IN_DESIGN: 0,
    IN_PRODUCTION: 0,
    DELIVERED: 0,
  };

  const goAdminJobs = () => navigate("/app/admin/jobs");
  // const goAdminCreate = () => navigate("/app/admin/create-order");
  const goAdminFinanceOverview = () => navigate("/app/admin/finance/overview");

  return (
    <div className="grid gap-5">
      <div>
        {err && <div className="mt-4 text-red-600 font-extrabold">{err}</div>}
      </div>
      {/* TOP STATS ROW */}
      <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
        <StatCard
          title="Active Jobs"
          value={cards.activeJobs}
          subtitle="Jobs not yet delivered"
          onClick={goAdminJobs}
        />
        <StatCard
          title="New Request"
          value={cards.newRequest}
          subtitle="New customers order today"
          onClick={() => navigate("/app/admin/jobs?status=NEW_REQUEST")}
        />
        <StatCard
          title="This Month Revenue"
          value={`ETB ${Number(cards.monthRevenue || 0).toLocaleString()}`}
          subtitle="Paid invoice only"
          onClick={goAdminFinanceOverview}
        />
        <StatCard
          title="Outstanding Balance"
          value={`ETB ${Number(cards.outstanding || 0).toLocaleString()}`}
          subtitle="Unpaid across all jobs"
          onClick={goAdminFinanceOverview}
        />
      </div>

      {/* PIPELINE */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-primary font-extrabold text-lg sm:text-xl">
              Current Jobs Pipeline
            </div>
            <div className="text-zinc-400 font-medium text-xs sm:text-sm">
              From New request to Deliver
            </div>
          </div>
          <div className="mt-inherit grid grid-cols-2 gap-3 max-w-[420px]">
            <Pill label="New Request" count={pipeline.NEW_REQUEST} />
            <Pill label="In Production" count={pipeline.IN_PRODUCTION} />
            <Pill label="In Design" count={pipeline.IN_DESIGN} />
            <Pill label="Delivered" count={pipeline.DELIVERED} />
          </div>
          <button
            onClick={goAdminJobs}
            className="shrink-0 px-4 py-2 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 transition"
          >
            Go to JOBS Dashboard
          </button>
        </div>
      </div>

      {/* MACHINE OVERVIEW (REAL DATA from AdminLayout) */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="text-primary font-extrabold text-lg sm:text-xl">
            Machine overview
          </div>
          <div className="text-zinc-400 font-medium text-xs sm:text-sm">
            Live view of the Machines
          </div>
        </div>

        <div className="mt-5 grid gap-4 grid-cols-1 md:grid-cols-2 w-full">
          {machines.map((m) => (
            <button
              key={m.machine}
              onClick={() =>
                navigate(
                  `/app/admin/jobs?machine=${encodeURIComponent(m.machineKey)}`,
                )
              }
              className="w-full text-left rounded-2xl border border-zinc-200 p-4 hover:shadow-md transition bg-white"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-extrabold text-zinc-900 text-sm sm:text-base">
                  {m.machine}
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-extrabold",
                    m.state === "Printing"
                      ? "bg-green-100 text-green-700"
                      : m.state === "Setup"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-zinc-100 text-zinc-600",
                  )}
                >
                  {m.state || "Idle"}
                </span>
              </div>

              {/* ✅ EXACT “Current job” block */}
              <div className="mt-3">
                <div className="text-zinc-500 font-extrabold text-sm">
                  Current job
                </div>

                {m.currentJob ? (
                  <div className="mt-2 grid gap-1 text-sm">
                    <div className="flex gap-2">
                      <span className="font-extrabold text-zinc-700 w-[120px]">
                        Customer name
                      </span>
                      <span className="text-zinc-700 font-medium">
                        {m.currentJob.customerName || "-"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-extrabold text-zinc-700 w-[120px]">
                        Work type
                      </span>
                      <span className="text-zinc-700 font-medium">
                        {m.currentJob.workType || "-"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-extrabold text-zinc-700 w-[120px]">
                        Qty
                      </span>
                      <span className="text-zinc-700 font-medium">
                        {m.currentJob.qty ?? "-"} {m.currentJob.unitType || ""}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-extrabold text-zinc-700 w-[120px]">
                        Urgency level
                      </span>
                      <span className="text-zinc-700 font-medium">
                        {m.currentJob.urgency || "-"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-sm font-bold text-zinc-400">
                    None
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div className="text-zinc-500 font-extrabold">Pending Jobs</div>
                <div className="text-primary font-extrabold text-3xl">
                  {m.pendingJobs ?? 0}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
