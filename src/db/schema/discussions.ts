import { pgTable, uuid, text } from "drizzle-orm/pg-core";

import { users } from "./users";
import { events } from "./events";
import { boolean } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";



export const discussions = pgTable("discussion", {
    id:uuid("id").defaultRandom().primaryKey(),
    userId:uuid("user_id").notNull().references(() => users.id),
    eventId:uuid("event_id").notNull().references(() => events.id),
    comment:text("comment").notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),

    createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),

})