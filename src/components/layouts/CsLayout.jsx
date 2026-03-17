import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import NotificationsPanel from "../../components/app/NotificationsPanel";
import { useAuth } from "../../app/providers/AuthProvider";
import { myNotifications } from "../../pages/api/notifications.api";
import { listJobs } from "../../pages/api/jobs.api";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Icon({ name, className = "w-5 h-5" }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "menu":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
        </svg>
      );
    case "inbox":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 4h16v12H4z" />
          <path d="M4 16h5l2 3h2l2-3h5" />
        </svg>
      );
    case "pen":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      );
    case "gear":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 15.5A3.5 3.5 0 1012 8.5a3.5 3.5 0 000 7z" />
          <path d="M19.4 15a7.7 7.7 0 000-6l2-1-2-4-2.3 1a8 8 0 00-5.2-3L11 1H7l-.9 2a8 8 0 00-5.2 3L-1.2 5-3 9l2 1a7.7 7.7 0 000 6l-2 1 2 4 2.3-1a8 8 0 005.2 3L7 23h4l.9-2a8 8 0 005.2-3l2.3 1 2-4-2-1z" />
        </svg>
      );
    case "check":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "log":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 4h16v16H4z" />
          <path d="M8 8h8M8 12h8M8 16h6" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M21 3v18" />
        </svg>
      );
    default:
      return null;
  }
}

function BadgeCount({ n }) {
  if (!n) return null;
  return (
    <span className="ml-auto px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">
      {n}
    </span>
  );
}

export default function CSLayout() {
  const [desktopSidebarOpen, setDesktopSideOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [unread, setUnread] = useState(0);
  const [counts, setCounts] = useState({
    new: 0,
    design: 0,
    production: 0,
    completed: 0,
    audit: 0,
  });

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation();

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
        if (
          j.status === "NEW_REQUEST" ||
          j.status === "FINANCE_WAITING_APPROVAL"
        )
          c.new++;
        else if (
          [
            "DESIGN_ASSIGNED",
            "DESIGN_PENDING",
            "DESIGN_WAITING",
            "IN_DESIGN",
            "DESIGN_DONE",
          ].includes(j.status)
        )
          c.design++;
        else if (
          [
            "PRODUCTION_PENDING",
            "PRODUCTION_WAITING",
            "IN_PRODUCTION",
            "PRODUCTION_DONE",
          ].includes(j.status)
        )
          c.production++;
        else if (["READY_FOR_DELIVERY", "DELIVERED"].includes(j.status))
          c.completed++;
      }

      setCounts(c);
    } catch {
      // keep previous counts
    }
  }

  useEffect(() => {
    loadCounts();
    const t = setInterval(loadCounts, 3000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const navItems = useMemo(
    () => [
      { to: "/app/cs/overview", label: "CS Overview ", icon: "grid", badge: 0 },
      {
        to: "/app/cs/new",
        label: "New Requests",
        icon: "inbox",
        badge: counts.new,
      },
      {
        to: "/app/cs/design",
        label: "In Design",
        icon: "pen",
        badge: counts.design,
      },
      {
        to: "/app/cs/production",
        label: "In Production",
        icon: "gear",
        badge: counts.production,
      },
      {
        to: "/app/cs/completed",
        label: "Completed",
        icon: "check",
        badge: counts.completed,
      },
      {
        to: "/app/cs/audit",
        label: "Audit Log",
        icon: "log",
        badge: counts.audit,
      },
    ],
    [counts],
  );

  // Sticky layout: header + sidebar fixed, main scroll
  return (
    <div className="h-screen bg-bgLight flex flex-col">
      {/* TOP BAR (sticky) */}
      <div className="sticky top-0 z-40 h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-3 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSidebarOpen((v) => !v);
              setDesktopSideOpen((v) => !v);
            }}
            className="w-11 h-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-bgLight transition"
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>

          <button
            onClick={() => {
              if (confirm("Are you sure you need to leave this page?"))
                navigate("/");
            }}
            className="flex items-center gap-2"
          >
            <img src="/logo.png" alt="Azael" className="h-10 w-auto" />
          </button>
        </div>

        <div className="text-primary font-bold tracking-wide text-lg sm:text-xl">
          CUSTOMER SERVICE
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => setNotifOpen(true)}
            className="relative w-11 h-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-bgLight transition"
            aria-label="Notifications"
          >
            <Icon name="bell" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5">
                {unread}
              </span>
            )}
          </button>

          <div className="text-right leading-tight">
            <div className="font-bold text-zinc-900">
              {user?.username || "CS"}
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 font-bold hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1 min-h-0">
        {/* SIDEBAR (sticky) */}
        <aside
          className={cn(
            "bg-white border-r border-zinc-200 p-4 w-72 shrink-0",
            "hidden md:block",
            desktopSidebarOpen ? "md:block" : "md:hidden",
          )}
        >
          <nav className="space-y-2">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition",
                    isActive
                      ? "bg-bgLight text-primary"
                      : "text-zinc-900 hover:bg-bgLight",
                  )
                }
              >
                <span className="text-primary">
                  <Icon name={it.icon} />
                </span>
                <span>{it.label}</span>
                <BadgeCount n={it.badge} />
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition"
          >
            <Icon name="logout" className="w-5 h-5" />
            Logout
          </button>
        </aside>

        {/* MOBILE DRAWER */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 bg-white border-r border-zinc-200 p-4">
              <div className="flex items-center justify-between">
                <img src="/logo.png" alt="Azael" className="h-10 w-auto" />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="px-3 py-2 rounded-xl border border-zinc-200 font-bold"
                >
                  Close
                </button>
              </div>

              <nav className="mt-4 space-y-2">
                {navItems.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition",
                        isActive
                          ? "bg-bgLight text-primary"
                          : "text-zinc-900 hover:bg-bgLight",
                      )
                    }
                  >
                    <span className="text-primary">
                      <Icon name={it.icon} />
                    </span>
                    <span>{it.label}</span>
                    <BadgeCount n={it.badge} />
                  </NavLink>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="mt-10 w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition"
              >
                <Icon name="logout" className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* MAIN (smooth scroll only here) */}
        <main className="flex-1 min-h-0 overflow-y-auto scroll-smooth p-4 sm:p-6">
          <Outlet />
          {/* back to top */}
          <div className="h-10" />
          <button
            onClick={() => {
              document
                .querySelector("main")
                ?.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-primary text-white font-bold shadow-lg hover:opacity-90"
          >
            ↑
          </button>
        </main>
      </div>

      {/* NOTIFICATIONS DRAWER */}
      {notifOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setNotifOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white border-l border-zinc-200 p-4 overflow-auto">
            <div className="flex items-center justify-between">
              <div className="font-bold text-primary text-xl">
                Notifications
              </div>
              <button
                onClick={() => setNotifOpen(false)}
                className="px-3 py-2 rounded-xl border border-zinc-200 font-bold hover:bg-bgLight"
              >
                Close
              </button>
            </div>
            <div className="mt-4">
              <NotificationsPanel
                onOpenTarget={({ path, jobId }) => {
                  setNotifOpen(false); // auto-close drawer
                  if (jobId)
                    navigate(`${path}?jobID=${encodeURIComponent(jobId)}`);
                  else navigate(path);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
