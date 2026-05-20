import { Request, Response } from "express";

import TransactionService from "../services/transaction.service";

class TransactionsController {
  async getMyTransactions(
    req: Request,
    res: Response
  ) {
    try {

      const data =
        await TransactionService.getMyTransactions(
          req.user!.userId
        );

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch transactions",
      });

    }
  }
}

export default new TransactionsController();