import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import NotificationsPanel from "../app/NotificationsPanel";
import { http } from "../../pages/api/http";
import { useInterval } from "../../app/hooks/useInterval";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

const navClass = ({ isActive }) =>
  cn(
    "group flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300",
    isActive
      ? "bg-bgLight text-primary shadow-sm"
      : "text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm",
  );

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
    case "dash":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
        </svg>
      );
    case "jobs":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 4h16v16H4z" />
          <path d="M8 8h8M8 12h8M8 16h6" />
        </svg>
      );
    case "create":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "money":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 6h16v12H4z" />
          <path d="M12 9a3 3 0 100 6 3 3 0 000-6z" />
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

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const [financeOpen, setFinanceOpen] = useState(false);

  // desktop sidebar
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  // mobile sidebar
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const mainRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

  const [machines, setMachines] = useState([]);

  useEffect(() => {
    if (location.pathname.startsWith("/app/admin/finance")) {
      setFinanceOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  async function loadUnread() {
    try {
      const res = await http.get("/api/notifications/me");
      const list = res.data.notifications || [];
      setUnread(list.filter((n) => !n.isRead).length);
    } catch {
      setUnread(0);
    }
  }

  async function loadMachineOverview() {
    try {
      const res = await http.get("/api/admin/machine-overview");
      setMachines(res.data.machines || []);
    } catch {
      // keep last good state
    }
  }

  useEffect(() => {
    loadUnread();
    loadMachineOverview();
  }, []);

  useInterval(loadUnread, 3000);
  useInterval(loadMachineOverview, 5000);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function confirmLeaveHome() {
    const ok = window.confirm("Are you sure you need to leave this page?");
    if (ok) navigate("/", { replace: false });
  }

  function onMainScroll() {
    const el = mainRef.current;
    if (!el) return;
    setShowTop(el.scrollTop > 500);
  }

  function backToTop() {
    const el = mainRef.current;
    if (!el) return;
    el.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleSidebar() {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen((v) => !v);
    } else {
      setDesktopSidebarOpen((v) => !v);
    }
  }

  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/app/admin" className={navClass} end>
        <span className="text-primary shrink-0">
          <Icon name="dash" />
        </span>
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/app/admin/create-order" className={navClass}>
        <span className="text-primary shrink-0">
          <Icon name="create" />
        </span>
        <span>Create Order</span>
      </NavLink>

      <NavLink to="/app/admin/jobs" className={navClass}>
        <span className="text-primary shrink-0">
          <Icon name="jobs" />
        </span>
        <span>Jobs Dashboard</span>
      </NavLink>

      <NavLink to="/app/admin/proforma" className={navClass}>
        <span className="text-primary shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1z" />
            <path d="M9 7h6M9 11h6M9 15h6" />
          </svg>
        </span>
        <span>Generate Proforma</span>
      </NavLink>

      <NavLink to="/app/admin/invoice" className={navClass}>
        <span className="text-primary shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1z" />
            <path d="M9 7h6M9 11h6M9 15h6" />
            <path d="M8 19h8" />
          </svg>
        </span>
        <span>Generate Invoice</span>
      </NavLink>

      <button
        onClick={() => setFinanceOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 text-left",
          location.pathname.startsWith("/app/admin/finance")
            ? "bg-bgLight text-primary shadow-sm"
            : "text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm",
        )}
      >
        <span className="text-primary shrink-0">
          <Icon name="money" />
        </span>
        <span className="flex-1">Finance Report</span>
        <span className="ml-auto text-zinc-400 text-xs">
          {financeOpen ? "▾" : "▸"}
        </span>
      </button>

      {financeOpen && (
        <div className="ml-6 mt-1 space-y-1">
          <NavLink to="/app/admin/finance/overview" className={navClass} end>
            <span className="text-primary shrink-0">
              <Icon name="dash" />
            </span>
            <span>Overview</span>
          </NavLink>

          <NavLink to="/app/admin/finance/revenue" className={navClass}>
            <span className="text-primary shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 17l6-6 4 4 7-7" />
                <path d="M14 8h6v6" />
              </svg>
            </span>
            <span>Revenue</span>
          </NavLink>

          <NavLink to="/app/admin/finance/expenses" className={navClass}>
            <span className="text-primary shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1z" />
                <path d="M9 7h6M9 11h6M9 15h6" />
              </svg>
            </span>
            <span>Expenses</span>
          </NavLink>

          <NavLink to="/app/admin/finance/audit" className={navClass}>
            <span className="text-primary shrink-0">
              <Icon name="jobs" />
            </span>
            <span>Audit Log</span>
          </NavLink>

          <NavLink to="/app/admin/finance/jobs" className={navClass}>
            <span className="text-primary shrink-0">
              <Icon name="jobs" />
            </span>
            <span>Jobs</span>
          </NavLink>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-5 w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-sm text-red-600 transition-all duration-300 hover:bg-red-50 hover:-translate-y-0.5 hover:shadow-sm text-left"
      >
        <Icon name="logout" className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </nav>
  );

  return (
    <div className="h-screen bg-bgLight overflow-hidden">
      {/* TOP BAR */}
      <div className="sticky top-0 z-40 h-14 sm:h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-3 sm:px-5 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center transition-all duration-300 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm"
            aria-label="Toggle sidebar"
          >
            <Icon name="menu" />
          </button>

          <button onClick={confirmLeaveHome} className="flex items-center">
            <img src="/logo.png" alt="Azael" className="h-8 sm:h-10 w-auto" />
          </button>
        </div>

        <div className="hidden sm:block text-primary font-bold tracking-wide text-sm sm:text-lg lg:text-xl truncate">
          ADMIN DASHBOARD
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setNotifOpen(true)}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center transition-all duration-300 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm"
            aria-label="Notifications"
          >
            <Icon name="bell" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full">
                {unread}
              </span>
            )}
          </button>

          <div className="text-right leading-tight hidden sm:block">
            <div className="font-bold text-zinc-900 text-sm">
              {user?.username || "admin"}
              <span className="ml-2 text-zinc-400 font-bold">
                {user?.role ? `· ${user.role}` : ""}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 text-xs font-bold hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)]">
        {/* DESKTOP SIDEBAR */}
        <aside
          className={cn(
            "hidden lg:block bg-white border-r border-zinc-200 h-full overflow-hidden transition-all duration-300",
            desktopSidebarOpen ? "w-[270px] p-3" : "w-0 p-0 border-r-0",
          )}
        >
          {desktopSidebarOpen && sidebarContent}
        </aside>

        {/* MAIN */}
        <main
          ref={mainRef}
          onScroll={onMainScroll}
          className="flex-1 overflow-auto p-2 sm:p-3 md:p-4"
        >
          <Outlet context={{ machines }} />

          {showTop && (
            <button
              onClick={backToTop}
              className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 bg-primary text-white text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:opacity-95"
            >
              Back to top ↑
            </button>
          )}
        </main>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-all duration-300",
          mobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/30 transition-opacity duration-300",
            mobileSidebarOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileSidebarOpen(false)}
        />

        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-[280px] bg-white border-r border-zinc-200 p-3 shadow-2xl transition-transform duration-300",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebarContent}
        </aside>
      </div>

      {/* NOTIFICATIONS DRAWER */}
      {notifOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setNotifOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[460px] bg-white border-l border-zinc-200 p-4 overflow-auto">
            <div className="flex items-center justify-between">
              <div className="font-bold text-primary text-lg sm:text-xl">
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
              <NotificationsPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
