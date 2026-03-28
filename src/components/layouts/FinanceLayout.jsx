// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useMemo, useState } from "react";
// import NotificationsPanel from "../app/NotificationsPanel";
// import { useAuth } from "../../app/providers/AuthProvider";

// function cn(...xs) {
//   return xs.filter(Boolean).join(" ");
// }

// function Icon({ name, className = "w-5 h-5" }) {
//   // minimal inline SVG icons (no external libs)
//   const common = {
//     className,
//     fill: "none",
//     stroke: "currentColor",
//     strokeWidth: 2,
//     strokeLinecap: "round",
//     strokeLinejoin: "round",
//   };

//   switch (name) {
//     case "menu":
//       return (
//         <svg {...common} viewBox="0 0 24 24">
//           <path d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       );
//     case "bell":
//       return (
//         <svg {...common} viewBox="0 0 24 24">
//           <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
//           <path d="M13.73 21a2 2 0 01-3.46 0" />
//         </svg>
//       );
//     case "grid":
//       return (
//         <svg {...common} viewBox="0 0 24 24">
//           <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
//         </svg>
//       );
//     case "dollar":
//       return (
//         <svg {...common} viewBox="0 0 24 24">
//           <path d="M12 1v22" />
//           <path d="M17 5H9.5a3.5 3.5 0 000 7H14a3.5 3.5 0 010 7H6" />
//         </svg>
//       );
//     case "receipt":
//       return (
//         <svg {...common} viewBox="0 0 24 24">
//           <path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1z" />
//           <path d="M8 6h8M8 10h8M8 14h6" />
//         </svg>
//       );
//     case "log":
//       return (
//         <svg {...common} viewBox="0 0 24 24">
//           <path d="M4 4h16v16H4z" />
//           <path d="M8 8h8M8 12h8M8 16h6" />
//         </svg>
//       );
//     case "briefcase":
//       return (
//         <svg {...common} viewBox="0 0 24 24">
//           <path d="M10 6V5a2 2 0 012-2h0a2 2 0 012 2v1" />
//           <path d="M4 7h16v14H4z" />
//           <path d="M4 12h16" />
//         </svg>
//       );
//     case "plus":
//       return (
//         <svg {...common} viewBox="0 0 24 24">
//           <path d="M12 5v14M5 12h14" />
//         </svg>
//       );
//     case "logout":
//       return (
//         <svg {...common} viewBox="0 0 24 24">
//           <path d="M10 17l5-5-5-5" />
//           <path d="M15 12H3" />
//           <path d="M21 3v18" />
//         </svg>
//       );
//     default:
//       return null;
//   }
// }

// export default function FinanceLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);

//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const navItems = useMemo(
//     () => [
//       { to: "/app/finance/overview", label: "Overview", icon: "grid" },
//       { to: "/app/finance/revenue", label: "Revenue", icon: "dollar" },
//       { to: "/app/finance/expenses", label: "Expenses", icon: "receipt" },
//       { to: "/app/finance/audit", label: "Audit Log", icon: "log" },
//       { divider: true },
//       { to: "/app/finance/jobs", label: "Jobs", icon: "briefcase" },
//       { to: "/app/create-order", label: "Create Order", icon: "plus" }, // keep your existing create order route
//     ],
//     [],
//   );

//   function handleLogout() {
//     logout();
//     navigate("/login", { replace: true });
//   }

//   return (
//     <div className="min-h-screen bg-bgLight">
//       {/* TOP BAR */}
//       <div className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-3 sm:px-6 shadow-sm">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setSidebarOpen((v) => !v)}
//             className="w-11 h-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-bgLight transition"
//             aria-label="Open menu"
//           >
//             <Icon name="menu" />
//           </button>

//           <div className="flex items-center gap-2">
//             <img src="/logo.png" alt="Azael" className="h-10 w-auto" />
//           </div>
//         </div>

//         <div className="text-primary font-extrabold tracking-wide text-lg sm:text-xl">
//           FINANCE DASHBOARD
//         </div>

//         <div className="flex items-center gap-5">
//           <button
//             onClick={() => setNotifOpen(true)}
//             className="relative w-11 h-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-bgLight transition"
//             aria-label="Notifications"
//           >
//             <Icon name="bell" />
//           </button>

//           <div className="text-right leading-tight">
//             <div className="font-extrabold text-zinc-900">
//               {user?.role || "Finance"}
//             </div>
//             <button
//               onClick={handleLogout}
//               className="text-red-600 font-bold hover:underline"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* BODY */}
//       <div className="flex">
//         {/* SIDEBAR */}
//         <aside
//           className={cn(
//             "w-72 bg-white border-r border-zinc-200 min-h-[calc(100vh-64px)] p-4",
//             "hidden md:block",
//           )}
//         >
//           <nav className="space-y-2">
//             {navItems.map((it, idx) =>
//               it.divider ? (
//                 <div
//                   key={`div-${idx}`}
//                   className="my-4 border-t border-zinc-200"
//                 />
//               ) : (
//                 <NavLink
//                   key={it.to}
//                   to={it.to}
//                   className={({ isActive }) =>
//                     cn(
//                       "flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition",
//                       isActive
//                         ? "bg-bgLight text-primary"
//                         : "text-zinc-900 hover:bg-bgLight",
//                     )
//                   }
//                 >
//                   <span className="text-primary">
//                     <Icon name={it.icon} />
//                   </span>
//                   <span>{it.label}</span>
//                 </NavLink>
//               ),
//             )}
//           </nav>

//           <button
//             onClick={handleLogout}
//             className="mt-10 flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold text-red-600 hover:bg-red-50 transition"
//           >
//             <Icon name="logout" className="w-5 h-5" />
//             Logout
//           </button>
//         </aside>

//         {/* MOBILE SIDEBAR DRAWER */}
//         {sidebarOpen && (
//           <div className="fixed inset-0 z-50 md:hidden">
//             <div
//               className="absolute inset-0 bg-black/30"
//               onClick={() => setSidebarOpen(false)}
//             />
//             <div className="absolute left-0 top-0 h-full w-72 bg-white border-r border-zinc-200 p-4">
//               <div className="flex items-center justify-between">
//                 <img src="/logo.png" alt="Azael" className="h-10 w-auto" />
//                 <button
//                   onClick={() => setSidebarOpen(false)}
//                   className="px-3 py-2 rounded-xl border border-zinc-200 font-bold"
//                 >
//                   Close
//                 </button>
//               </div>

//               <nav className="mt-4 space-y-2">
//                 {navItems.map((it, idx) =>
//                   it.divider ? (
//                     <div
//                       key={`divm-${idx}`}
//                       className="my-4 border-t border-zinc-200"
//                     />
//                   ) : (
//                     <NavLink
//                       key={it.to}
//                       to={it.to}
//                       onClick={() => setSidebarOpen(false)}
//                       className={({ isActive }) =>
//                         cn(
//                           "flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition",
//                           isActive
//                             ? "bg-bgLight text-primary"
//                             : "text-zinc-900 hover:bg-bgLight",
//                         )
//                       }
//                     >
//                       <span className="text-primary">
//                         <Icon name={it.icon} />
//                       </span>
//                       <span>{it.label}</span>
//                     </NavLink>
//                   ),
//                 )}
//               </nav>

//               <button
//                 onClick={handleLogout}
//                 className="mt-10 w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold text-red-600 hover:bg-red-50 transition"
//               >
//                 <Icon name="logout" className="w-5 h-5" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         )}

//         {/* MAIN CONTENT */}
//         <main className="flex-1 p-4 sm:p-6">
//           <Outlet />
//         </main>
//       </div>

//       {/* NOTIFICATIONS DRAWER */}
//       {notifOpen && (
//         <div className="fixed inset-0 z-50">
//           <div
//             className="absolute inset-0 bg-black/30"
//             onClick={() => setNotifOpen(false)}
//           />
//           <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white border-l border-zinc-200 p-4 overflow-auto">
//             <div className="flex items-center justify-between">
//               <div className="font-extrabold text-primary text-xl">
//                 Notifications
//               </div>
//               <button
//                 onClick={() => setNotifOpen(false)}
//                 className="px-3 py-2 rounded-xl border border-zinc-200 font-bold hover:bg-bgLight"
//               >
//                 Close
//               </button>
//             </div>
//             <div className="mt-4">
//               <NotificationsPanel />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import NotificationsPanel from "../app/NotificationsPanel";
import { useAuth } from "../../app/providers/AuthProvider";

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

    case "dollar":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 1v22" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7H14a3.5 3.5 0 010 7H6" />
        </svg>
      );

    case "receipt":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1z" />
          <path d="M8 6h8M8 10h8M8 14h6" />
        </svg>
      );

    case "log":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 4h16v16H4z" />
          <path d="M8 8h8M8 12h8M8 16h6" />
        </svg>
      );

    case "briefcase":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M10 6V5a2 2 0 012-2h0a2 2 0 012 2v1" />
          <path d="M4 7h16v14H4z" />
          <path d="M4 12h16" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
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

export default function FinanceLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = useMemo(
    () => [
      { to: "/app/finance/overview", label: "Overview", icon: "grid" },
      { to: "/app/finance/revenue", label: "Revenue", icon: "dollar" },
      { to: "/app/finance/waiting", label: "Waiting Approval", icon: "clock" },
      { to: "/app/finance/done", label: "Done Tracking", icon: "check" },
      { to: "/app/finance/expenses", label: "Expenses", icon: "receipt" },
      { to: "/app/finance/audit", label: "Audit Log", icon: "log" },
      { divider: true },
      { to: "/app/finance/jobs", label: "Jobs", icon: "briefcase" },
    ],
    [],
  );

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-bgLight">
      {/* TOP BAR */}
      <div className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-3 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-11 h-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-bgLight transition"
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>

          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Azael" className="h-10 w-auto" />
          </div>
        </div>

        <div className="text-primary font-extrabold tracking-wide text-lg sm:text-xl">
          FINANCE DASHBOARD
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => setNotifOpen(true)}
            className="relative w-11 h-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-bgLight transition"
            aria-label="Notifications"
          >
            <Icon name="bell" />
          </button>

          <div className="text-right leading-tight">
            <div className="font-extrabold text-zinc-900">
              {user?.role || "Finance"}
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
      <div className="flex">
        {/* DESKTOP SIDEBAR */}
        <aside
          className={cn(
            "w-72 bg-white border-r border-zinc-200 min-h-[calc(100vh-64px)] p-4",
            "hidden md:block",
          )}
        >
          <nav className="space-y-2">
            {navItems.map((it, idx) =>
              it.divider ? (
                <div
                  key={`div-${idx}`}
                  className="my-4 border-t border-zinc-200"
                />
              ) : (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition",
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
                </NavLink>
              ),
            )}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold text-red-600 hover:bg-red-50 transition"
          >
            <Icon name="logout" className="w-5 h-5" />
            Logout
          </button>
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
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
                {navItems.map((it, idx) =>
                  it.divider ? (
                    <div
                      key={`divm-${idx}`}
                      className="my-4 border-t border-zinc-200"
                    />
                  ) : (
                    <NavLink
                      key={it.to}
                      to={it.to}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition",
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
                    </NavLink>
                  ),
                )}
              </nav>

              <button
                onClick={handleLogout}
                className="mt-10 w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold text-red-600 hover:bg-red-50 transition"
              >
                <Icon name="logout" className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
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
              <div className="font-extrabold text-primary text-xl">
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
