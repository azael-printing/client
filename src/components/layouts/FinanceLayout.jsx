import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import RoleShellLayout from "./RoleShellLayout";
import { useLiveDashboardMeta } from "./useLiveDashboardMeta";

export default function FinanceLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unread, counts } = useLiveDashboardMeta("FINANCE");
  const [navNodes, setNavNodes] = useState([]);

  useEffect(() => {
    setNavNodes([
      { to: "/app/finance/overview", label: "Overview", icon: "grid" },
      {
        label: "Revenue",
        icon: "dollar",
        defaultOpen: location.pathname.includes("/finance/revenue"),
        children: [
          { to: "/app/finance/revenue/overview", label: "Overview", icon: "grid" },
          { to: "/app/finance/revenue/invoice", label: "Invoice", icon: "receipt" },
          { to: "/app/finance/revenue/overdue", label: "Overdue", icon: "clock" },
        ],
      },
      {
        label: "Expense",
        icon: "receipt",
        defaultOpen: location.pathname.includes("/finance/expenses"),
        children: [
          { to: "/app/finance/expenses/overview", label: "Overview", icon: "grid" },
          { to: "/app/finance/expenses/register", label: "Register Expenses", icon: "plus" },
          { to: "/app/finance/expenses/report", label: "Expense Report", icon: "log" },
        ],
      },
      {
        label: "Jobs",
        icon: "briefcase",
        defaultOpen: location.pathname.includes("/finance/jobs"),
        children: [
          { to: "/app/finance/jobs/list", label: "Job List", icon: "briefcase", badge: counts.jobs || 0 },
          { to: "/app/finance/jobs/waiting", label: "Waiting Approval", icon: "clock", badge: counts.waiting || 0 },
          { to: "/app/finance/jobs/done", label: "Done Tracking", icon: "check", badge: counts.done || 0 },
        ],
      },
      { to: "/app/finance/history", label: "History Log", icon: "log", badge: counts.audit || 0 },
    ]);
  }, [location.pathname, counts]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <RoleShellLayout
      title="FINANCE DASHBOARD"
      navNodes={navNodes}
      unread={unread}
      userLabel={user?.role || "Finance"}
      onLogout={handleLogout}
    />
  );
}
