import {
  pgEnum,
  pgTable,
  uuid,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { events } from "./events";
import { votes } from "./votes";

export const transactionTypeEnum = pgEnum(
  "transaction_type",
  ["VOTE", "WIN"]
);

export const pointTransactions = pgTable(
  "point_transactions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),

    eventId: uuid("event_id")
      .references(() => events.id)
      .notNull(),

    voteId: uuid("vote_id")
      .references(() => votes.id)
      .notNull(),

    type: transactionTypeEnum("type")
      .notNull(),

    pointsChange: integer("points_change")
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  }
);