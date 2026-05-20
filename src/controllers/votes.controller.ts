import { Request, Response } from "express";

import VoteService from "../services/vote.service";

class VotesController {
  async placeVote(
    req: Request,
    res: Response
  ) {
    try {
      const {
        eventId,
        eventOptionId,
        pointsInvested,
      } = req.body;

      const data =
        await VoteService.placeVote({
          userId: req.user!.userId,

          eventId,

          eventOptionId,

          pointsInvested,
        });

      return res.status(201).json({
        success: true,
        message: "Vote placed successfully",
        data,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to place vote",
      });
    }
  }
}

export default new VotesController();