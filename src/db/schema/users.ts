import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  googleId: text("google_id").unique(),

  name: text("name").notNull(),

  username: text("username").notNull().unique(),

  email: text("email").notNull().unique(),

  avatarUrl: text("avatar_url"),

  hasPremium: boolean("has_premium").default(false),

  points: integer("points").default(1000),

  totalVotes: integer("total_votes").default(0),

  correctVotes: integer("correct_votes").default(0),

  currentStreak: integer("current_streak").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});