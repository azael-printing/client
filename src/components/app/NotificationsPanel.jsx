// NotificationsPanel.jsx
import { useEffect, useState } from "react";
import {
  listMyNotifications,
  markNotificationSeen,
} from "../../pages/api/notifications.api";

export default function NotificationsPanel() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const data = await listMyNotifications();
      setItems(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load notifications");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function seen(id) {
    await markNotificationSeen(id);
    load();
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-primary">Notifications</h3>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {err && <div className="mt-3 text-red-600 font-bold">{err}</div>}

      <div className="mt-4 space-y-2">
        {items.length === 0 && (
          <div className="text-sm text-zinc-600">No notifications.</div>
        )}

        {items.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border ${n.seenAt ? "border-zinc-200" : "border-primary"} `}
          >
            <div className="font-bold text-zinc-900">{n.message}</div>
            <div className="text-xs text-zinc-500 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </div>

            {!n.seenAt && (
              <button
                onClick={() => seen(n.id)}
                className="mt-3 px-3 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90"
              >
                Mark Seen
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
