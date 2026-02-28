// NotificationsPanel.jsx
import { useEffect, useState } from "react";

import {
  myNotifications,
  markNotificationRead,
} from "../../pages/api/notifications.api";

export default function NotificationsPanel() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const data = await myNotifications();
      setItems(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load notifications");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id) {
    try {
      await markNotificationRead(id);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to mark read");
    }
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

      <div className="mt-4 grid gap-3">
        {items.map((n) => (
          <div
            key={n.id}
            className={`border rounded-2xl p-4 ${
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
              {!n.isRead && (
                <button
                  onClick={() => markRead(n.id)}
                  className="px-3 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90"
                >
                  Mark as Read
                </button>
              )}
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
