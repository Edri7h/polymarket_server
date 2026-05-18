import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const eventCategories = pgTable("event_categories", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull().unique(),

  slug: text("slug").notNull().unique(),

  createdAt: timestamp("created_at").defaultNow(),
});