import { Router } from "express";
import { requireAuth, requireRole } from "../auth/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { machineOverview } from "./admin.controller.js";

const router = Router();

router.get(
  "/machine-overview",
  requireAuth,
  requireRole("ADMIN", "CS"),
  asyncHandler(machineOverview),
);
export default router;
