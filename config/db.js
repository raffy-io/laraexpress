import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();

// initialize pg-promise
const pgp = pgPromise({
  capSQL: true, // optional: capitalizes SQL keywords
});

// connection config
const db = pgp({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default db;
