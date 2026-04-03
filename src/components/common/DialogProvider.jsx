import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const DialogCtx = createContext(null);

export function DialogProvider({ children }) {
  const alertResolveRef = useRef(null);
  const confirmResolveRef = useRef(null);
  const [alertState, setAlertState] = useState({ open: false, title: "Message", message: "" });
  const [confirmState, setConfirmState] = useState({ open: false, title: "Please confirm", message: "" });
  const [toasts, setToasts] = useState([]);

  const closeAlert = useCallback(() => {
    setAlertState((s) => ({ ...s, open: false }));
    if (alertResolveRef.current) {
      alertResolveRef.current();
      alertResolveRef.current = null;
    }
  }, []);

  const closeConfirm = useCallback((result) => {
    setConfirmState((s) => ({ ...s, open: false }));
    if (confirmResolveRef.current) {
      confirmResolveRef.current(result);
      confirmResolveRef.current = null;
    }
  }, []);

  const appAlert = useCallback((message, title = "Message") => {
    return new Promise((resolve) => {
      alertResolveRef.current = resolve;
      setAlertState({ open: true, title, message: String(message || "") });
    });
  }, []);

  const appConfirm = useCallback((message, title = "Please confirm") => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmState({ open: true, title, message: String(message || "") });
    });
  }, []);

  const pushToast = useCallback((message, tone = "info") => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    setToasts((items) => [...items, { id, message: String(message || ""), tone }]);
    window.setTimeout(() => {
      setToasts((items) => items.filter((x) => x.id !== id));
    }, 2600);
  }, []);

  useEffect(() => {
    function onAppToast(event) {
      pushToast(event?.detail?.message || "Done", event?.detail?.tone || "info");
    }

    window.addEventListener("app-toast", onAppToast);
    return () => window.removeEventListener("app-toast", onAppToast);
  }, [pushToast]);

  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message) => {
      appAlert(message);
    };
    return () => {
      window.alert = originalAlert;
    };
  }, [appAlert]);

  const value = useMemo(() => ({
    alert: appAlert,
    confirm: appConfirm,
    toast: pushToast,
  }), [appAlert, appConfirm, pushToast]);

  return (
    <DialogCtx.Provider value={value}>
      {children}

      <div className="fixed right-4 top-4 z-[100] grid gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "pointer-events-auto min-w-[240px] max-w-[340px] rounded-2xl border px-4 py-3 shadow-xl backdrop-blur transition-all duration-300 animate-[fadeIn_.2s_ease]",
              t.tone === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : t.tone === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-primary/20 bg-white text-zinc-800",
            ].join(" ")}
          >
            <div className="text-sm font-semibold">{t.message}</div>
          </div>
        ))}
      </div>

      {alertState.open && (
        <div className="fixed inset-0 z-[110]">
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" onClick={closeAlert} />
          <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl">
            <div className="text-lg font-semibold text-primary">{alertState.title}</div>
            <div className="mt-3 text-sm font-medium text-zinc-700 whitespace-pre-wrap">{alertState.message}</div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={closeAlert}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmState.open && (
        <div className="fixed inset-0 z-[110]">
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" onClick={() => closeConfirm(false)} />
          <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl">
            <div className="text-lg font-semibold text-primary">{confirmState.title}</div>
            <div className="mt-3 text-sm font-medium text-zinc-700 whitespace-pre-wrap">{confirmState.message}</div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => closeConfirm(false)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={() => closeConfirm(true)}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogCtx.Provider>
  );
}

export function useDialog() {
  return useContext(DialogCtx);
}
