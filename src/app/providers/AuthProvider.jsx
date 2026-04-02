// AuthProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { setAuthToken } from "../../pages/api/http";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const idleTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  function clearAuthStorage() {
    localStorage.removeItem("azael_auth");
    localStorage.removeItem("accessToken");
    setAuthToken(null);
    setUser(null);
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

    const IDLE_MS = 10 * 60 * 1000;
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

    const markActive = () => {
      lastActivityRef.current = Date.now();
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        const now = Date.now();
        if (now - lastActivityRef.current >= IDLE_MS) {
          clearAuthStorage();
          window.location.replace("/login");
        }
      }, IDLE_MS);
    };

    events.forEach((name) => window.addEventListener(name, markActive, { passive: true }));
    markActive();

    return () => {
      events.forEach((name) => window.removeEventListener(name, markActive));
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [user]);

  function loginSuccess(token, user) {
    localStorage.setItem("azael_auth", JSON.stringify({ token, user }));
    localStorage.setItem("accessToken", token);
    setAuthToken(token);
    setUser(user);
  }

  function logout() {
    clearAuthStorage();
  }

  return (
    <AuthCtx.Provider value={{ user, booting, loginSuccess, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
