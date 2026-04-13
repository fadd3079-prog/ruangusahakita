import { Router } from "express";
import {
  loginController,
  logoutController,
  meController,
  signupController,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.post("/signup", asyncHandler(signupController));
router.post("/login", asyncHandler(loginController));
router.post("/logout", requireAuth, asyncHandler(logoutController));
router.get("/me", requireAuth, asyncHandler(meController));

export default router;
