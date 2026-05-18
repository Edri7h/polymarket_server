import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { events } from "./events";

export const eventOptions = pgTable("event_options", {
  id: uuid("id").defaultRandom().primaryKey(),

  eventId: uuid("event_id")
    .references(() => events.id, {
      onDelete: "cascade",
    })
    .notNull(),

  optionText: text("option_text")
    .notNull(),

  totalPoints: integer("total_points")
    .default(0)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});