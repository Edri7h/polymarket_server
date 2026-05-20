import {
  NextFunction,
  Request,
  Response,
} from "express";

export const premiumMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.hasPremium) {
    return res.status(403).json({
      success: false,
      message:
        "Access required",
    });
  }

  next();
};