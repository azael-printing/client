import { Link } from "react-router-dom";
import NotificationsPanel from "../../../components/app/NotificationsPanel";

export default function CSDashboard() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4">
        <NotificationsPanel />
      </div>
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-primary">
          Customer Service Dashboard
        </h2>
        <p className="mt-2 text-zinc-700">
          Create orders and track design/production status.
        </p>

        <div className="mt-5 flex gap-3 flex-wrap">
          <Link
            to="/app/create-order"
            className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
          >
            + Create Order
          </Link>
          <Link
            to="/app/jobs"
            className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-extrabold hover:bg-bgLight transition"
          >
            View Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
