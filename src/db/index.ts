import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB CONNECTED ✅");
    console.log(res.rows);
  } catch (err) {
    console.error("DB FAILED ❌");
    console.error(err);
  }
}

test();