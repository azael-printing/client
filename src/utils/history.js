import { prisma } from "../db/prismaClient.js";

export async function logHistory({
  jobId,
  actorId,
  actorRole,
  action,
  fromStatus,
  toStatus,
  note,
}) {
  await prisma.jobHistory.create({
    data: {
      jobId,
      actorId: actorId || null,
      actorRole: actorRole || null,
      action,
      fromStatus: fromStatus || null,
      toStatus: toStatus || null,
      note: note || null,
    },
  });
}
