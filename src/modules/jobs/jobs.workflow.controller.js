import { z } from "zod";
import { prisma } from "../../db/prismaClient.js";

import { notifyRole, notifyUser } from "../../utils/notify.js";
import { logHistory } from "../../utils/history.js";

const Schema = z.object({
  action: z.string(),
});

function requireRole(role, allowed) {
  return allowed.includes(role);
}

export async function workflowAction(req, res) {
  const parsed = Schema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid action" });

  const { action } = parsed.data;
  const jobId = req.params.id;

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return res.status(404).json({ message: "Job not found" });

  const role = req.user.role;

  async function updateStatus(nextStatus, note) {
    const updated = await prisma.job.update({
      where: { id: jobId },
      data: { status: nextStatus },
    });

    await logHistory({
      jobId,
      actorId: req.user.id,
      actorRole: role,
      action,
      fromStatus: job.status,
      toStatus: nextStatus,
      note,
    });

    return updated;
  }

  // ---------------- FINANCE ----------------

  if (action === "FINANCE_SET_WAITING") {
    if (!requireRole(role, ["FINANCE", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });
    if (job.status !== "NEW_REQUEST")
      return res.status(400).json({ message: "Must be NEW_REQUEST" });

    const updated = await updateStatus(
      "FINANCE_WAITING_APPROVAL",
      "Finance set waiting",
    );

    await notifyUser({
      userId: updated.createdByUserId,
      jobId,
      type: "FINANCE_WAITING",
      message: `Finance set WAITING for Job #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  if (action === "FINANCE_APPROVE") {
    if (!requireRole(role, ["FINANCE", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });
    if (!["NEW_REQUEST", "FINANCE_WAITING_APPROVAL"].includes(job.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await updateStatus("FINANCE_APPROVED", "Finance approved");

    await notifyUser({
      userId: updated.createdByUserId,
      jobId,
      type: "FINANCE_APPROVED",
      message: `Finance APPROVED Job #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  // ---------------- CS ----------------

  if (action === "CS_SEND_TO_DESIGNER") {
    if (!requireRole(role, ["CS", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });
    if (job.status !== "FINANCE_APPROVED")
      return res.status(400).json({ message: "Finance must approve first" });
    if (!job.designerRequired)
      return res.status(400).json({ message: "No design required" });

    const updated = await updateStatus("DESIGN_PENDING", "Sent to designer");

    await notifyRole({
      role: "DESIGNER",
      jobId,
      type: "DESIGN_REQUEST",
      message: `Design request: Job #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  if (action === "CS_SEND_TO_OPERATOR") {
    if (!requireRole(role, ["CS", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });

    const allowed =
      (job.status === "FINANCE_APPROVED" && !job.designerRequired) ||
      job.status === "DESIGN_DONE";

    if (!allowed)
      return res.status(400).json({ message: "Not ready for production" });

    const updated = await updateStatus(
      "PRODUCTION_PENDING",
      "Sent to operator",
    );

    await notifyRole({
      role: "OPERATOR",
      jobId,
      type: "PRODUCTION_REQUEST",
      message: `Production request: Job #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  if (action === "CS_READY_TO_DELIVERY") {
    if (!requireRole(role, ["CS", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });
    if (job.status !== "PRODUCTION_DONE")
      return res.status(400).json({ message: "Must be PRODUCTION_DONE" });

    const updated = await updateStatus(
      "READY_FOR_DELIVERY",
      "Ready for delivery",
    );

    await notifyRole({
      role: "FINANCE",
      jobId,
      type: "JOB_DONE",
      message: `Job ready for delivery: #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  // ---------------- DESIGNER ----------------

  if (action === "DESIGNER_SET_WAITING") {
    if (!requireRole(role, ["DESIGNER", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });
    if (job.status !== "DESIGN_PENDING")
      return res.status(400).json({ message: "Must be DESIGN_PENDING" });

    const updated = await updateStatus("DESIGN_WAITING", "Designer waiting");

    await notifyUser({
      userId: updated.createdByUserId,
      jobId,
      type: "DESIGN_WAITING",
      message: `Designer set WAITING for Job #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  if (action === "DESIGNER_START") {
    if (!requireRole(role, ["DESIGNER", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });

    if (!["DESIGN_PENDING", "DESIGN_WAITING"].includes(job.status)) {
      return res.status(400).json({ message: "Invalid design state" });
    }

    const updated = await updateStatus("IN_DESIGN", "Design started");

    await notifyUser({
      userId: updated.createdByUserId,
      jobId,
      type: "DESIGN_STARTED",
      message: `Design started for Job #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  if (action === "DESIGNER_COMPLETE") {
    if (!requireRole(role, ["DESIGNER", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });
    if (job.status !== "IN_DESIGN")
      return res.status(400).json({ message: "Must be IN_DESIGN" });

    const updated = await updateStatus("DESIGN_DONE", "Design completed");

    await notifyUser({
      userId: updated.createdByUserId,
      jobId,
      type: "DESIGN_DONE",
      message: `Design completed for Job #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  // ---------------- OPERATOR ----------------

  if (action === "OPERATOR_SET_WAITING") {
    if (!requireRole(role, ["OPERATOR", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });
    if (job.status !== "PRODUCTION_PENDING")
      return res.status(400).json({ message: "Must be PRODUCTION_PENDING" });

    const updated = await updateStatus(
      "PRODUCTION_WAITING",
      "Operator waiting",
    );

    await notifyUser({
      userId: updated.createdByUserId,
      jobId,
      type: "PRODUCTION_WAITING",
      message: `Operator set WAITING for Job #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  if (action === "OPERATOR_START") {
    if (!requireRole(role, ["OPERATOR", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });

    if (!["PRODUCTION_PENDING", "PRODUCTION_WAITING"].includes(job.status)) {
      return res.status(400).json({ message: "Invalid production state" });
    }

    const updated = await updateStatus("IN_PRODUCTION", "Production started");

    await notifyUser({
      userId: updated.createdByUserId,
      jobId,
      type: "PRODUCTION_STARTED",
      message: `Production started for Job #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  if (action === "OPERATOR_COMPLETE") {
    if (!requireRole(role, ["OPERATOR", "ADMIN"]))
      return res.status(403).json({ message: "Forbidden" });
    if (job.status !== "IN_PRODUCTION")
      return res.status(400).json({ message: "Must be IN_PRODUCTION" });

    const updated = await updateStatus(
      "PRODUCTION_DONE",
      "Production completed",
    );

    await notifyUser({
      userId: updated.createdByUserId,
      jobId,
      type: "PRODUCTION_DONE",
      message: `Production completed for Job #${updated.jobNo}`,
    });

    return res.json({ job: updated });
  }

  return res.status(400).json({ message: "Unknown action" });
}
