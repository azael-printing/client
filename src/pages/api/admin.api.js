import { http } from "./http";

export async function fetchJobs() {
  const res = await http.get("/api/jobs");
  return res.data.jobs || [];
}

export async function fetchPipelineCounts() {
  // If your backend already supports counts, use it later.
  // For now we compute client-side from /api/jobs.
  const jobs = await fetchJobs();
  const counts = {};
  for (const j of jobs) counts[j.status] = (counts[j.status] || 0) + 1;
  return counts;
}
