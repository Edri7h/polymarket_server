import { Router } from "express";

import EventsController from "../controllers/events.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { premiumMiddleware } from "../middleware/premium.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  premiumMiddleware,
  EventsController.createEvent
);

router.get("/", EventsController.getAllEvents);

router.get(
  "/category/:categoryId",
  EventsController.getEventsByCategory
);

router.get("/:id", EventsController.getEventById);

router.patch(
  "/:id/resolve",
  authMiddleware,
  premiumMiddleware,
  EventsController.resolveEvent
);
export default router;
