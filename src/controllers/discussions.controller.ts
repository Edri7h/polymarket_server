import { Request, Response } from "express";

import DiscussionService from "../services/discussion.service";

class DiscussionsController {
  async createDiscussion(req: Request, res: Response) {
    try {
      const { eventId, comment } = req.body;

      if (!eventId || !comment?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Event and comment are required",
        });
      }

      const discussion = await DiscussionService.createDiscussion({
        userId: req.user!.userId,
        eventId,
        comment: comment.trim(),
      });

      return res.status(201).json({
        success: true,
        data: discussion,
        discussion,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create discussion",
      });
    }
  }

  async getDiscussionsByEvent(req: Request, res: Response) {
    try {
      const discussions = await DiscussionService.getDiscussionsByEvent(
        req.params.eventId as string
      );

      return res.status(200).json({
        success: true,
        data: discussions,
        discussions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch discussions",
      });
    }
  }
}

export default new DiscussionsController();
