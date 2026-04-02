import { prisma } from "../db/prismaClient.js";

export async function notifyUser({ userId, jobId, type, message }) {
  return prisma.notification.create({
    data: { userId, jobId: jobId || null, type, message, isRead: false },
  });
}

export async function notifyRole({ role, jobId, type, message }) {
  const users = await prisma.user.findMany({
    where: { role, isActive: true },
    select: { id: true },
  });

  if (!users.length) return;

  await prisma.notification.createMany({
    data: users.map((u) => ({
      userId: u.id,
      jobId: jobId || null,
      type,
      message,
      isRead: false,
    })),
  });
}
