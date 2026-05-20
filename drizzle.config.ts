import "dotenv/config";

import { defineConfig } from "drizzle-kit";

import { env } from "./src/config/env";
// import process from "node:process";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:  env.DATABASE_URL,
  },
});