import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../../db/prismaClient.js";

const LoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export async function login(req, res) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid input" });

  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.isActive)
    return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "30m" },
  );

  res.json({
    accessToken,
    user: { id: user.id, username: user.username, role: user.role },
    expiresIn: process.env.JWT_EXPIRES_IN || "30m",
  });
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
  res.json({ user });
}
