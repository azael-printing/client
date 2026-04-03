import { useEffect, useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { useDialog } from "../common/DialogProvider";
import {
  myNotifications,
  markNotificationRead,
} from "../../pages/api/notifications.api";
import { getNotificationTarget } from "../../utils/notificationRouting";

export default function NotificationsPanel({ onOpenTarget }) {
  const { user } = useAuth();
  const dialog = useDialog();
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
      dialog?.toast?.("Notification opened", "info");

      const target = getNotificationTarget(n, user?.role);
      if (onOpenTarget) onOpenTarget(target);
    } catch (e) {
      dialog?.toast?.(e?.response?.data?.message || "Failed to open message", "error");
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-semibold text-primary">Notifications</h3>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-bgLight text-primary font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
        >
          Refresh
        </button>
      </div>

      {err && <div className="mt-3 text-red-600 font-semibold">{err}</div>}

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
            <div className="mt-1 font-semibold text-zinc-900">{n.message}</div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => viewMessage(n)}
                className="px-3 py-2 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
              >
                View Message
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-zinc-600 font-medium">No notifications.</div>
        )}
      </div>
    </div>
  );
}
