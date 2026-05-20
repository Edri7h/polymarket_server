import {
  pgTable,
  uuid,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

import { events } from "./events";
import { eventOptions } from "./eventOptions";

export const eventSentimentHistory = pgTable(
  "event_sentiment_history",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    eventId: uuid("event_id")
      .references(() => events.id)
      .notNull(),

    eventOptionId: uuid("event_option_id")
      .references(() => eventOptions.id)
      .notNull(),

    percentage: numeric("percentage", {
      precision: 5,
      scale: 2,
    }).notNull(),

    totalPoints: integer("total_points")
      .notNull(),

    recordedAt: timestamp("recorded_at")
      .defaultNow()
      .notNull(),
  }
);