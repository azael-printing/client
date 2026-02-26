// AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../../pages/api/http";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("azael_auth");
    if (raw) {
      const { token, user } = JSON.parse(raw);
      setAuthToken(token);
      setUser(user);
    }
    setBooting(false);
  }, []);

  function loginSuccess(token, user) {
    localStorage.setItem("azael_auth", JSON.stringify({ token, user }));
    setAuthToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("azael_auth");
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, booting, loginSuccess, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
