// import { relations } from "drizzle-orm";

import { users } from "./schema/users";
import { votes } from "./schema/votes";
import { events } from "./schema/events";
import { discussions } from "./schema/discussions";
import { eventCategories } from "./schema/categories";
import { eventOptions } from "./schema/eventOptions";
import { eventSentimentHistory } from "./schema/eventsentimentHistory";


// export const usersRelations = relations(users, ({ many }) => ({
//     votes: many(votes),
//     discussions: many(discussion),
//     events: many(events)
// }));


// export const votesRelations = relations(votes, ({ one }) => ({
//     user: one(users, {
//         fields: [votes.userId],
//         references: [users.id],
//     }),
//     event: one(events, {
//         fields: [votes.eventId],
//         references: [events.id]
//     }),
//     eventOption: one(eventOptions, {
//         fields: [votes.eventOptionId],
//         references: [eventOptions.id]
//     })
// }));


// export const eventsRelations = relations(events, ({ one, many }) => ({
//     creater: one(users, {
//         fields: [events.createdBy],
//         references: [users.id],
//     }),
//     category: one(eventCategories, {
//         fields: [events.categoryId],
//         references: [eventCategories.id]
//     }),
//     options: many(eventOptions),
//     discussions: many(discussion),
//     votes: many(votes),
//     sentimentHistory: many(eventSentimentHistory)
// }))



// export const eventDiscussionRelations = relations(discussion, ({ one }) => ({
//     user: one(users, {
//         fields: [discussion.userId],
//         references: [users.id]

//     }),
//     event: one(events, {
//         fields: [discussion.eventId],
//         references: [events.id]
//     })
// }))




// export const eventOptionsRelations = relations(
//     eventOptions, ({ one,many }) => ({

//         event:one(events,{
//             fields:[eventOptions.eventId],
//             references:[events.id]
//         }),

//         votes: many(votes),
//         sentimentHistory:many(eventSentimentHistory)



// }))


// export const eventCategoriesRelations=relations(
//     eventCategories,({many})=>({
//     events:many(events),
// }))

// export const eventSentimentHistoryRelations=relations(({one,many})=>({
//     event:one(events,{
//         fields:[eventSentimentHistory.eventId],
//         references:[events.id]
//     }),
//     eventOption:one(eventOptions,{
//         fields:[eventSentimentHistory.eventOptionId],
//         references:[eventOptions.id]
//     })

// }))

import { relations } from "drizzle-orm";

// import { users } from "./schema/users";
// import { events } from "./schema/events";
// import { votes } from "./schema/votes";
// import { discussions } from "./schema/discussions";
// import { eventOptions } from "./schema/eventOptions";
// import { eventCategories } from "./schema/categories";
// import { eventSentimentHistory } from "./schema/eventSentimentHistory";


// ================= USERS =================

export const usersRelations = relations(users, ({ many }) => ({
  votes: many(votes),

  events: many(events),

  discussions: many(discussions),
}));


// ================= EVENTS =================

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),

  category: one(eventCategories, {
    fields: [events.categoryId],
    references: [eventCategories.id],
  }),

  options: many(eventOptions),

  votes: many(votes),

  discussions: many(discussions),

  sentimentHistory: many(eventSentimentHistory),
}));


// ================= EVENT OPTIONS =================

export const eventOptionsRelations = relations(
  eventOptions,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventOptions.eventId],
      references: [events.id],
    }),

    votes: many(votes),

    sentimentHistory: many(eventSentimentHistory),
  })
);


// ================= VOTES =================

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),

  event: one(events, {
    fields: [votes.eventId],
    references: [events.id],
  }),

  eventOption: one(eventOptions, {
    fields: [votes.eventOptionId],
    references: [eventOptions.id],
  }),
}));


// ================= DISCUSSIONS =================

export const discussionsRelations = relations(
  discussions,
  ({ one }) => ({
    user: one(users, {
      fields: [discussions.userId],
      references: [users.id],
    }),

    event: one(events, {
      fields: [discussions.eventId],
      references: [events.id],
    }),
  })
);


// ================= EVENT CATEGORIES =================

export const eventCategoriesRelations = relations(
  eventCategories,
  ({ many }) => ({
    events: many(events),
  })
);


// ================= EVENT SENTIMENT HISTORY =================

export const eventSentimentHistoryRelations = relations(
  eventSentimentHistory,
  ({ one }) => ({
    event: one(events, {
      fields: [eventSentimentHistory.eventId],
      references: [events.id],
    }),

    eventOption: one(eventOptions, {
      fields: [eventSentimentHistory.eventOptionId],
      references: [eventOptions.id],
    }),
  })
);