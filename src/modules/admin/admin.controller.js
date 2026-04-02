// import prisma from "../../db/prismaClient.js";

// /**
//  * IMPORTANT:
//  * Your DB machine values are not consistent (example: "Roland" vs "Roland vs 640i").
//  * So we use "contains" matching.
//  */
// const MACHINE_MAP = [
//   { label: "Mimaki UJF 6042 MKII e", match: "Mimaki", key: "Mimaki" },
//   { label: "Roland vs 640i", match: "Roland", key: "Roland" },
//   { label: "Konica Minolta bizhub C754e", match: "Konica", key: "Konica" },
//   {
//     label: "Heat Press (Sublimation / DTF)",
//     match: "Heat Press",
//     key: "Heat Press",
//   },
// ];

// const PENDING_STATUSES = [
//   "NEW_REQUEST",
//   "FINANCE_WAITING_APPROVAL",
//   "FINANCE_APPROVED",

//   "DESIGN_ASSIGNED",
//   "DESIGN_PENDING",
//   "DESIGN_WAITING",
//   "IN_DESIGN",
//   "DESIGN_DONE",

//   "PRODUCTION_READY",
//   "PRODUCTION_PENDING",
//   "PRODUCTION_WAITING",
//   "IN_PRODUCTION",
//   "PRODUCTION_DONE",
// ];

// export async function machineOverview(req, res) {
//   const machines = await Promise.all(
//     MACHINE_MAP.map(async ({ label, match }) => {
//       // "Current job" = most recent job that is currently IN_PRODUCTION on this machine group
//       const current = await prisma.job.findFirst({
//         where: {
//           status: "IN_PRODUCTION",
//           machine: { contains: match, mode: "insensitive" },
//         },
//         orderBy: { createdAt: "desc" },
//         select: {
//           jobNo: true,
//           customerName: true,
//           workType: true,
//           qty: true,
//           unitType: true,
//           urgency: true,
//           status: true,
//         },
//       });

//       // Pending jobs count = all statuses that are not delivered/cancelled
//       const pendingJobs = await prisma.job.count({
//         where: {
//           status: { in: PENDING_STATUSES },
//           machine: { contains: match, mode: "insensitive" },
//         },
//       });

//       // Badge/state rules:
//       // - Printing if current IN_PRODUCTION exists
//       // - Setup if there are pending jobs but not currently printing
//       // - Idle if none
//       let state = "Idle";
//       if (current) state = "Printing";
//       else if (pendingJobs > 0) state = "Setup";

//       return {
//         machine: label,
//         machineKey: key,
//         state,
//         pendingJobs,
//         currentJob: current
//           ? {
//               jobNo: current.jobNo,
//               customerName: current.customerName,
//               workType: current.workType,
//               qty: current.qty,
//               unitType: current.unitType,
//               urgency: current.urgency,
//               status: current.status,
//             }
//           : null,
//       };
//     }),
//   );

//   res.json({ machines });
// }
import { prisma } from "../../db/prismaClient.js";

const MACHINE_MAP = [
  { label: "Mimaki UJF 6042 MKII e", match: "Mimaki", key: "Mimaki" },
  { label: "Roland vs 640i", match: "Roland", key: "Roland" },
  { label: "Konica Minolta bizhub C754e", match: "Konica", key: "Konica" },
  {
    label: "Heat Press (Sublimation / DTF)",
    match: "Heat Press",
    key: "Heat Press",
  },
];

// statuses used for "pending jobs" count
const ACTIVE_STATUSES = [
  "NEW_REQUEST",
  "FINANCE_WAITING_APPROVAL",
  "FINANCE_APPROVED",

  "DESIGN_ASSIGNED",
  "DESIGN_PENDING",
  "DESIGN_WAITING",
  "IN_DESIGN",
  "DESIGN_DONE",

  "PRODUCTION_READY",
  "PRODUCTION_PENDING",
  "PRODUCTION_WAITING",
  "IN_PRODUCTION",
  "PRODUCTION_DONE",
];

// priority order for "current job" (includes non-production)
const PRIORITY = [
  { state: "Printing", statuses: ["IN_PRODUCTION"] },
  {
    state: "Setup",
    statuses: ["PRODUCTION_READY", "PRODUCTION_PENDING", "PRODUCTION_WAITING"],
  },
  {
    state: "Design",
    statuses: [
      "IN_DESIGN",
      "DESIGN_PENDING",
      "DESIGN_WAITING",
      "DESIGN_ASSIGNED",
    ],
  },
  {
    state: "New",
    statuses: ["FINANCE_WAITING_APPROVAL", "FINANCE_APPROVED", "NEW_REQUEST"],
  },
];

async function findCurrentJob(match) {
  for (const step of PRIORITY) {
    const job = await prisma.job.findFirst({
      where: {
        status: { in: step.statuses },
        machine: { contains: match, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
      select: {
        jobNo: true,
        customerName: true,
        workType: true,
        qty: true,
        unitType: true,
        urgency: true,
        status: true,
      },
    });

    if (job) return { job, state: step.state };
  }

  return { job: null, state: "Idle" };
}

export async function machineOverview(req, res) {
  const machines = await Promise.all(
    MACHINE_MAP.map(async ({ label, match, key }) => {
      const { job: current, state } = await findCurrentJob(match);

      const pendingJobs = await prisma.job.count({
        where: {
          status: { in: ACTIVE_STATUSES },
          machine: { contains: match, mode: "insensitive" },
        },
      });

      // if no current job but there are pending jobs, show Setup
      const finalState = current ? state : pendingJobs > 0 ? "Setup" : "Idle";

      return {
        machine: label,
        machineKey: key, // ✅ now key exists
        state: finalState,
        pendingJobs,
        currentJob: current
          ? {
              jobNo: current.jobNo,
              customerName: current.customerName,
              workType: current.workType,
              qty: current.qty,
              unitType: current.unitType,
              urgency: current.urgency,
              status: current.status,
            }
          : null,
      };
    }),
  );

  res.json({ machines });
}
