export function getNotificationTarget(notification, role = "CS") {
  const t = String(notification?.type || "").toUpperCase();
  const jobId = notification?.jobId || "";

  const byRole = {
    ADMIN: "/app/admin/jobs",
    CS: "/app/cs/overview",
    DESIGNER: "/app/designer/overview",
    OPERATOR: "/app/operator/overview",
    FINANCE: "/app/finance/overview",
  };

  const roleUpper = String(role || "CS").toUpperCase();
  const fallback = byRole[roleUpper] || "/app/cs/overview";

  if (["ADMIN", "CS"].includes(roleUpper)) {
    if (t.includes("DESIGN")) return { path: "/app/cs/design", jobId };
    if (t.includes("PRODUCTION")) return { path: "/app/cs/production", jobId };
    if (t.includes("DELIVERY") || t.includes("DONE") || t.includes("JOB_DONE")) return { path: "/app/cs/completed", jobId };
    if (t.includes("FINANCE") || t.includes("PAYMENT")) return { path: "/app/cs/new", jobId };
    return { path: "/app/cs/overview", jobId };
  }

  if (roleUpper === "DESIGNER") {
    if (t.includes("DESIGN_DONE")) return { path: "/app/designer/completed", jobId };
    if (t.includes("DESIGN") || t.includes("QUEUE") || t.includes("REQUEST")) return { path: "/app/designer/queue", jobId };
    return { path: "/app/designer/overview", jobId };
  }

  if (roleUpper === "OPERATOR") {
    if (t.includes("PRODUCTION_DONE") || t.includes("DELIVERY")) return { path: "/app/operator/completed", jobId };
    if (t.includes("PRODUCTION") || t.includes("REQUEST")) return { path: "/app/operator/queue", jobId };
    return { path: "/app/operator/overview", jobId };
  }

  if (roleUpper === "FINANCE") {
    if (t.includes("WAITING")) return { path: "/app/finance/waiting", jobId };
    if (t.includes("PAYMENT") || t.includes("DONE") || t.includes("DELIVERY")) return { path: "/app/finance/done", jobId };
    return { path: "/app/finance/overview", jobId };
  }

  return { path: fallback, jobId };
}
