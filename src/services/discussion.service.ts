import { desc, eq } from "drizzle-orm";

import { db } from "../db";
import { discussions } from "../db/schema/discussions";

class DiscussionService {
  async createDiscussion(data: {
    userId: string;
    eventId: string;
    comment: string;
  }) {
    const insertedDiscussions = await db
      .insert(discussions)
      .values({
        userId: data.userId,
        eventId: data.eventId,
        comment: data.comment,
      })
      .returning();

    const createdDiscussion = insertedDiscussions[0];

    return await db.query.discussions.findFirst({
      where: eq(discussions.id, createdDiscussion.id),
      with: {
        user: true,
      },
    });
  }

  // async getDiscussionsByEvent(eventId: string) {
  //   return await db.query.discussions.findMany({
  //     where: eq(discussions.eventId, eventId),
  //     with: {
  //       user: true,
  //     },
  //     orderBy: [desc(discussions.createdAt)],
  //   });
  // }

  async getDiscussionsByEvent(
  eventId: string
) {
  return await db.query.discussions.findMany({
    where: eq(
      discussions.eventId,
      eventId
    ),

    with: {
      user: true,
    },

    orderBy: [
      desc(discussions.createdAt),
    ],

    limit: 15,
  });
}
}

export default new DiscussionService();
