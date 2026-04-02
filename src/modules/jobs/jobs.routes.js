import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth, requireRole } from "../auth/auth.middleware.js";
import { createJob, listJobs, cancelJob, deleteJob } from "./jobs.controller.js";
import { updateJob } from "./jobs.update.controller.js";
import { workflowAction } from "./jobs.workflow.controller.js";

const router = Router();

// CS and ADMIN can create jobs
router.post(
  "/",
  requireAuth,
  requireRole("CS", "ADMIN"),
  asyncHandler(createJob),
);

// Any logged user can view jobs (we’ll filter by role later)
router.get("/", requireAuth, asyncHandler(listJobs));

// update Job
router.patch("/:id", requireAuth, asyncHandler(updateJob));
// cancel Job
router.patch(
  "/:id/cancel",
  requireAuth,
  requireRole("ADMIN", "CS"),
  asyncHandler(cancelJob),
);
router.post("/:id/workflow", requireAuth, asyncHandler(workflowAction));

export default router;

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "CS"),
  asyncHandler(deleteJob),
);
