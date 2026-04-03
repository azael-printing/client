import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import NotificationsPanel from "../app/NotificationsPanel";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function BadgeCount({ n }) {
  if (!n) return null;
  return (
    <span className="ml-auto inline-flex min-w-[18px] items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
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
    case "queue":
      return <svg {...common} viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10" /></svg>;
    case "pen":
      return <svg {...common} viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>;
    case "check":
      return <svg {...common} viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>;
    case "log":
      return <svg {...common} viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h8M8 16h6" /></svg>;
    case "logout":
      return <svg {...common} viewBox="0 0 24 24"><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M21 3v18" /></svg>;
    case "inbox":
      return <svg {...common} viewBox="0 0 24 24"><path d="M4 4h16v12H4z" /><path d="M4 16h5l2 3h2l2-3h5" /></svg>;
    case "gear":
      return <svg {...common} viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1012 8.5a3.5 3.5 0 000 7z" /><path d="M19.4 15a7.7 7.7 0 000-6l2-1-2-4-2.3 1a8 8 0 00-5.2-3L11 1H7l-.9 2a8 8 0 00-5.2 3L-1.2 5-3 9l2 1a7.7 7.7 0 000 6l-2 1 2 4 2.3-1a8 8 0 005.2 3L7 23h4l.9-2a8 8 0 005.2-3l2.3 1 2-4-2-1z" /></svg>;
    case "plus":
      return <svg {...common} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>;
    case "briefcase":
      return <svg {...common} viewBox="0 0 24 24"><path d="M3 7h18v13H3z" /><path d="M8 7V5h8v2" /></svg>;
    case "dollar":
      return <svg {...common} viewBox="0 0 24 24"><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7H14.5a3.5 3.5 0 010 7H6" /></svg>;
    case "receipt":
      return <svg {...common} viewBox="0 0 24 24"><path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1z" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>;
    case "clock":
      return <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "chevronDown":
      return <svg {...common} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>;
    case "chevronRight":
      return <svg {...common} viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>;
    default:
      return null;
  }
}

const itemClass = ({ isActive }) =>
  cn(
    "flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-bold transition-all duration-300",
    isActive
      ? "bg-bgLight text-primary shadow-sm"
      : "text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm",
  );

function SidebarNode({ node, mobile = false, closeMobile = () => {} }) {
  const location = useLocation();
  const [open, setOpen] = useState(Boolean(node.defaultOpen));

  const active = useMemo(() => {
    if (node.to) return location.pathname === node.to || location.pathname.startsWith(`${node.to}/`);
    return (node.children || []).some((child) => child.to && (location.pathname === child.to || location.pathname.startsWith(`${child.to}/`)));
  }, [location.pathname, node]);

  if (node.children?.length) {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[13px] font-bold transition-all duration-300",
            active ? "bg-bgLight text-primary shadow-sm" : "text-zinc-900 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm",
          )}
        >
          <span className="text-primary"><Icon name={node.icon} /></span>
          <span>{node.label}</span>
          <span className="ml-auto text-zinc-400"><Icon name={open ? "chevronDown" : "chevronRight"} className="h-4 w-4" /></span>
        </button>
        {open ? (
          <div className="ml-4 mt-1 space-y-1">
            {node.children.map((child) => (
              <SidebarNode key={child.to || child.label} node={child} mobile={mobile} closeMobile={closeMobile} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <NavLink to={node.to} onClick={mobile ? closeMobile : undefined} className={itemClass} end>
      <span className="text-primary"><Icon name={node.icon} /></span>
      <span className="truncate">{node.label}</span>
      <BadgeCount n={node.badge || 0} />
    </NavLink>
  );
}

export default function RoleShellLayout({ title, navNodes, unread = 0, userLabel, onLogout }) {
  const navigate = useNavigate();
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  function toggleSidebar() {
    if (window.innerWidth < 768) setSidebarOpen((v) => !v);
    else setDesktopSidebarOpen((v) => !v);
  }

  const closeMobile = () => setSidebarOpen(false);

  return (
    <div className="h-screen overflow-hidden bg-bgLight">
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-3 shadow-sm sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-bgLight hover:shadow-sm"
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>
          <img src="/logo.png" alt="Azael" className="h-10 w-auto" />
        </div>

        <div className="text-base font-extrabold tracking-wide text-primary sm:text-xl">{title}</div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => setNotifOpen(true)}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-bgLight hover:shadow-sm"
            aria-label="Notifications"
          >
            <Icon name="bell" />
            {unread > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-white">
                {unread}
              </span>
            ) : null}
          </button>

          <div className="text-right leading-tight">
            <div className="font-extrabold text-zinc-900">{userLabel}</div>
            <button onClick={onLogout} className="font-bold text-red-600 transition-all duration-300 hover:underline">Logout</button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "hidden min-h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden border-r border-zinc-200 bg-white transition-all duration-300 md:block",
            desktopSidebarOpen ? "w-72 p-4" : "w-0 border-r-0 p-0 overflow-hidden",
          )}
        >
          {desktopSidebarOpen ? (
            <>
              <nav className="space-y-2">
                {navNodes.map((node) => (
                  <SidebarNode key={node.to || node.label} node={node} />
                ))}
              </nav>
              <button onClick={onLogout} className="mt-8 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-bold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-sm">
                <Icon name="logout" className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : null}
        </aside>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={closeMobile} />
            <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto overflow-x-hidden border-r border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <img src="/logo.png" alt="Azael" className="h-10 w-auto" />
                <button onClick={closeMobile} className="rounded-xl border border-zinc-200 px-3 py-2 text-[13px] font-bold transition-all duration-300 hover:-translate-y-0.5 hover:bg-bgLight hover:shadow-sm">Close</button>
              </div>
              <nav className="mt-4 space-y-2">
                {navNodes.map((node) => (
                  <SidebarNode key={node.to || node.label} node={node} mobile closeMobile={closeMobile} />
                ))}
              </nav>
              <button onClick={onLogout} className="mt-8 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-bold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-sm">
                <Icon name="logout" className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        ) : null}

        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {notifOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setNotifOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full overflow-y-auto overflow-x-hidden border-l border-zinc-200 bg-white p-4 sm:w-[520px]">
            <div className="flex items-center justify-between">
              <div className="text-xl font-extrabold text-primary">Notifications</div>
              <button onClick={() => setNotifOpen(false)} className="rounded-xl border border-zinc-200 px-3 py-2 font-bold transition-all duration-300 hover:-translate-y-0.5 hover:bg-bgLight hover:shadow-sm">Close</button>
            </div>
            <div className="mt-4">
              <NotificationsPanel
                onOpenTarget={({ path, jobId }) => {
                  setNotifOpen(false);
                  navigate(jobId ? `${path}?jobId=${encodeURIComponent(jobId)}` : path);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
