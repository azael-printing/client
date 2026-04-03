import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { setAuthToken } from "../../pages/api/http";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [warningOpen, setWarningOpen] = useState(false);
  const idleTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  function clearAuthStorage() {
    localStorage.removeItem("azael_auth");
    localStorage.removeItem("accessToken");
    setAuthToken(null);
    setUser(null);
  }

  function forceLogout() {
    setWarningOpen(false);
    clearAuthStorage();
    window.location.replace("/login");
  }

  function clearTimers() {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    if (logoutTimerRef.current) window.clearTimeout(logoutTimerRef.current);
  }

  useEffect(() => {
    const raw = localStorage.getItem("azael_auth");
    if (raw) {
      try {
        const { token, user } = JSON.parse(raw);
        localStorage.setItem("accessToken", token);
        setAuthToken(token);
        setUser(user);
      } catch {
        clearAuthStorage();
      }
    }
    setBooting(false);
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const WARNING_MS = 60 * 1000;
    const AUTO_LOGOUT_AFTER_WARNING_MS = 15 * 1000;
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

    const scheduleWarning = () => {
      clearTimers();
      idleTimerRef.current = window.setTimeout(() => {
        setWarningOpen(true);
        logoutTimerRef.current = window.setTimeout(() => {
          forceLogout();
        }, AUTO_LOGOUT_AFTER_WARNING_MS);
      }, WARNING_MS);
    };

    const markActive = () => {
      lastActivityRef.current = Date.now();
      if (warningOpen) {
        setWarningOpen(false);
      }
      scheduleWarning();
    };

    events.forEach((name) => window.addEventListener(name, markActive, { passive: true }));
    scheduleWarning();

    return () => {
      events.forEach((name) => window.removeEventListener(name, markActive));
      clearTimers();
    };
  }, [user, warningOpen]);

  function loginSuccess(token, user) {
    localStorage.setItem("azael_auth", JSON.stringify({ token, user }));
    localStorage.setItem("accessToken", token);
    setAuthToken(token);
    setUser(user);
    setWarningOpen(false);
  }

  function logout() {
    clearTimers();
    clearAuthStorage();
  }

  function stayLoggedIn() {
    setWarningOpen(false);
    lastActivityRef.current = Date.now();
    clearTimers();
    idleTimerRef.current = window.setTimeout(() => {
      setWarningOpen(true);
      logoutTimerRef.current = window.setTimeout(() => {
        forceLogout();
      }, 15 * 1000);
    }, 60 * 1000);
  }

  return (
    <AuthCtx.Provider value={{ user, booting, loginSuccess, logout }}>
      {children}
      {warningOpen ? (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          <div className="absolute left-1/2 top-1/2 w-[92%] max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl">
            <div className="text-lg font-semibold text-primary">Session Warning</div>
            <div className="mt-2 text-sm font-semibold text-zinc-600">
              You have been inactive for about one minute. Finish up your task or stay logged in now, otherwise the system will log you out.
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                onClick={forceLogout}
                className="rounded-2xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-50 hover:text-white hover:border-red-400"
              >
                Logout Now
              </button>
              <button
                onClick={stayLoggedIn}
                className="rounded-2xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                Continue Working
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
