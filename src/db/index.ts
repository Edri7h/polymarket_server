import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../config/env";

import * as relations from "./relations";
import * as tables from "./schema/index";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    ...tables,
    ...relations,
  },
});
