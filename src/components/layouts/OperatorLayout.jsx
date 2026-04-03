import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import RoleShellLayout from "./RoleShellLayout";
import { useLiveDashboardMeta } from "./useLiveDashboardMeta";

export default function OperatorLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unread, counts } = useLiveDashboardMeta("OPERATOR");

  const navNodes = useMemo(
    () => [
      { to: "/app/operator/overview", label: "Overview", icon: "grid" },
      { to: "/app/operator/queue", label: "Production Queue", icon: "queue", badge: counts.queue || 0 },
      { to: "/app/operator/in-production", label: "In Production", icon: "gear", badge: counts.inProduction || 0 },
      { to: "/app/operator/completed", label: "Completed", icon: "check", badge: counts.completed || 0 },
      { to: "/app/operator/audit", label: "Audit Log", icon: "log", badge: counts.audit || 0 },
    ],
    [counts],
  );

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <RoleShellLayout
      title="OPERATOR DASHBOARD"
      navNodes={navNodes}
      unread={unread}
      userLabel={user?.username || "Operator"}
      onLogout={handleLogout}
    />
  );
}
