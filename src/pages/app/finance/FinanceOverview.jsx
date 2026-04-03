import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listFinanceJobs } from "../../api/finance.api";
import { RoleStatCard } from "../../../components/common/rolePageUi";

export default function FinanceOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app/admin/finance")
    ? "/app/admin/finance"
    : "/app/finance";
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const rows = await listFinanceJobs();
        setJobs(rows || []);
      } catch {
        setJobs([]);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const revenueExVat = jobs.reduce((sum, job) => sum + (Number(job.subtotal) || 0), 0);
    const vatTotal = jobs.reduce((sum, job) => sum + (Number(job.vatAmount) || 0), 0);
    const paid = jobs.reduce(
      (sum, job) => sum + (Number(job.total) - Number(job.remainingBalance || 0)),
      0,
    );
    const outstanding = jobs.reduce(
      (sum, job) => sum + (Number(job.remainingBalance) || 0),
      0,
    );

    const fmt = (value) => `ETB ${Math.round(value).toLocaleString()}`;

    return {
      revenueExVat: fmt(revenueExVat),
      vatTotal: fmt(vatTotal),
      paid: fmt(paid),
      outstanding: fmt(outstanding),
    };
  }, [jobs]);

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <RoleStatCard
          title="Net Revenue"
          value={stats.revenueExVat}
          sub="Excl VAT"
          onClick={() => navigate(`${basePath}/revenue/overview`)}
        />
        <RoleStatCard
          title="VAT Total"
          value={stats.vatTotal}
          sub="15% VAT"
          onClick={() => navigate(`${basePath}/revenue/overview`)}
        />
        <RoleStatCard
          title="Paid"
          value={stats.paid}
          sub="Collected"
          onClick={() => navigate(`${basePath}/revenue/invoice`)}
        />
        <RoleStatCard
          title="Outstanding"
          value={stats.outstanding}
          sub="Remaining"
          onClick={() => navigate(`${basePath}/revenue/overdue`)}
        />
      </div>
    </div>
  );
}
