function withJob(path, jobId = "") {
  return { path, jobId };
}

export function getNotificationTarget(notification, role = "CS") {
  const t = String(notification?.type || "").toUpperCase();
  const jobId = notification?.jobId || "";
  const roleUpper = String(role || "CS").toUpperCase();

  if (roleUpper === "ADMIN") {
    if (t.includes("DESIGN_DONE")) return withJob("/app/admin/designer/completed", jobId);
    if (t.includes("DESIGN")) return withJob("/app/admin/designer/queue", jobId);
    if (t.includes("PRODUCTION_DONE") || t.includes("PRODUCTION_WAITING") || t.includes("PRODUCTION_STARTED")) {
      return withJob("/app/admin/operator/in-production", jobId);
    }
    if (t.includes("PRODUCTION_REQUEST")) return withJob("/app/admin/operator/queue", jobId);
    if (t.includes("FINANCE_REVIEW") || t.includes("FINANCE_WAITING") || t.includes("FINANCE_APPROVED")) {
      return withJob("/app/admin/finance/jobs/waiting", jobId);
    }
    if (t.includes("JOB_DONE") || t.includes("DELIVERY") || t.includes("DELIVERED")) {
      return withJob("/app/admin/cs/completed", jobId);
    }
    return withJob("/app/admin", jobId);
  }

  if (roleUpper === "CS") {
    if (t.includes("DESIGN")) return withJob("/app/cs/design", jobId);
    if (t.includes("PRODUCTION")) return withJob("/app/cs/production", jobId);
    if (t.includes("DELIVERY") || t.includes("DONE") || t.includes("JOB_DONE")) return withJob("/app/cs/completed", jobId);
    if (t.includes("FINANCE") || t.includes("PAYMENT")) return withJob("/app/cs/new", jobId);
    return withJob("/app/cs/overview", jobId);
  }

  if (roleUpper === "DESIGNER") {
    if (t.includes("DESIGN_DONE")) return withJob("/app/designer/completed", jobId);
    if (t.includes("DESIGN") || t.includes("QUEUE") || t.includes("REQUEST")) return withJob("/app/designer/queue", jobId);
    return withJob("/app/designer/overview", jobId);
  }

  if (roleUpper === "OPERATOR") {
    if (t.includes("PRODUCTION_DONE") || t.includes("DELIVERY") || t.includes("DELIVERED")) return withJob("/app/operator/completed", jobId);
    if (t.includes("PRODUCTION") || t.includes("REQUEST")) return withJob("/app/operator/queue", jobId);
    return withJob("/app/operator/overview", jobId);
  }

  if (roleUpper === "FINANCE") {
    if (t.includes("WAITING") || t.includes("FINANCE_REVIEW") || t.includes("FINANCE_APPROVED")) return withJob("/app/finance/jobs/waiting", jobId);
    if (t.includes("DELIVERY") || t.includes("JOB_DONE") || t.includes("DELIVERED")) return withJob("/app/finance/jobs/done", jobId);
    return withJob("/app/finance/overview", jobId);
  }

  return withJob("/app", jobId);
}
