import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth } from "../auth/auth.middleware.js";

import { myNotifications, markRead } from "./notifications.controller.js";
import { workflowAction } from "../jobs/jobs.workflow.controller.js";

const router = Router();

router.get("/me", requireAuth, asyncHandler(myNotifications));
router.post("/:id/read", requireAuth, asyncHandler(markRead));
router.post("/:id/workflow", requireAuth, asyncHandler(workflowAction));
export default router;
