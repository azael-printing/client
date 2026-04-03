import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listJobsByStatus } from "../../api/cs.api";
import CSJobControlPanel from "./CSJobControlPanel";
import { RoleStatCard } from "../../../components/common/rolePageUi";

export default function CSOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/cs")
    ? "/app/admin/cs"
    : "/app/cs";
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
    const count = (status) => all.filter((job) => job.status === status).length;

    return {
      total: all.length,
      waitingFinance: count("FINANCE_WAITING_APPROVAL") + count("NEW_REQUEST"),
      inDesign: ["DESIGN_PENDING", "DESIGN_WAITING", "IN_DESIGN", "DESIGN_DONE"].reduce(
        (sum, status) => sum + count(status),
        0,
      ),
      inProduction: [
        "PRODUCTION_PENDING",
        "PRODUCTION_WAITING",
        "IN_PRODUCTION",
        "PRODUCTION_DONE",
      ].reduce((sum, status) => sum + count(status), 0),
    };
  }, [all]);

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <RoleStatCard
          title="Total Jobs"
          value={stats.total}
          sub="All CS jobs"
          onClick={() => navigate(`${basePath}/jobs`)}
        />
        <RoleStatCard
          title="Finance Waiting"
          value={stats.waitingFinance}
          sub="Pending approval"
          onClick={() => navigate(`${basePath}/new`)}
        />
        <RoleStatCard
          title="In Design"
          value={stats.inDesign}
          sub="Design pipeline"
          onClick={() => navigate(`${basePath}/design`)}
        />
        <RoleStatCard
          title="In Production"
          value={stats.inProduction}
          sub="Production pipeline"
          onClick={() => navigate(`${basePath}/production`)}
        />
      </div>

      <div className="grid grid-cols-1">
        <CSJobControlPanel />
      </div>
    </div>
  );
}
