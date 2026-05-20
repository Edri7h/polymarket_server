import { Request, Response } from "express";

import AuthService from "../services/auth.service";

class AuthController {

  async googleAuth(
    req: Request,
    res: Response
  ) {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({
          success: false,
          message:
            "Credential is required",
        });
      }

      const data =
        await AuthService.googleLogin(
          credential
        );



      res.cookie("token", data.token, {
        httpOnly: true,
        secure: false, // true in production
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Authentication successful",
        data: data.user,
        user: data.user,
      });


    } catch (error) {
      return res.status(401).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Authentication failed",
      });
    }
  }


  async getMe(req: Request, res: Response) {
    try {
      const user = await AuthService.getUserById(
        req.user!.userId
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  }



  async logout(
    req: Request,
    res: Response
  ) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Signed out successfully",
    });
  }
}

export default new AuthController();
