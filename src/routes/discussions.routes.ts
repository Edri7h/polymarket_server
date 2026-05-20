import { Router } from "express";

import DiscussionsController from "../controllers/discussions.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  DiscussionsController.createDiscussion
);

router.get(
  "/event/:eventId",
  DiscussionsController.getDiscussionsByEvent
);

export default router;
