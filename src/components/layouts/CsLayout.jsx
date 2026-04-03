import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import RoleShellLayout from "./RoleShellLayout";
import { myNotifications } from "../../pages/api/notifications.api";
import { listJobs } from "../../pages/api/jobs.api";

export default function CSLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);
  const [counts, setCounts] = useState({ new: 0, design: 0, production: 0, completed: 0, audit: 0 });

  async function loadCounts() {
    try {
      const notifs = await myNotifications();
      setUnread((notifs || []).filter((n) => !n.isRead).length);
    } catch {
      setUnread(0);
    }

    try {
      const jobs = await listJobs();
      const c = { new: 0, design: 0, production: 0, completed: 0, audit: 0 };

      for (const j of jobs || []) {
        if (["NEW_REQUEST", "FINANCE_WAITING_APPROVAL"].includes(j.status)) c.new++;
        else if (["DESIGN_ASSIGNED", "DESIGN_PENDING", "DESIGN_WAITING", "IN_DESIGN", "DESIGN_DONE"].includes(j.status)) c.design++;
        else if (["PRODUCTION_PENDING", "PRODUCTION_WAITING", "IN_PRODUCTION", "PRODUCTION_DONE"].includes(j.status)) c.production++;
        else if (["READY_FOR_DELIVERY", "DELIVERED"].includes(j.status)) c.completed++;
      }
      setCounts(c);
    } catch {
      // keep last good state
    }
  }

  useEffect(() => {
    loadCounts();
    const t = setInterval(loadCounts, 3000);
    return () => clearInterval(t);
  }, []);

  const navNodes = useMemo(
    () => [
      { to: "/app/cs/overview", label: "CS Overview", icon: "grid" },
      { to: "/app/cs/create-order", label: "Create Order", icon: "plus" },
      { to: "/app/cs/jobs", label: "Jobs Dashboard", icon: "briefcase" },
      { to: "/app/cs/new", label: "New Requests", icon: "inbox", badge: counts.new },
      { to: "/app/cs/design", label: "In Design", icon: "pen", badge: counts.design },
      { to: "/app/cs/production", label: "In Production", icon: "gear", badge: counts.production },
      { to: "/app/cs/completed", label: "Completed", icon: "check", badge: counts.completed },
      { to: "/app/cs/audit", label: "Audit Log", icon: "log", badge: counts.audit },
    ],
    [counts],
  );

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <RoleShellLayout
      title="CUSTOMER SERVICE"
      navNodes={navNodes}
      unread={unread}
      userLabel={user?.username || "Customer Service"}
      onLogout={handleLogout}
    />
  );
}
