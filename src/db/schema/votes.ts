import {
    pgTable,
    timestamp,
    integer,
    uuid,
    unique
} from
    "drizzle-orm/pg-core";
import { eventOptions } from "./eventOptions";
import { users } from "./users";
import { events } from "./events";


// import { timestamp } from "drizzle-orm/pg-core";




export const votes = pgTable("votes", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    eventOptionId: uuid("event_option_id").references(() => eventOptions.id).notNull(),
    eventId: uuid("event_id").references(() => events.id).notNull(),
    pointsInvested: integer("points_invested").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
},

(table) => ({   
    uniqueUserEventVote:unique().
    on(table.userId,table.eventId),
})

)