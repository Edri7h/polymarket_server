import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { eventCategories } from "./categories";
import { eventStatusEnum } from "./enums";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title").notNull(),

  description: text("description").notNull(),

  bannerImageUrl: text("banner_image_url"),

  categoryId: uuid("category_id")
    .references(() => eventCategories.id)
    .notNull(),

  createdBy: uuid("created_by")
    .references(() => users.id)
    .notNull(),

  status: eventStatusEnum("status")
    .default("LIVE")
    .notNull(),

  endsAt: timestamp("ends_at")
    .notNull(),

  resolvedOptionId: uuid("resolved_option_id"),

  totalPoints: integer("total_points")
    .default(0)
    .notNull(),

  totalParticipants: integer("total_participants")
    .default(0)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});