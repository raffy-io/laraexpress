import fs from "fs";
import path from "path";
import db from "../config/db.js";

const migrationsDir = path.resolve("./database/migrations");

async function runMigrations() {
  try {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const migrationPath = path.join(migrationsDir, file);
      const migration = await import(migrationPath);

      if (typeof migration.up === "function") {
        console.log(`Running migration: ${file}`);
        await migration.up(db);
      }
    }

    console.log("✅ All JS migrations ran successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

runMigrations();
