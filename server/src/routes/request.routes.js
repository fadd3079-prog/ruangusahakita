import { Router } from "express";
import {
  createRequestController,
  getRequestController,
  listIncomingRequestsController,
  listRequestsController,
  updateRequestStatusController,
} from "../controllers/request.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.use(requireAuth);
router.post("/", asyncHandler(createRequestController));
router.get("/", asyncHandler(listRequestsController));
router.get("/incoming", asyncHandler(listIncomingRequestsController));
router.get("/:requestId", asyncHandler(getRequestController));
router.patch("/:requestId/status", asyncHandler(updateRequestStatusController));

export default router;
