import { z } from "zod";
import { prisma } from "../../db/prismaClient.js";

import { notifyRole } from "../../utils/notify.js";
import { logHistory } from "../../utils/history.js";
const CreateJobSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  machine: z.string().min(2),
  workType: z.string().min(2),
  description: z.string().optional(),
  qty: z.number().positive(),
  unitType: z.string().min(1),
  designerRequired: z.boolean(),
  deliveryType: z.enum(["PICKUP", "DELIVERY"]),
  deliveryDate: z.string().optional(),
  deliveryTime: z.string().optional(),
  unitPrice: z.number().positive(),
  vatEnabled: z.boolean(),
});

export async function createJob(req, res) {
  const parsed = CreateJobSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ message: "Invalid input", issues: parsed.error.issues });

  const data = parsed.data;
  const subtotal = data.qty * data.unitPrice;
  const vatAmount = data.vatEnabled ? subtotal * 0.15 : 0;
  const total = subtotal + vatAmount;

  // ✅ ALWAYS first: NEW_REQUEST (finance must review)
  const job = await prisma.job.create({
    data: {
      createdByUserId: req.user.id,
      status: "NEW_REQUEST",

      customerName: data.customerName,
      customerPhone: data.customerPhone,
      machine: data.machine,
      workType: data.workType,
      description: data.description || null,

      qty: data.qty,
      unitType: data.unitType,
      designerRequired: data.designerRequired,

      deliveryType: data.deliveryType,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      deliveryTime: data.deliveryTime || null,

      unitPrice: data.unitPrice,
      vatEnabled: data.vatEnabled,
      vatAmount,
      subtotal,
      total,
      remainingBalance: total,
    },
  });

  await logHistory({
    jobId: job.id,
    actorId: req.user.id,
    actorRole: req.user.role,
    action: "CS_CREATE_JOB",
    fromStatus: null,
    toStatus: "NEW_REQUEST",
    note: `Job created. designerRequired=${job.designerRequired}`,
  });

  // ✅ Notify FINANCE immediately
  await notifyRole({
    role: "FINANCE",
    jobId: job.id,
    type: "FINANCE_REVIEW",
    message: `New job created: #${job.jobNo} (${job.workType}). Please review.`,
  });

  await logHistory({
    jobId: job.id,
    actorId: req.user.id,
    actorRole: req.user.role,
    action: "NOTIFY_FINANCE_NEW_JOB",
    fromStatus: "NEW_REQUEST",
    toStatus: "NEW_REQUEST",
  });

  res.status(201).json({ job });
}

export async function listJobs(req, res) {
  const role = req.user.role;
  const status = req.query.status;

  const where = {};

  // CS sees their jobs only (unless admin)
  if (role === "CS") where.createdByUserId = req.user.id;

  // Finance sees finance pipeline
  if (role === "FINANCE") {
    where.status = {
      in: [
        "NEW_REQUEST",
        "FINANCE_WAITING_APPROVAL",
        "FINANCE_APPROVED",
        "READY_FOR_DELIVERY",
        "DELIVERED",
      ],
    };
  }

  // Designer sees only design pipeline
  if (role === "DESIGNER") {
    where.status = {
      in: ["DESIGN_PENDING", "DESIGN_WAITING", "IN_DESIGN", "DESIGN_DONE"],
    };
  }

  // Operator sees only production pipeline
  if (role === "OPERATOR") {
    where.status = {
      in: [
        "PRODUCTION_PENDING",
        "PRODUCTION_WAITING",
        "IN_PRODUCTION",
        "PRODUCTION_DONE",
      ],
    };
  }

  if (status) where.status = status;

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  res.json({ jobs });
}

export async function cancelJob(req, res) {
  const { id } = req.params;
  const { reason, note } = req.body || {};

  const r = String(reason || "").trim();
  const n = String(note || "").trim();

  if (!r) return res.status(400).json({ message: "reason is required" });

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return res.status(404).json({ message: "Job not found" });

  // update status only (soft cancel)
  const updated = await prisma.job.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  // history log (keep record)
  await prisma.jobHistory.create({
    data: {
      jobId: id,
      actorId: req.user?.id || null,
      actorRole: req.user?.role || null,
      action: "CANCEL_JOB",
      fromStatus: job.status,
      toStatus: "CANCELLED",
      note: n ? `${r} — ${n}` : r,
    },
  });

  // IMPORTANT: no finance notifications here (your requirement)
  res.json({ job: updated });
}


export async function deleteJob(req, res) {
  const { id } = req.params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return res.status(404).json({ message: "Job not found" });

  await prisma.notification.deleteMany({ where: { jobId: id } });
  await prisma.jobHistory.deleteMany({ where: { jobId: id } });
  await prisma.job.delete({ where: { id } });

  return res.json({ success: true, message: "Job deleted" });
}
