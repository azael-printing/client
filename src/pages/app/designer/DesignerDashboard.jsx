import { Link } from "react-router-dom";
import NotificationsPanel from "../../../components/app/NotificationsPanel";

export default function DesignerDashboard() {
  return (
    <div className="grid gap-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-primary">
          Designer Dashboard
        </h2>
        <p className="mt-2 text-zinc-700">
          Open Jobs and move items from Design to Production.
        </p>

        <div className="mt-5 flex gap-3 flex-wrap">
          <Link
            to="/app/jobs"
            className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
          >
            View Jobs & Update Status
          </Link>
        </div>
      </div>

      <NotificationsPanel />
    </div>
  );
}
