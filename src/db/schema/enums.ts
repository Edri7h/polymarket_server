import { pgEnum } from "drizzle-orm/pg-core";

export const eventStatusEnum = pgEnum("event_status", [
  "LIVE",
  "RESOLVED",
  "CANCELLED",
]);