// jobs.update.controller.js
import { z } from "zod";
import { prisma } from "../../db/prismaClient.js";

const PIPELINE_STATUSES = [
  "NEW_REQUEST",
  "FINANCE_WAITING_APPROVAL",
  "FINANCE_APPROVED",
  "DESIGN_PENDING",
  "DESIGN_WAITING",
  "DESIGN_ASSIGNED",
  "IN_DESIGN",
  "DESIGN_DONE",
  "PRODUCTION_PENDING",
  "PRODUCTION_WAITING",
  "PRODUCTION_READY",
  "IN_PRODUCTION",
  "PRODUCTION_DONE",
  "READY_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const UpdateJobSchema = z.object({
  machine: z.string().min(2).optional(),
  status: z.enum(PIPELINE_STATUSES).optional(),
  paymentStatus: z.enum(["UNPAID", "PARTIAL", "PAID", "CREDIT"]).optional(),
  depositAmount: z.number().min(0).optional(),
  remainingBalance: z.number().min(0).optional(),
});

export async function updateJob(req, res) {
  const jobId = req.params.id;

  const parsed = UpdateJobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", issues: parsed.error.issues });
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return res.status(404).json({ message: "Job not found" });

  const role = req.user.role;
  const { machine, status, paymentStatus, depositAmount, remainingBalance } = parsed.data;

  if (machine && !["ADMIN", "CS"].includes(role)) {
    return res.status(403).json({ message: "Only Admin/CS can update machine" });
  }

  if (status && !["ADMIN", "CS", "FINANCE", "DESIGNER", "OPERATOR"].includes(role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if ((paymentStatus || depositAmount !== undefined || remainingBalance !== undefined) && !["FINANCE", "ADMIN"].includes(role)) {
    return res.status(403).json({ message: "Only Finance/Admin can update payment" });
  }

  let nextDeposit = depositAmount !== undefined ? Number(depositAmount || 0) : Number(job.depositAmount || 0);
  let nextPaymentStatus = paymentStatus || job.paymentStatus;
  let nextRemaining = remainingBalance !== undefined ? Number(remainingBalance || 0) : Number(job.remainingBalance || 0);

  if (paymentStatus === "PAID") {
    nextDeposit = Number(job.total || 0);
    nextRemaining = 0;
  } else if (paymentStatus === "UNPAID" || paymentStatus === "CREDIT") {
    nextDeposit = 0;
    nextRemaining = Number(job.total || 0);
  } else if (paymentStatus === "PARTIAL") {
    nextRemaining = Math.max(0, Number(job.total || 0) - nextDeposit);
  }

  if (depositAmount !== undefined && paymentStatus === undefined) {
    nextRemaining = Math.max(0, Number(job.total || 0) - nextDeposit);
    if (nextDeposit <= 0) nextPaymentStatus = "UNPAID";
    else if (nextRemaining <= 0) nextPaymentStatus = "PAID";
    else nextPaymentStatus = "PARTIAL";
  }

  const updated = await prisma.job.update({
    where: { id: jobId },
    data: {
      ...(machine ? { machine } : {}),
      ...(status ? { status } : {}),
      ...(paymentStatus || depositAmount !== undefined || remainingBalance !== undefined
        ? {
            paymentStatus: nextPaymentStatus,
            depositAmount: nextDeposit,
            remainingBalance: nextRemaining,
          }
        : {}),
    },
  });

  res.json({ job: updated });
}
