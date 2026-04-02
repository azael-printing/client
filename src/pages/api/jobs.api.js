import { http } from "./http";

export async function createJob(payload) {
  const res = await http.post("/api/jobs", payload);
  return res.data.job;
}
export async function updateJob(id, payload) {
  const res = await http.patch(`/api/jobs/${id}`, payload);
  return res.data.job;
}
export async function listJobs(status) {
  const url = status
    ? `/api/jobs?status=${encodeURIComponent(status)}`
    : "/api/jobs";
  const res = await http.get(url);
  return res.data.jobs;
}
export async function cancelJob(id, reason, note = " ") {
  const res = await http.patch(`/api/jobs/${id}/cancel`, { reason, note });
  return res.data.job;
}
export async function workflowAction(jobId, action) {
  const res = await http.post(`/api/jobs/${jobId}/workflow`, { action });
  return res.data.job;
}

export async function deleteJob(id) {
  const res = await http.delete(`/api/jobs/${id}`);
  return res.data;
}
