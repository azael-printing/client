import { http } from "./http";

export async function listJobsByStatus(status) {
  const url = status
    ? `/api/jobs?status=${encodeURIComponent(status)}`
    : "/api/jobs";
  const res = await http.get(url);
  return res.data.jobs;
}

export async function csWorkflow(jobId, action) {
  const res = await http.post(`/api/jobs/${jobId}/workflow`, { action });
  return res.data.job;
}

export async function auditLog(limit = 200) {
  const res = await http.get(`/api/history?limit=${limit}`);
  return res.data.items;
}
