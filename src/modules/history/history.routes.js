import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth, requireRole } from "../auth/auth.middleware.js";
import { listHistory } from "./history.controller.js";

const router = Router();

// Only FINANCE and ADMIN can view audit log
router.get(
  "/",
  requireAuth,
  requireRole("FINANCE", "ADMIN"),
  asyncHandler(listHistory),
);

export default router;
