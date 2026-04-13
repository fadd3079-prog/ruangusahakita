import { Router } from "express";
import {
  getProfileController,
  updateBusinessProfileController,
  updateCreatorProfileController,
  updateProfileController,
} from "../controllers/profile.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.use(requireAuth);
router.get("/me", asyncHandler(getProfileController));
router.patch("/me", asyncHandler(updateProfileController));
router.patch("/business", asyncHandler(updateBusinessProfileController));
router.patch("/creator", asyncHandler(updateCreatorProfileController));

export default router;
