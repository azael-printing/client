import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import RoleShellLayout from "./RoleShellLayout";
import { useLiveDashboardMeta } from "./useLiveDashboardMeta";

export default function DesignerLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unread, counts } = useLiveDashboardMeta("DESIGNER");

  const navNodes = useMemo(
    () => [
      { to: "/app/designer/overview", label: "Overview", icon: "grid" },
      { to: "/app/designer/queue", label: "Design Queue", icon: "queue", badge: counts.queue || 0 },
      { to: "/app/designer/in-design", label: "In Design", icon: "pen", badge: counts.inDesign || 0 },
      { to: "/app/designer/completed", label: "Completed", icon: "check", badge: counts.completed || 0 },
      { to: "/app/designer/audit", label: "Audit Log", icon: "log", badge: counts.audit || 0 },
    ],
    [counts],
  );

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <RoleShellLayout
      title="DESIGNER DASHBOARD"
      navNodes={navNodes}
      unread={unread}
      userLabel={user?.username || "Designer"}
      onLogout={handleLogout}
    />
  );
}
