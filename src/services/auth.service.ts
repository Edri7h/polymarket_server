import { eq } from "drizzle-orm";

import { db } from "../db";
import { users } from "../db/schema/users";

import { verifyGoogleToken } from "../utils/google";
import { generateToken } from "../utils/jwt";

class AuthService {
  async googleLogin(credential: string) {
    // Verify Google Token
    const payload = await verifyGoogleToken(
      credential
    );

    if (!payload || !payload.email) {
      throw new Error("Invalid Google token");
    }

    // Check Existing User
    let existingUser =
      await db.query.users.findFirst({
        where: eq(
          users.email,
          payload.email
        ),
      });

    // Create User
    if (!existingUser) {
      const insertedUsers = await db
        .insert(users)
        .values({
          email: payload.email,
          username: payload.email.split("@")[0] + (Math.floor(Math.random()*1000)),
          name: payload.name || "Unknown",
          avatarUrl: payload.picture || null,
          googleId: payload.sub,
        })
        .returning();

      existingUser = insertedUsers[0];
    }

    // Generate JWT
    const token = generateToken({
      userId: existingUser.id,
      hasPremium: existingUser.hasPremium,
      email: existingUser.email,
    });

    return {
      token,
      user: existingUser,
    };
  }

  async getUserById(userId: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }

  
}

export default new AuthService();
