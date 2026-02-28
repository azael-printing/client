import { http } from "./http";

// placeholder for next module
// export async function getFinanceSummary() {
//   const res = await http.get("/api/finance/summary");
//   return res.data;
// }
// import { http } from "./http";

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
