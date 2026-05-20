import { desc, eq } from "drizzle-orm";

import { db } from "../db";

import { pointTransactions } from "../db/schema/pointTransactions";

class TransactionService {

  async getMyTransactions(
    userId: string
  ) {

    return await db.query.pointTransactions.findMany({
      where: eq(
        pointTransactions.userId,
        userId
      ),

      with: {
        event: true,
      },

      orderBy: (
        pointTransactions,
        { desc }
      ) => [
        desc(
          pointTransactions.createdAt
        ),
      ],
    });
  }
}

export default new TransactionService();