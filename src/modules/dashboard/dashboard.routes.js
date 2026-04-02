import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth, requireRole } from "../auth/auth.middleware.js";
import { adminDashboard } from "./dashboard.controller.js";

const router = Router();

// Admin dashboard summary
router.get(
  "/admin",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(adminDashboard),
);

export default router;
