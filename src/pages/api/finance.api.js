import { http } from "./http";

export async function getFinanceDashboard() {
  const res = await http.get("/api/finance/dashboard");
  return res.data;
}

export async function getExpenseDashboard() {
  const res = await http.get("/api/finance/expenses/dashboard");
  return res.data;
}

export async function createExpense(payload) {
  const res = await http.post("/api/finance/expenses", payload);
  return res.data;
}

export async function listFinanceJobs(status) {
  const url = status
    ? `/api/jobs?status=${encodeURIComponent(status)}`
    : "/api/jobs";
  const res = await http.get(url);
  return res.data.jobs;
}

export async function financeAction(jobId, action) {
  const res = await http.post(`/api/jobs/${jobId}/workflow`, { action });
  return res.data.job;
}
