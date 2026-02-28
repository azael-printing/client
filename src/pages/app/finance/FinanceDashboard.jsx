import { Link } from "react-router-dom";
import NotificationsPanel from "../../../components/app/NotificationsPanel";

export default function FinanceDashboard() {
  return (
    <div className="grid gap-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-primary">
          Finance Dashboard
        </h2>
        <p className="mt-2 text-zinc-700">
          Review new jobs, set waiting/approve, and track completed jobs sent by
          CS.
        </p>

        <div className="mt-5 flex gap-3 flex-wrap">
          <Link
            to="/app/finance-waiting"
            className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
          >
            Waiting Approval
          </Link>

          <Link
            to="/app/finance-done"
            className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-extrabold hover:bg-bgLight transition"
          >
            Done Tracking
          </Link>
        </div>
      </div>

      <NotificationsPanel />
    </div>
  );
}
