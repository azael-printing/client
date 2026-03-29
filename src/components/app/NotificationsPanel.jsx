// NotificationsPanel.jsx (View Message + redirect)
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   myNotifications,
//   markNotificationRead,
// } from "../../pages/api/notifications.api";

// function pickTarget(n) {
//   const t = String(n.type || "").toUpperCase();

//   // map types to routes (adjust if your types differ)
//   if (t.includes("DESIGN")) return "/app/cs/design";
//   if (t.includes("PRODUCTION")) return "/app/cs/production";
//   if (t.includes("FINANCE")) return "/app/cs/new";
//   if (t.includes("AUDIT")) return "/app/cs/audit";

//   // fallback
//   return "/app/cs/overview";
// }

// export default function NotificationsPanel() {
//   const navigate = useNavigate();
//   const [items, setItems] = useState([]);
//   const [err, setErr] = useState("");

//   async function load() {
//     try {
//       setErr("");
//       const data = await myNotifications();
//       setItems(data || []);
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Failed to load notifications");
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function viewMessage(n) {
//     try {
//       if (!n.isRead) await markNotificationRead(n.id);
//       await load();

//       const target = pickTarget(n);
//       const jobId = n.jobId ? `jobId=${encodeURIComponent(n.jobId)}` : "";
//       navigate(jobId ? `${target}?${jobId}` : target);
//     } catch (e) {
//       alert(e?.response?.data?.message || "Failed to open message");
//     }
//   }

//   return (
//     <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg sm:text-xl font-semibold text-primary">Notifications</h3>
//         <button
//           onClick={load}
//           className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
//         >
//           Refresh
//         </button>
//       </div>

//       {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

//       <div className="mt-4 grid gap-3">
//         {items.map((n) => (
//           <div
//             key={n.id}
//             className={`border rounded-2xl p-3 sm:p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
//               n.isRead
//                 ? "border-zinc-200 bg-white"
//                 : "border-primary bg-bgLight"
//             }`}
//           >
//             <div className="text-sm text-zinc-600">
//               {new Date(n.createdAt).toLocaleString()}
//             </div>
//             <div className="mt-1 font-bold text-zinc-900">{n.message}</div>

//             <div className="mt-3 flex gap-2">
//               <button
//                 onClick={() => viewMessage(n)}
//                 className="px-3 py-2 rounded-xl bg-primary text-white font-semibold hover:opacity-90"
//               >
//                 View Message
//               </button>
//             </div>
//           </div>
//         ))}

//         {items.length === 0 && (
//           <div className="text-zinc-600">No notifications.</div>
//         )}
//       </div>
//     </div>
//   );
// }
// NotificationsPanel.jsx
import { useEffect, useState } from "react";
import {
  myNotifications,
  markNotificationRead,
} from "../../pages/api/notifications.api";

function pickTarget(n) {
  const t = String(n.type || "").toUpperCase();

  // CS destinations (adjust if you use different type names)
  if (t.includes("DESIGN")) return "/app/cs/design";
  if (t.includes("PRODUCTION")) return "/app/cs/production";
  if (t.includes("FINANCE")) return "/app/cs/new";
  if (t.includes("DELIVERY") || t.includes("DONE")) return "/app/cs/completed";
  if (t.includes("AUDIT")) return "/app/cs/audit";

  return "/app/cs/overview";
}

/**
 * Props:
 * - onOpenTarget?: ({ path, jobId }) => void
 *   Used to navigate + close notification drawer from layout
 */
export default function NotificationsPanel({ onOpenTarget }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const data = await myNotifications();
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load notifications");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function viewMessage(n) {
    try {
      if (!n.isRead) await markNotificationRead(n.id);
      await load();

      const path = pickTarget(n);
      const jobId = n.jobId || "";

      if (onOpenTarget) {
        onOpenTarget({ path, jobId });
      }
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to open message");
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-semibold text-primary">Notifications</h3>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

      <div className="mt-4 grid gap-3">
        {items.map((n) => (
          <div
            key={n.id}
            className={`border rounded-2xl p-3 sm:p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
              n.isRead
                ? "border-zinc-200 bg-white"
                : "border-primary bg-bgLight"
            }`}
          >
            <div className="text-sm text-zinc-600">
              {new Date(n.createdAt).toLocaleString()}
            </div>
            <div className="mt-1 font-bold text-zinc-900">{n.message}</div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => viewMessage(n)}
                className="px-3 py-2 rounded-xl bg-primary text-white font-semibold hover:opacity-90"
              >
                View Message
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-zinc-600">No notifications.</div>
        )}
      </div>
    </div>
  );
}
