import { and, eq, sql } from "drizzle-orm";

import { db } from "../db";

import { users } from "../db/schema/users";
import { votes } from "../db/schema/votes";
import { events } from "../db/schema/events";
import { eventOptions } from "../db/schema/eventOptions";
import { pointTransactions } from "../db/schema/pointTransactions";
import { eventSentimentHistory } from "../db/schema/eventSentimentHistory";




class VoteService {
    async placeVote(data: any) {
        const {
            userId,
            eventId,
            eventOptionId,
            pointsInvested,
        } = data;

        return await db.transaction(
            async (tx) => {

                // =========================
                // USER
                // =========================

                const user =
                    await tx.query.users.findFirst({
                        where: eq(users.id, userId),
                    });

                if (!user) {
                    throw new Error("User not found");
                }

                if ((user.points ?? 0) < pointsInvested) {
                    throw new Error(
                        "Insufficient points"
                    );
                }

                // =========================
                // EVENT
                // =========================

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
                    event.status !== "LIVE"
                ) {
                    throw new Error(
                        "Event already resolved"
                    );
                }

                if (
                    new Date(event.endsAt) <
                    new Date()
                ) {
                    throw new Error(
                        "Voting closed"
                    );
                }

                // =========================
                // ALREADY VOTED?
                // =========================

                const existingVote =
                    await tx.query.votes.findFirst({
                        where: and(
                            eq(votes.userId, userId),
                            eq(votes.eventId, eventId)
                        ),
                    });

                if (existingVote) {
                    throw new Error(
                        "Already voted"
                    );
                }

                // =========================
                // CREATE VOTE
                // =========================

                const insertedVotes =
                    await tx
                        .insert(votes)
                        .values({
                            userId,
                            eventId,
                            eventOptionId,
                            pointsInvested,
                        })
                        .returning();

                const createdVote =
                    insertedVotes[0];

                // =========================
                // DEDUCT USER POINTS
                // =========================

                await tx
                    .update(users)
                    .set({
                        points:
                            (user.points ?? 0) -
                            pointsInvested,
                    })
                    .where(eq(users.id, userId));

                // =========================
                // UPDATE EVENT TOTALS
                // =========================

                await tx
                    .update(events)
                    .set({
                        totalPoints:
                            event.totalPoints +
                            pointsInvested,

                        totalParticipants:
                            event.totalParticipants +
                            1,
                    })
                    .where(eq(events.id, eventId));

                // =========================
                // UPDATE OPTION TOTALS
                // =========================

                const option =
                    await tx.query.eventOptions.findFirst({
                        where: eq(
                            eventOptions.id,
                            eventOptionId
                        ),
                    });

                if (!option) {
                    throw new Error(
                        "Option not found"
                    );
                }

                await tx
                    .update(eventOptions)
                    .set({
                        totalPoints:
                            option.totalPoints +
                            pointsInvested,
                    })
                    .where(
                        eq(
                            eventOptions.id,
                            eventOptionId
                        )
                    );

                // =========================
                // TRANSACTION ENTRY
                // =========================

                await tx
                    .insert(pointTransactions)
                    .values({
                        userId,
                        eventId,
                        voteId: createdVote.id,

                        type: "VOTE",

                        pointsChange:
                            -pointsInvested,
                    });

                // =========================
                // SENTIMENT HISTORY
                // =========================

                const allOptions =
                    await tx.query.eventOptions.findMany({
                        where: eq(
                            eventOptions.eventId,
                            eventId
                        ),
                    });

                const totalPool =
                    allOptions.reduce(
                        (acc, curr) =>
                            acc + curr.totalPoints,
                        0
                    );

                for (const op of allOptions) {
                    const percentage =
                        totalPool === 0
                            ? 0
                            : (
                                (op.totalPoints /
                                    totalPool) *
                                100
                            ).toFixed(2);

                    await tx
                        .insert(
                            eventSentimentHistory
                        )
                        .values({
                            eventId,
                            eventOptionId: op.id,

                            percentage:
                                percentage.toString(),

                            totalPoints:
                                op.totalPoints,
                        });
                }

                return createdVote;
            }
        );
    }
}

export default new VoteService();