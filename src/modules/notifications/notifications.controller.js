import { prisma } from "../../db/prismaClient.js";
import { notifyUser } from "../../utils/notify.js";
import { logHistory } from "../../utils/history.js";

export async function myNotifications(req, res) {
  const items = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  res.json({ notifications: items });
}

export async function markRead(req, res) {
  const id = req.params.id;

  const n = await prisma.notification.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!n) return res.status(404).json({ message: "Notification not found" });

  if (n.isRead) return res.json({ notification: n });

  const updated = await prisma.notification.update({
    where: { id },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  // Log read
  if (updated.jobId) {
    await logHistory({
      jobId: updated.jobId,
      actorId: req.user.id,
      actorRole: req.user.role,
      action: "NOTIFICATION_READ",
      note: `type=${updated.type}`,
    });
  }

  // ACK back to CS if actor is not CS
  if (
    updated.jobId &&
    ["FINANCE", "DESIGNER", "OPERATOR"].includes(req.user.role)
  ) {
    const job = await prisma.job.findUnique({
      where: { id: updated.jobId },
    });

    if (job) {
      await notifyUser({
        userId: job.createdByUserId,
        jobId: job.id,
        type: "ACK_READ",
        message: `${req.user.role} opened notification for Job #${job.jobNo}`,
      });

      await logHistory({
        jobId: job.id,
        actorId: req.user.id,
        actorRole: req.user.role,
        action: "ACK_SENT_TO_CS",
      });
    }
  }

  res.json({ notification: updated });
}
