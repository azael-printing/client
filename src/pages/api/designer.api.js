import { http } from "./http";
import { formatJobId } from "../../utils/jobFormatting";

export async function listDesignerJobsByStatus(status) {
  const url = status
    ? `/api/jobs?status=${encodeURIComponent(status)}`
    : "/api/jobs";
  const res = await http.get(url);
  return res.data.jobs;
}

export async function designerWorkflow(jobId, action) {
  const res = await http.post(`/api/jobs/${jobId}/workflow`, { action });
  return res.data.job;
}

export async function auditLog(limit = 200) {
  const jobs = await listDesignerJobsByStatus();
  return (jobs || [])
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, limit)
    .map((job) => ({
      id: `designer-${job.id}`,
      createdAt: job.updatedAt || job.createdAt,
      jobId: formatJobId(job.jobNo || job.id),
      actorRole: "DESIGNER",
      action: "JOB_STATUS_SNAPSHOT",
      fromStatus: "-",
      toStatus: job.status || "-",
      note: job.description || job.workType || "-",
    }));
}
