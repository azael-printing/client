import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bgLight">
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-primary">
            Azael System
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-sm text-zinc-700">
              <span className="font-bold">{user?.username}</span> · {user?.role}
            </div>
            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
