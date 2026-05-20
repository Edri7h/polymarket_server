import { Request, Response } from "express";

import EventService from "../services/event.service";

class EventsController {
  async createEvent(
    req: Request,
    res: Response
  ) {
    try {
      const event =
        await EventService.createEvent(
          req.body,
          req.user!.userId
        );

      return res.status(201).json({
        success: true,
        data: event,
        event,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create event",
      });
    }
  }

  async getAllEvents(
    req: Request,
    res: Response
  ) {
    try {
      const events =
        await EventService.getAllEvents();

      return res.status(200).json({
        success: true,
        data: events,
        events,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch events",
      });
    }
  }

  async getEventById(
    req: Request,
    res: Response
  ) {
    try {
      const event =
        await EventService.getEventById(
          req.params.id as string
        );

      return res.status(200).json({
        success: true,
        data: event,
        event,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch event",
      });
    }
  }

  async resolveEvent(
    req: Request,
    res: Response
  ) {
    try {
      console.log(req.body);
      const data =
        await EventService.resolveEvent(
          req.params.id as string,
          req.body.resolvedOptionId
        );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to resolve event",
      });
    }
  }



  async getEventsByCategory(
  req: Request,
  res: Response
) {
  try {
    const events =
      await EventService.getEventsByCategory(
        req.params.categoryId as string
      );

    return res.status(200).json({
      success: true,
      data: events,
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch events",
    });
  }
}
}

export default new EventsController();
