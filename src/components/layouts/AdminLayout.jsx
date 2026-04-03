import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { useDialog } from "../common/DialogProvider";
import NotificationsPanel from "../app/NotificationsPanel";
import { http } from "../../pages/api/http";
import { triggerNotificationAlert } from "../../utils/notificationSound";
import { useInterval } from "../../app/hooks/useInterval";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

const navClass = ({ isActive }) =>
  cn(
    "group flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-bold text-[13px] transition-all duration-300",
    isActive
      ? "bg-bgLight text-primary shadow-sm"
      : "text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm",
  );

function Icon({ name, className = "w-[18px] h-[18px]" }) {
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

    case "trend":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M3 17l6-6 4 4 7-7" />
          <path d="M14 8h6v6" />
        </svg>
      );

    case "receipt":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1z" />
          <path d="M9 7h6M9 11h6M9 15h6" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );

    case "audit":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 4h16v16H4z" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );

    case "chevronDown":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
      );

    case "chevronRight":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" />
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
  const dialog = useDialog();

  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const unreadIdsRef = useRef(null);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [financeRevenueOpen, setFinanceRevenueOpen] = useState(false);
  const [financeExpenseOpen, setFinanceExpenseOpen] = useState(false);
  const [financeJobsOpen, setFinanceJobsOpen] = useState(false);
  const [csOpen, setCsOpen] = useState(false);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [operatorOpen, setOperatorOpen] = useState(false);

  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const mainRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

  const [machines, setMachines] = useState([]);

  useEffect(() => {
    if (location.pathname.startsWith("/app/admin/finance")) setFinanceOpen(true);
    if (location.pathname.includes("/app/admin/finance/revenue")) setFinanceRevenueOpen(true);
    if (location.pathname.includes("/app/admin/finance/expenses")) setFinanceExpenseOpen(true);
    if (location.pathname.includes("/app/admin/finance/jobs")) setFinanceJobsOpen(true);
    if (location.pathname.startsWith("/app/admin/cs")) setCsOpen(true);
    if (location.pathname.startsWith("/app/admin/designer")) setDesignerOpen(true);
    if (location.pathname.startsWith("/app/admin/operator")) setOperatorOpen(true);
  }, [location.pathname]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  async function loadUnread() {
    try {
      const res = await http.get("/api/notifications/me");
      const list = res.data.notifications || [];
      const unreadItems = list.filter((n) => !n.isRead);
      const nextIds = new Set(unreadItems.map((n) => n.id));

      if (unreadIdsRef.current) {
        const fresh = unreadItems.find((n) => !unreadIdsRef.current.has(n.id));
        if (fresh) {
          playNotificationSound();
          emitAppToast(fresh.message || "New notification received", "info");
        }
      }

      unreadIdsRef.current = nextIds;
      setUnread(unreadItems.length);
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

  async function confirmLeaveHome() {
    const ok = await dialog.confirm("Are you sure you need to leave this page?");
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
    <nav className="space-y-1.5">
      <NavLink to="/app/admin" className={navClass} end>
        <span className="text-primary shrink-0">
          <Icon name="dash" />
        </span>
        <span className="truncate">Dashboard</span>
      </NavLink>

      <NavLink to="/app/admin/create-order" className={navClass}>
        <span className="text-primary shrink-0">
          <Icon name="create" />
        </span>
        <span className="truncate">Create Order</span>
      </NavLink>

      <NavLink to="/app/admin/jobs" className={navClass}>
        <span className="text-primary shrink-0">
          <Icon name="jobs" />
        </span>
        <span className="truncate">Jobs Dashboard</span>
      </NavLink>

      <NavLink to="/app/admin/proforma" className={navClass}>
        <span className="text-primary shrink-0">
          <Icon name="receipt" />
        </span>
        <span className="truncate">Generate Proforma</span>
      </NavLink>

      <NavLink to="/app/admin/invoice" className={navClass}>
        <span className="text-primary shrink-0">
          <Icon name="receipt" />
        </span>
        <span className="truncate">Generate Invoice</span>
      </NavLink>

      <button
        onClick={() => setFinanceOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-bold text-[13px] transition-all duration-300 text-left",
          location.pathname.startsWith("/app/admin/finance")
            ? "bg-bgLight text-primary shadow-sm"
            : "text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm",
        )}
      >
        <span className="text-primary shrink-0">
          <Icon name="money" />
        </span>
        <span className="flex-1 truncate">Finance </span>
        <span className="ml-auto text-zinc-400">
          <Icon
            name={financeOpen ? "chevronDown" : "chevronRight"}
            className="w-4 h-4"
          />
        </span>
      </button>

      {financeOpen && (
        <div className="ml-5 mt-1 space-y-1">
          <NavLink to="/app/admin/finance/overview" className={navClass} end><span className="text-primary shrink-0"><Icon name="dash" /></span><span className="truncate">Overview</span></NavLink>

          <button onClick={() => setFinanceRevenueOpen((v) => !v)} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-bold text-[13px] text-left text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm">
            <span className="text-primary shrink-0"><Icon name="trend" /></span>
            <span className="flex-1 truncate">Revenue</span>
            <Icon name={financeRevenueOpen ? "chevronDown" : "chevronRight"} className="w-4 h-4 text-zinc-400" />
          </button>
          {financeRevenueOpen && <div className="ml-5 space-y-1"><NavLink to="/app/admin/finance/revenue/overview" className={navClass}><span className="text-primary shrink-0"><Icon name="dash" /></span><span className="truncate">Overview</span></NavLink><NavLink to="/app/admin/finance/revenue/invoice" className={navClass}><span className="text-primary shrink-0"><Icon name="receipt" /></span><span className="truncate">Invoice</span></NavLink><NavLink to="/app/admin/finance/revenue/overdue" className={navClass}><span className="text-primary shrink-0"><Icon name="clock" /></span><span className="truncate">Overdue</span></NavLink></div>}

          <button onClick={() => setFinanceExpenseOpen((v) => !v)} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-bold text-[13px] text-left text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm">
            <span className="text-primary shrink-0"><Icon name="receipt" /></span>
            <span className="flex-1 truncate">Expense</span>
            <Icon name={financeExpenseOpen ? "chevronDown" : "chevronRight"} className="w-4 h-4 text-zinc-400" />
          </button>
          {financeExpenseOpen && <div className="ml-5 space-y-1"><NavLink to="/app/admin/finance/expenses/overview" className={navClass}><span className="text-primary shrink-0"><Icon name="dash" /></span><span className="truncate">Overview</span></NavLink><NavLink to="/app/admin/finance/expenses/register" className={navClass}><span className="text-primary shrink-0"><Icon name="create" /></span><span className="truncate">Register Expenses</span></NavLink><NavLink to="/app/admin/finance/expenses/report" className={navClass}><span className="text-primary shrink-0"><Icon name="audit" /></span><span className="truncate">Expense Report</span></NavLink></div>}

          <button onClick={() => setFinanceJobsOpen((v) => !v)} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-bold text-[13px] text-left text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm">
            <span className="text-primary shrink-0"><Icon name="jobs" /></span>
            <span className="flex-1 truncate">Jobs</span>
            <Icon name={financeJobsOpen ? "chevronDown" : "chevronRight"} className="w-4 h-4 text-zinc-400" />
          </button>
          {financeJobsOpen && <div className="ml-5 space-y-1"><NavLink to="/app/admin/finance/jobs/waiting" className={navClass}><span className="text-primary shrink-0"><Icon name="clock" /></span><span className="truncate">Waiting Approval</span></NavLink><NavLink to="/app/admin/finance/jobs/done" className={navClass}><span className="text-primary shrink-0"><Icon name="check" /></span><span className="truncate">Done Tracking</span></NavLink></div>}
        </div>
      )}

      <button
        onClick={() => setCsOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-bold text-[13px] transition-all duration-300 text-left",
          location.pathname.startsWith("/app/admin/cs")
            ? "bg-bgLight text-primary shadow-sm"
            : "text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm",
        )}
      >
        <span className="text-primary shrink-0">
          <Icon name="jobs" />
        </span>
        <span className="flex-1 truncate">Customer Service</span>
        <span className="ml-auto text-zinc-400">
          <Icon name={csOpen ? "chevronDown" : "chevronRight"} className="w-4 h-4" />
        </span>
      </button>

      {csOpen && (
        <div className="ml-5 mt-1 space-y-1">
          <NavLink to="/app/admin/cs/overview" className={navClass}><span className="text-primary shrink-0"><Icon name="dash" /></span><span className="truncate">Overview</span></NavLink>
          <NavLink to="/app/admin/cs/new" className={navClass}><span className="text-primary shrink-0"><Icon name="receipt" /></span><span className="truncate">New Requests</span></NavLink>
          <NavLink to="/app/admin/cs/design" className={navClass}><span className="text-primary shrink-0"><Icon name="receipt" /></span><span className="truncate">In Design</span></NavLink>
          <NavLink to="/app/admin/cs/production" className={navClass}><span className="text-primary shrink-0"><Icon name="receipt" /></span><span className="truncate">In Production</span></NavLink>
          <NavLink to="/app/admin/cs/completed" className={navClass}><span className="text-primary shrink-0"><Icon name="check" /></span><span className="truncate">Completed</span></NavLink>
        </div>
      )}

      <button
        onClick={() => setDesignerOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-bold text-[13px] transition-all duration-300 text-left",
          location.pathname.startsWith("/app/admin/designer")
            ? "bg-bgLight text-primary shadow-sm"
            : "text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm",
        )}
      >
        <span className="text-primary shrink-0">
          <Icon name="receipt" />
        </span>
        <span className="flex-1 truncate">Designer</span>
        <span className="ml-auto text-zinc-400">
          <Icon name={designerOpen ? "chevronDown" : "chevronRight"} className="w-4 h-4" />
        </span>
      </button>

      {designerOpen && (
        <div className="ml-5 mt-1 space-y-1">
          <NavLink to="/app/admin/designer/overview" className={navClass}><span className="text-primary shrink-0"><Icon name="dash" /></span><span className="truncate">Overview</span></NavLink>
          <NavLink to="/app/admin/designer/queue" className={navClass}><span className="text-primary shrink-0"><Icon name="clock" /></span><span className="truncate">Queue</span></NavLink>
          <NavLink to="/app/admin/designer/in-design" className={navClass}><span className="text-primary shrink-0"><Icon name="trend" /></span><span className="truncate">In Design</span></NavLink>
          <NavLink to="/app/admin/designer/completed" className={navClass}><span className="text-primary shrink-0"><Icon name="check" /></span><span className="truncate">Completed</span></NavLink>
        </div>
      )}

      <button
        onClick={() => setOperatorOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-bold text-[13px] transition-all duration-300 text-left",
          location.pathname.startsWith("/app/admin/operator")
            ? "bg-bgLight text-primary shadow-sm"
            : "text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm",
        )}
      >
        <span className="text-primary shrink-0">
          <Icon name="jobs" />
        </span>
        <span className="flex-1 truncate">Operator</span>
        <span className="ml-auto text-zinc-400">
          <Icon name={operatorOpen ? "chevronDown" : "chevronRight"} className="w-4 h-4" />
        </span>
      </button>

      {operatorOpen && (
        <div className="ml-5 mt-1 space-y-1">
          <NavLink to="/app/admin/operator/overview" className={navClass}><span className="text-primary shrink-0"><Icon name="dash" /></span><span className="truncate">Overview</span></NavLink>
          <NavLink to="/app/admin/operator/queue" className={navClass}><span className="text-primary shrink-0"><Icon name="clock" /></span><span className="truncate">Queue</span></NavLink>
          <NavLink to="/app/admin/operator/in-production" className={navClass}><span className="text-primary shrink-0"><Icon name="trend" /></span><span className="truncate">In Production</span></NavLink>
          <NavLink to="/app/admin/operator/completed" className={navClass}><span className="text-primary shrink-0"><Icon name="check" /></span><span className="truncate">Completed</span></NavLink>
        </div>
      )}

      <NavLink to="/app/admin/history" className={navClass}>
        <span className="text-primary shrink-0">
          <Icon name="audit" />
        </span>
        <span className="truncate">History Log</span>
      </NavLink>

      <button
        onClick={handleLogout}
        className="mt-4 w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-bold text-[13px] text-red-600 transition-all duration-300 hover:bg-red-50 hover:-translate-y-0.5 hover:shadow-sm text-left"
      >
        <Icon name="logout" className="w-[18px] h-[18px]" />
        <span className="truncate">Logout</span>
      </button>
    </nav>
  );

  return (
    <div className="h-screen bg-bgLight overflow-hidden">
      <div className="sticky top-0 z-40 h-12 sm:h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-2.5 sm:px-4 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-zinc-200 bg-white flex items-center justify-center transition-all duration-300 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm"
            aria-label="Toggle sidebar"
          >
            <Icon name="menu" className="w-5 h-5" />
          </button>

          <button
            onClick={confirmLeaveHome}
            className="flex items-center min-w-0"
          >
            <img
              src="/logo.png"
              alt="Azael"
              className="h-7 sm:h-8 md:h-9 w-auto"
            />
          </button>
        </div>

        <div className="hidden sm:block text-primary font-bold tracking-wide text-sm lg:text-lg truncate">
          ADMIN DASHBOARD
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setNotifOpen(true)}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-zinc-200 bg-white flex items-center justify-center transition-all duration-300 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm"
            aria-label="Notifications"
          >
            <Icon name="bell" className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 flex items-center justify-center bg-primary text-white text-[9px] font-bold rounded-full">
                {unread}
              </span>
            )}
          </button>

          <div className="text-right leading-tight hidden md:block">
            <div className="font-bold text-zinc-900 text-sm">
              {user?.username || "admin"}
              <span className="ml-1.5 text-zinc-400 font-bold">
                {user?.role ? `· ${user.role}` : ""}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 text-[11px] font-bold hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-48px)] sm:h-[calc(100vh-56px)]">
        <aside
          className={cn(
            "hidden lg:block bg-white border-r border-zinc-200 h-full overflow-y-auto overflow-x-hidden transition-all duration-300",
            desktopSidebarOpen
              ? "w-[220px] xl:w-[232px] p-2.5"
              : "w-0 p-0 border-r-0",
          )}
        >
          {desktopSidebarOpen && sidebarContent}
        </aside>

        <main
          ref={mainRef}
          onScroll={onMainScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth p-1.5 sm:p-3 md:p-4"
        >
          <Outlet context={{ machines }} />

          {showTop && (
            <button
              onClick={backToTop}
              className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 bg-primary text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:opacity-95"
            >
              Back to top ↑
            </button>
          )}
        </main>
      </div>

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
            "absolute left-0 top-0 h-full w-[228px] sm:w-[240px] bg-white border-r border-zinc-200 p-2.5 shadow-2xl overflow-y-auto transition-transform duration-300",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebarContent}
        </aside>
      </div>

      {notifOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setNotifOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white border-l border-zinc-200 p-3 sm:p-4 overflow-y-auto overflow-x-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="font-bold text-primary text-base sm:text-lg">
                Notifications
              </div>
              <button
                onClick={() => setNotifOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 font-bold text-xs sm:text-sm hover:bg-bgLight"
              >
                Close
              </button>
            </div>

            <div className="mt-3 sm:mt-4">
              <NotificationsPanel onOpenTarget={({ path, jobId }) => { setNotifOpen(false); navigate(jobId ? `${path}?jobId=${encodeURIComponent(jobId)}` : path); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
