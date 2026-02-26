import { useState } from "react";
import { http } from "../api/http";
import { useAuth } from "../../app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import titleLogo from "../../assets/title-logo.png";
import logo from "../../assets/logo.png";
const roleToPath = {
  ADMIN: "/app/admin",
  CS: "/app/cs",
  DESIGNER: "/app/designer",
  OPERATOR: "/app/operator",
  FINANCE: "/app/finance",
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginSuccess } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await http.post("/api/auth/login", { username, password });
      loginSuccess(res.data.accessToken, res.data.user);

      const target = roleToPath[res.data.user.role] || "/";
      nav(target, { replace: true });
    } catch (e) {
      // setErr(e?.response?.data?.message || "Login failed");
      if (!e?.response) {
        setErr(
          "Cannot reach server (CORS / network). Check backend URL + CORS.",
        );
      } else {
        setErr(
          e.response.data?.message || `Login failed (${e.response.status})`,
        );
      }
      // endd
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-bgLight p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm"
      >
        <img src={logo} alt="Azael Printing" className="h-10" />
        <h1 className="mt-4 text-xl font-extrabold text-zinc-900">
          Management Login
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Enter your credentials. The system will redirect you automatically.
        </p>

        <div className="mt-5 space-y-3">
          <input
            className="w-full rounded-xl border border-zinc-200 p-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-zinc-200 p-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {err && (
          <div className="mt-3 text-sm text-red-600 font-semibold">{err}</div>
        )}

        <button
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-primary text-white font-extrabold p-3 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Login"}
        </button>

        <div className="mt-4 text-xs text-zinc-500">
          Token expiry is controlled by backend env{" "}
          <span className="font-bold">JWT_EXPIRES_IN</span>.
        </div>
      </form>
    </div>
  );
}
