import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getAdminDashboard } from "../../api/dashboard.api";
import { useInterval } from "../../../app/hooks/useInterval";

function Pill({ label, count }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold text-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm hover:border-primary/20">
      <span className="whitespace-nowrap">{label}</span>
      <span className="px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-800 font-semibold text-[11px] min-w-[24px] text-center leading-none">
        {count}
      </span>
    </div>
  );
}

function StatCard({ title, value, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm transition-all duration-300 w-full hover:-translate-y-1 hover:shadow-lg hover:border-primary/20"
    >
      <div className="text-zinc-400 font-semibold text-sm transition-colors duration-300 group-hover:text-zinc-500">
        {title}
      </div>

      <div className="mt-2 text-primary text-[30px] font-semibold tracking-tight leading-tight">
        {value}
      </div>

      <div className="mt-1 text-zinc-400 text-sm font-medium leading-snug">
        {subtitle}
      </div>
    </button>
  );
}

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { machines = [] } = useOutletContext() || {};

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const viewportRef = useRef(null);
  const contentRef = useRef(null);

  const BASE_WIDTH = 1120;
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);

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

  useInterval(load, 5000);

  useLayoutEffect(() => {
    function updateScale() {
      const viewport = viewportRef.current;
      const content = contentRef.current;
      if (!viewport || !content) return;

      const availableWidth = viewport.clientWidth;
      const nextScale = Math.min(1, availableWidth / BASE_WIDTH);

      setScale(nextScale);
      setScaledHeight(content.scrollHeight * nextScale);
    }

    updateScale();

    const ro = new ResizeObserver(() => {
      updateScale();
    });

    if (viewportRef.current) ro.observe(viewportRef.current);
    if (contentRef.current) ro.observe(contentRef.current);

    window.addEventListener("resize", updateScale);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [machines, data]);

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
  const goAdminFinanceOverview = () => navigate("/app/admin/finance/overview");

  return (
    <div ref={viewportRef} className="w-full">
      <div
        className="relative"
        style={{
          height: scaledHeight ? `${scaledHeight}px` : "auto",
        }}
      >
        <div
          ref={contentRef}
          className="origin-top-left"
          style={{
            width: `${BASE_WIDTH}px`,
            transform: `scale(${scale})`,
          }}
        >
          <div className="grid gap-5">
            <h1 className="ml-1 text-primary font-semibold text-xl">
              Quick Start
            </h1>

            {err && (
              <div className="text-red-600 font-semibold text-sm">{err}</div>
            )}

            {/* TOP STATS ROW - ALWAYS 4 COLUMNS */}
            <div className="grid grid-cols-4 gap-4">
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

            {/* PIPELINE - KEEP SAME SHAPE */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
              <div className="grid grid-cols-[1fr_420px_180px] items-start gap-4">
                <div>
                  <div className="text-primary font-semibold text-[30px] leading-tight">
                    Current Jobs Pipeline
                  </div>
                  <div className="text-zinc-400 font-medium text-sm">
                    From New request to Deliver
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Pill label="New Request" count={pipeline.NEW_REQUEST} />
                  <Pill label="In Production" count={pipeline.IN_PRODUCTION} />
                  <Pill label="In Design" count={pipeline.IN_DESIGN} />
                  <Pill label="Delivered" count={pipeline.DELIVERED} />
                </div>

                <button
                  onClick={goAdminJobs}
                  className="h-[44px] self-center px-4 rounded-xl bg-primary text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95 active:scale-[0.99]"
                >
                  Go to JOBS Dashboard
                </button>
              </div>
            </div>

            {/* MACHINE OVERVIEW - ALWAYS 2 COLUMNS */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10">
              <div>
                <div className="text-primary font-semibold text-[30px]">
                  Machine overview
                </div>
                <div className="text-zinc-400 font-medium text-sm">
                  Live view of the Machines
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                {machines.map((m) => (
                  <button
                    key={m.machine}
                    onClick={() =>
                      navigate(
                        `/app/admin/jobs?machine=${encodeURIComponent(m.machineKey) || m.machine}`,
                      )
                    }
                    className="group w-full text-left rounded-2xl border border-zinc-200 p-4 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 min-h-[220px]"
                  >
                    {/* Machines current status */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-zinc-900 text-xl leading-snug">
                        {m.machine}
                      </div>
                      {/* Machine Value or Data display */}
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold",
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

                    <div className="mt-4">
                      <div className="text-zinc-500 font-semibold text-sm">
                        Current job
                      </div>

                      {m.currentJob ? (
                        <div className="mt-3 grid gap-2 text-sm">
                          <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-semibold text-zinc-700">
                              Customer name
                            </span>
                            <span className="text-zinc-700 font-medium">
                              {m.currentJob.customerName || "-"}
                            </span>
                          </div>

                          <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-semibold text-zinc-700">
                              Work type
                            </span>
                            <span className="text-zinc-700 font-medium">
                              {m.currentJob.workType || "-"}
                            </span>
                          </div>

                          <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-semibold text-zinc-700">
                              Qty
                            </span>
                            <span className="text-zinc-700 font-medium">
                              {m.currentJob.qty ?? "-"}{" "}
                              {m.currentJob.unitType || ""}
                            </span>
                          </div>

                          <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-semibold text-zinc-700">
                              Urgency level
                            </span>
                            <span className="text-zinc-700 font-medium">
                              {m.currentJob.urgency || "-"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 text-sm font-bold text-zinc-400">
                          None -- NJR
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div className="text-zinc-500 font-semibold text-sm">
                        Pending Jobs
                      </div>
                      <div className="text-primary font-semibold text-[34px] leading-none">
                        {m.pendingJobs ?? 0}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
