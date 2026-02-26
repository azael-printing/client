import { Link } from "react-router-dom";
import NotificationsPanel from "../../../components/app/NotificationsPanel";

export default function OperatorDashboard() {
  return (
    <div className="grid gap-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-primary">
          Operator Dashboard
        </h2>
        <p className="mt-2 text-zinc-700">
          Only CS-approved production jobs appear in New Requests.
        </p>

        <div className="mt-5 flex gap-3 flex-wrap">
          <Link
            to="/app/operator-requests"
            className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
          >
            New Requests
          </Link>
          <Link
            to="/app/in-production"
            className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-extrabold hover:bg-bgLight transition"
          >
            In Production
          </Link>
        </div>
      </div>

      <NotificationsPanel />
    </div>
  );
}
