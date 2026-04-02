import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotificationsPanel from "../app/NotificationsPanel";
import { useAuth } from "../../app/providers/AuthProvider";
import { useLiveDashboardMeta } from "./useLiveDashboardMeta";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function BadgeCount({ n }) {
  if (!n) return null;
  return (
    <span className="ml-auto px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">
      {n}
    </span>
  );
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
      return <svg {...common} viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
    case "bell":
      return <svg {...common} viewBox="0 0 24 24"><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>;
    case "grid":
      return <svg {...common} viewBox="0 0 24 24"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /></svg>;
    case "dollar":
      return <svg {...common} viewBox="0 0 24 24"><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7H14.5a3.5 3.5 0 010 7H6" /></svg>;
    case "receipt":
      return <svg {...common} viewBox="0 0 24 24"><path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1z" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>;
    case "log":
      return <svg {...common} viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h8M8 16h6" /></svg>;
    case "briefcase":
      return <svg {...common} viewBox="0 0 24 24"><path d="M3 7h18v13H3z" /><path d="M8 7V5h8v2" /></svg>;
    case "clock":
      return <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "check":
      return <svg {...common} viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>;
    case "chevronDown":
      return <svg {...common} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>;
    case "chevronRight":
      return <svg {...common} viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>;
    case "logout":
      return <svg {...common} viewBox="0 0 24 24"><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M21 3v18" /></svg>;
    default:
      return null;
  }
}

function SidebarSection({ label, icon, open, setOpen, active, children }) {
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition text-left",
          active ? "bg-bgLight text-primary" : "text-zinc-900 hover:bg-bgLight",
        )}
      >
        <span className="text-primary"><Icon name={icon} /></span>
        <span>{label}</span>
        <span className="ml-auto text-zinc-400"><Icon name={open ? "chevronDown" : "chevronRight"} className="w-4 h-4" /></span>
      </button>
      {open && <div className="ml-4 mt-1 space-y-1">{children}</div>}
    </div>
  );
}

function NavItem({ to, icon, label, badge, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition",
          isActive ? "bg-bgLight text-primary" : "text-zinc-900 hover:bg-bgLight",
        )
      }
      end
    >
      <span className="text-primary"><Icon name={icon} /></span>
      <span>{label}</span>
      <BadgeCount n={badge} />
    </NavLink>
  );
}

export default function FinanceLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [revenueOpen, setRevenueOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unread, counts } = useLiveDashboardMeta("FINANCE");

  useEffect(() => {
    if (location.pathname.includes("/finance/revenue")) setRevenueOpen(true);
    if (location.pathname.includes("/finance/expenses")) setExpenseOpen(true);
    if (location.pathname.includes("/finance/jobs")) setJobsOpen(true);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const sidebarContent = (closeOnClick = false) => (
    <nav className="space-y-2">
      <NavItem to="/app/finance/overview" icon="grid" label="Overview" onClick={() => closeOnClick && setSidebarOpen(false)} />

      <SidebarSection
        label="Revenue"
        icon="dollar"
        open={revenueOpen}
        setOpen={setRevenueOpen}
        active={location.pathname.includes("/finance/revenue")}
      >
        <NavItem to="/app/finance/revenue/overview" icon="grid" label="Overview" onClick={() => closeOnClick && setSidebarOpen(false)} />
        <NavItem to="/app/finance/revenue/invoice" icon="receipt" label="Invoice" onClick={() => closeOnClick && setSidebarOpen(false)} />
        <NavItem to="/app/finance/revenue/overdue" icon="clock" label="Overdue" onClick={() => closeOnClick && setSidebarOpen(false)} />
      </SidebarSection>

      <SidebarSection
        label="Expense"
        icon="receipt"
        open={expenseOpen}
        setOpen={setExpenseOpen}
        active={location.pathname.includes("/finance/expenses")}
      >
        <NavItem to="/app/finance/expenses/overview" icon="grid" label="Overview" onClick={() => closeOnClick && setSidebarOpen(false)} />
        <NavItem to="/app/finance/expenses/register" icon="receipt" label="Register Expenses" onClick={() => closeOnClick && setSidebarOpen(false)} />
        <NavItem to="/app/finance/expenses/report" icon="log" label="Expense Report" onClick={() => closeOnClick && setSidebarOpen(false)} />
      </SidebarSection>

      <SidebarSection
        label="Jobs"
        icon="briefcase"
        open={jobsOpen}
        setOpen={setJobsOpen}
        active={location.pathname.includes("/finance/jobs")}
      >
        <NavItem to="/app/finance/jobs/list" icon="briefcase" label="Job List" badge={counts.jobs || 0} onClick={() => closeOnClick && setSidebarOpen(false)} />
        <NavItem to="/app/finance/jobs/waiting" icon="clock" label="Waiting Approval" badge={counts.waiting || 0} onClick={() => closeOnClick && setSidebarOpen(false)} />
        <NavItem to="/app/finance/jobs/done" icon="check" label="Done Tracking" badge={counts.done || 0} onClick={() => closeOnClick && setSidebarOpen(false)} />
      </SidebarSection>

      <NavItem to="/app/finance/history" icon="log" label="History Log" badge={counts.audit || 0} onClick={() => closeOnClick && setSidebarOpen(false)} />

      <button onClick={handleLogout} className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold text-red-600 hover:bg-red-50 transition">
        <Icon name="logout" className="w-5 h-5" />
        Logout
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-bgLight">
      <div className="sticky top-0 z-40 h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-3 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen((v) => !v)} className="w-11 h-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-bgLight transition" aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <img src="/logo.png" alt="Azael" className="h-10 w-auto" />
        </div>
        <div className="text-primary font-extrabold tracking-wide text-base sm:text-xl">FINANCE DASHBOARD</div>
        <div className="flex items-center gap-5">
          <button onClick={() => setNotifOpen(true)} className="relative w-11 h-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-bgLight transition" aria-label="Notifications">
            <Icon name="bell" />
            {unread > 0 && <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center">{unread}</span>}
          </button>
          <div className="text-right leading-tight">
            <div className="font-extrabold text-zinc-900">{user?.role || "Finance"}</div>
            <button onClick={handleLogout} className="text-red-600 font-bold hover:underline">Logout</button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="w-72 bg-white border-r border-zinc-200 min-h-[calc(100vh-64px)] p-4 hidden md:block">
          {sidebarContent(false)}
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-white border-r border-zinc-200 p-4">
              <div className="flex items-center justify-between">
                <img src="/logo.png" alt="Azael" className="h-10 w-auto" />
                <button onClick={() => setSidebarOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-200 font-bold">Close</button>
              </div>
              <div className="mt-4">{sidebarContent(true)}</div>
            </div>
          </div>
        )}

        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {notifOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setNotifOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white border-l border-zinc-200 p-4 overflow-auto">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-primary text-xl">Notifications</div>
              <button onClick={() => setNotifOpen(false)} className="px-3 py-2 rounded-xl border border-zinc-200 font-bold hover:bg-bgLight">Close</button>
            </div>
            <div className="mt-4">
              <NotificationsPanel onOpenTarget={({ path, jobId }) => { setNotifOpen(false); navigate(jobId ? `${path}?jobId=${encodeURIComponent(jobId)}` : path); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
