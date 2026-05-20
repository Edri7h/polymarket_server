import { Router } from "express";

import TransactionsController from "../controllers/transaction.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  TransactionsController.getMyTransactions
);

export default router;