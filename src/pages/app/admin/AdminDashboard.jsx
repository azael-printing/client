// AdminDashboard.jsx
import NotificationsPanel from "../../../components/app/NotificationsPanel";
export default function AdminDashboard() {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="grid gap-4">
        <NotificationsPanel />
      </div>
      <h2 className="text-2xl font-extrabold text-primary">Admin Dashboard</h2>
      <p className="mt-2 text-zinc-700">
        Next: create users, create job orders, access finance, generate
        invoices.
      </p>
    </div>
  );
}
