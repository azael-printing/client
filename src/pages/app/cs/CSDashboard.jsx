import { Link } from "react-router-dom";
import NotificationsPanel from "../../../components/app/NotificationsPanel";

export default function CSDashboard() {
  return (
    <div className="grid gap-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-primary">
          Customer Service Dashboard
        </h2>
        <p className="mt-2 text-zinc-700">
          Approve jobs and control the handoff between design and production.
        </p>

        <div className="mt-5 flex gap-3 flex-wrap">
          <Link
            to="/app/create-order"
            className="px-5 py-3 rounded-2xl bg-primary text-white font-bold hover:opacity-90 transition"
          >
            + Create Order
          </Link>

          <Link
            to="/app/cs-new-requests"
            className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-bold hover:bg-bgLight transition"
          >
            New Requests
          </Link>

          <Link
            to="/app/cs-design-completed"
            className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-bold hover:bg-bgLight transition"
          >
            Design Completed
          </Link>

          <Link
            to="/app/cs-in-production"
            className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-bold hover:bg-bgLight transition"
          >
            In Production
          </Link>

          <Link
            to="/app/cs-production-completed"
            className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-bold hover:bg-bgLight transition"
          >
            Production Completed
          </Link>
        </div>
      </div>

      <NotificationsPanel />
    </div>
  );
}
