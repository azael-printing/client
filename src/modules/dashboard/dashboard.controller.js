import { prisma } from "../../db/prismaClient.js";

function safeNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

export async function adminDashboard(req, res) {
  // Admin sees all jobs
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      jobNo: true,
      status: true,
      machine: true,
      customerName: true,
      workType: true,
      createdAt: true,
      total: true,
      vatAmount: true,
      remainingBalance: true,
    },
    orderBy: { createdAt: "desc" },
    take: 2000,
  });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Core cards
  const activeJobs = jobs.filter(
    (j) => !["DELIVERED", "CANCELLED"].includes(j.status),
  );

  const newRequest = jobs.filter((j) => j.status === "NEW_REQUEST");

  const monthRevenue = jobs
    .filter((j) => new Date(j.createdAt) >= monthStart)
    .reduce((sum, j) => sum + safeNum(j.total), 0);

  const outstanding = jobs.reduce(
    (sum, j) => sum + safeNum(j.remainingBalance),
    0,
  );

  // Pipeline counts (match UI pills)
  const pipelineCounts = {
    NEW_REQUEST: jobs.filter((j) => j.status === "NEW_REQUEST").length,
    IN_DESIGN: jobs.filter((j) => j.status === "IN_DESIGN").length,
    IN_PRODUCTION: jobs.filter((j) => j.status === "IN_PRODUCTION").length,
    DELIVERED: jobs.filter((j) => j.status === "DELIVERED").length,
  };

  // Machine overview: pending jobs per machine + "current job" (latest non-delivered)
  const machineNames = [
    "Mimaki UJF 6042 MKII e",
    "Roland vs 640i",
    "Konica Minolta bizhub C754e",
    "Heat Press (Sublimation / DTF)",
  ];

  const machines = machineNames.map((name) => {
    const machineJobs = jobs.filter((j) => (j.machine || "").trim() === name);

    const pending = machineJobs.filter(
      (j) => !["DELIVERED", "CANCELLED"].includes(j.status),
    );

    const currentJob = pending[0] || null;

    // status badge like screenshot
    // - Printing if IN_PRODUCTION
    // - Setup if NEW_REQUEST or waiting statuses
    let badge = "Idle";
    if (currentJob) {
      if (currentJob.status === "IN_PRODUCTION") badge = "Printing";
      else badge = "Setup";
    }

    return {
      machine: name,
      badge,
      pendingCount: pending.length,
      currentJob: currentJob
        ? {
            jobNo: currentJob.jobNo,
            customerName: currentJob.customerName,
            workType: currentJob.workType,
          }
        : null,
    };
  });

  return res.json({
    cards: {
      activeJobs: activeJobs.length,
      newRequest: newRequest.length,
      monthRevenue,
      outstanding,
    },
    pipelineCounts,
    machines,
  });
}
