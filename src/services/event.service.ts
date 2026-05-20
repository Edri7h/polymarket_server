import { eq } from "drizzle-orm";

import { db } from "../db";

import { events } from "../db/schema/events";
import { eventOptions } from "../db/schema/eventOptions";
import { pointTransactions, users, votes } from "../db/schema";

class EventService {
    async createEvent(
  data: any,
  userId: string
) {
  const {
    title,
    description,
    categoryId,
    endsAt,
    options,
  } = data;

  if (!options || options.length < 2) {
    throw new Error(
      "Minimum 2 options required"
    );
  }

  return await db.transaction(
    async (tx) => {

      // CREATE EVENT
      const insertedEvents =
        await tx
          .insert(events)
          .values({
            title,
            description,
            categoryId,
            createdBy: userId,
            endsAt: new Date(endsAt),
          })
          .returning();

      const createdEvent =
        insertedEvents[0];

      // CREATE OPTIONS
      const optionsData =
        options.map(
          (option: string) => ({
            optionText: option,
            eventId: createdEvent.id,
          })
        );

      await tx
        .insert(eventOptions)
        .values(optionsData);

      // RETURN EVENT WITH OPTIONS
      return await tx.query.events.findFirst({
        where: eq(
          events.id,
          createdEvent.id
        ),

        with: {
          options: true,
          category: true,
          creator: true,
        },
      });
    }
  );
}

    async getAllEvents() {
  return await db.query.events.findMany({
    with: {
      options: true,
      category: true,
      creator: true,
    },

    orderBy: (events, { desc }) => [
      desc(events.createdAt),
    ],
  });
}


    async getEventById(id: string) {
  const event =
    await db.query.events.findFirst({
      where: eq(events.id, id),

      with: {
        options: true,
        category: true,
        creator: true,
        discussions: {
          with: {
            user: true,
          },
        },

        sentimentHistory: true,
      },
    });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
}

    async resolveEvent(
  eventId: string,
  resolvedOptionId: string
) {
  return await db.transaction(
    async (tx) => {

      // ========================
      // EVENT
      // ========================

      const event =
        await tx.query.events.findFirst({
          where: eq(events.id, eventId),
        });

      if (!event) {
        throw new Error(
          "Event not found"
        );
      }

      if (
        event.status === "RESOLVED"
      ) {
        throw new Error(
          "Event already resolved"
        );
      }

      // ========================
      // ALL VOTES
      // ========================

      const allVotes =
        await tx.query.votes.findMany({
          where: eq(
            votes.eventId,
            eventId
          ),
        });

      // ========================
      // WINNERS / LOSERS
      // ========================

      const winningVotes =
        allVotes.filter(
          (vote) =>
            vote.eventOptionId ===
            resolvedOptionId
        );

      const losingVotes =
        allVotes.filter(
          (vote) =>
            vote.eventOptionId !==
            resolvedOptionId
        );

      // ========================
      // POOLS
      // ========================

      const winningPool =
        winningVotes.reduce(
          (acc, vote) =>
            acc +
            vote.pointsInvested,
          0
        );

      const losingPool =
        losingVotes.reduce(
          (acc, vote) =>
            acc +
            vote.pointsInvested,
          0
        );

      // ========================
      // DISTRIBUTE REWARDS
      // ========================

      for (const vote of winningVotes) {

        const reward =
          vote.pointsInvested +
          (
            (vote.pointsInvested /
              winningPool) *
            losingPool
          );

        // ========================
        // USER
        // ========================

        const user =
          await tx.query.users.findFirst({
            where: eq(
              users.id,
              vote.userId
            ),
          });

        if (!user) continue;

        // ========================
        // UPDATE BALANCE
        // ========================

        await tx
          .update(users)
          .set({
            points:
              (user.points ?? 0) +
              Math.floor(reward),
          })
          .where(
            eq(users.id, user.id)
          );

        // ========================
        // TRANSACTION ENTRY
        // ========================

        await tx
          .insert(pointTransactions)
          .values({
            userId: user.id,

            eventId,

            voteId: vote.id,

            type: "WIN",

            pointsChange:
              Math.floor(reward),
          });
      }

      // ========================
      // RESOLVE EVENT
      // ========================

      await tx
        .update(events)
        .set({
          status: "RESOLVED",

          resolvedOptionId,
        })
        .where(eq(events.id, eventId));

      return {
        success: true,
      };
    }
  );
}

    async getEventsByCategory(
  categoryId: string
) {
  return await db.query.events.findMany({
    where: eq(
      events.categoryId,
      categoryId
    ),

    with: {
      options: true,
      category: true,
      creator: true,
    },
  });
}
    

}

export default new EventService();