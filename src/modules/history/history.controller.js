import { prisma } from "../../db/prismaClient.js";

export async function listHistory(req, res) {
  const limit = Math.min(Number(req.query.limit || 200), 500);
  const jobId = req.query.jobId || null;

  const where = jobId ? { jobId } : {};

  const items = await prisma.jobHistory.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  res.json({ items });
}
