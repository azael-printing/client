// useLiveDashboardMeta.js
import { useEffect, useState } from "react";
import { myNotifications } from "../../pages/api/notifications.api";
import { listDesignerJobsByStatus } from "../../pages/api/designer.api";
import { listOperatorJobsByStatus } from "../../pages/api/operator.api";
import { listFinanceJobs } from "../../pages/api/finance.api";

function countByStatuses(jobs, statuses) {
  return (jobs || []).filter((j) => statuses.includes(String(j.status || "")))
    .length;
}

export function useLiveDashboardMeta(role) {
  const [unread, setUnread] = useState(0);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const notifs = await myNotifications();
        if (alive) setUnread((notifs || []).filter((n) => !n.isRead).length);
      } catch {
        if (alive) setUnread(0);
      }

      try {
        let jobs = [];
        if (role === "DESIGNER") jobs = await listDesignerJobsByStatus();
        else if (role === "OPERATOR") jobs = await listOperatorJobsByStatus();
        else if (role === "FINANCE") jobs = await listFinanceJobs();

        if (!alive) return;

        if (role === "DESIGNER") {
          setCounts({
            queue: countByStatuses(jobs, [
              "DESIGN_ASSIGNED",
              "DESIGN_PENDING",
              "DESIGN_WAITING",
            ]),
            inDesign: countByStatuses(jobs, ["IN_DESIGN"]),
            completed: countByStatuses(jobs, ["DESIGN_DONE"]),
            audit: 0,
          });
        } else if (role === "OPERATOR") {
          setCounts({
            queue: countByStatuses(jobs, [
              "PRODUCTION_READY",
              "PRODUCTION_PENDING",
              "PRODUCTION_WAITING",
            ]),
            inProduction: countByStatuses(jobs, ["IN_PRODUCTION"]),
            completed: countByStatuses(jobs, [
              "PRODUCTION_DONE",
              "READY_FOR_DELIVERY",
              "DELIVERED",
            ]),
            audit: 0,
          });
        } else if (role === "FINANCE") {
          setCounts({
            waiting: countByStatuses(jobs, [
              "NEW_REQUEST",
              "FINANCE_WAITING_APPROVAL",
            ]),
            done: countByStatuses(jobs, [
              "FINANCE_APPROVED",
              "DESIGN_ASSIGNED",
              "IN_DESIGN",
              "DESIGN_DONE",
              "PRODUCTION_READY",
              "IN_PRODUCTION",
              "PRODUCTION_DONE",
              "READY_FOR_DELIVERY",
              "DELIVERED",
            ]),
            jobs: (jobs || []).length,
            audit: 0,
          });
        }
      } catch {
        if (!alive) return;
        if (role === "DESIGNER")
          setCounts({ queue: 0, inDesign: 0, completed: 0, audit: 0 });
        if (role === "OPERATOR")
          setCounts({ queue: 0, inProduction: 0, completed: 0, audit: 0 });
        if (role === "FINANCE")
          setCounts({ waiting: 0, done: 0, jobs: 0, audit: 0 });
      }
    }

    load();
    const t = setInterval(load, 3000);

    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [role]);

  return { unread, counts };
}
