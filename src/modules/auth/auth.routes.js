import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { login, me } from "./auth.controller.js";
import { requireAuth } from "./auth.middleware.js";

const router = Router();

router.post("/login", asyncHandler(login));
router.get("/me", requireAuth, asyncHandler(me));

export default router;
