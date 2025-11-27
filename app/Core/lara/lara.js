#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";
import db from "../../../config/db.js";

const program = new Command();
program.version("1.0.0");

// --- CONTROLLER HELPER ---
function createController(name) {
  if (!name) return console.log("Please provide a controller name!");
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const controllerName = name.endsWith("Controller")
    ? name
    : `${name}Controller`;
  const filePath = path.join(
    process.cwd(),
    "app",
    "Http",
    "Controllers",
    `${capitalize(controllerName)}.js`
  );

  if (fs.existsSync(filePath))
    return console.log(
      `Controller ${capitalize(controllerName)} already exists!`
    );

  const content = `import BaseController from "../../Core/controller/BaseController.js";
  
  export default class ${capitalize(controllerName)} extends BaseController {
  
  index() {
    this.send("Index method");
  }
  show() {
    this.send("Show method");
  }
  create() {
    this.send("Create method");
  }
  store() {
    this.send("Store method");
  }
  update() {
    this.send("Update method");
  }
  destroy() {
    this.send("Destroy method");
  }
}
`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Controller created: ${filePath}`);
}

// --- MODEL HELPER ---
function createModel(name) {
  if (!name) return console.log("Please provide a model name!");

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const modelName = name.endsWith("Model") ? name : `${name}`;
  const filePath = path.join(
    process.cwd(),
    "app",
    "Models",
    `${capitalize(modelName)}.js`
  );

  if (fs.existsSync(filePath))
    return console.log(`Model ${capitalize(modelName)} already exists!`);

  const content = `import BaseModel from "../Core/model/BaseModel.js";

class ${capitalize(modelName)} extends BaseModel {
  constructor() {
    super("${modelName.toLowerCase()}s"); // table name
  }

  static table = "${modelName.toLowerCase()}s";
}

export default ${capitalize(modelName)};
`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Model created: ${filePath}`);
}

// --- MIGRATION HELPER ---
function createMigration(name) {
  if (!name) return console.log("Please provide a migration name!");

  const timestamp = Date.now();
  const fileName = `${timestamp}_${name}.js`;
  const migrationsPath = path.join(process.cwd(), "database", "migrations");
  const filePath = path.join(migrationsPath, fileName);

  if (fs.existsSync(filePath))
    return console.log(`Migration already exists: ${fileName}`);

  const content = `export async function up(db) {
  await db.none(\`
    CREATE TABLE IF NOT EXISTS ${name} (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW()
    )
  \`);
}

export async function down(db) {
  await db.none(\`DROP TABLE IF EXISTS ${name}\`);
}
`;

  fs.mkdirSync(migrationsPath, { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Migration created: ${filePath}`);
}

// --- RUN ALL MIGRATIONS ---
async function runMigrations() {
  const migrationsPath = path.join(process.cwd(), "database", "migrations");

  if (!fs.existsSync(migrationsPath))
    return console.log("No migrations folder found.");

  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith(".js"));
  if (!files.length) return console.log("No migration files found.");

  console.log("🔄 Running migrations...\n");

  for (const file of files) {
    const filePath = path.join(migrationsPath, file);

    try {
      const migration = await import(`file://${filePath}`);
      if (typeof migration.up === "function") {
        await migration.up(db);
        console.log(`✅ Migrated: ${file}`);
      } else {
        console.log(`⚠️ Skipped (no up function): ${file}`);
      }
    } catch (error) {
      console.error(`❌ Migration failed: ${file}`);
      console.error(error.message);
      break;
    }
  }

  console.log("\n✅ All migrations processed.");
}

// --- FRESH MIGRATIONS ---
async function freshMigrations() {
  const migrationsPath = path.join(process.cwd(), "database", "migrations");

  if (!fs.existsSync(migrationsPath))
    return console.log("No migrations folder found.");

  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith(".js"))
    .sort();
  if (!files.length) return console.log("No migration files found.");

  // 1️⃣ Drop all tables
  console.log("💣 Dropping ALL existing tables...\n");
  const tables = await db.manyOrNone(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
  );

  for (const { tablename } of tables) {
    try {
      await db.none(`DROP TABLE IF EXISTS "${tablename}" CASCADE;`);
      console.log(`🗑 Dropped table: ${tablename}`);
    } catch (err) {
      console.error(`❌ Failed dropping table: ${tablename}`);
    }
  }

  console.log("\n✅ All tables dropped!\n");

  // 2️⃣ Run migrations in UP order
  console.log("🔄 Running migrations...\n");

  for (const file of files) {
    const filePath = path.join(migrationsPath, file);

    try {
      const migration = await import(`file://${filePath}`);
      if (typeof migration.up === "function") {
        await migration.up(db);
        console.log(`✅ Migrated: ${file}`);
      } else {
        console.log(`⚠️ Skipped (no up function): ${file}`);
      }
    } catch (error) {
      console.error(`❌ Migration failed: ${file}`);
      console.error(error.message);
      return;
    }
  }

  console.log("\n🎉 Database refreshed successfully!");
}

// --- COMMANDS ---
program
  .command("make:controller <name>")
  .description("Create a new controller")
  .action((name) => createController(name));

program
  .command("make:model <name>")
  .description("Create a new model")
  .action((name) => createModel(name));

program
  .command("make:migration <name>")
  .description("Create a new migration file")
  .action((name) => createMigration(name));

program
  .command("migrate")
  .description("Run all database migrations")
  .action(async () => await runMigrations());

program
  .command("migrate:fresh")
  .description("Drop all tables and re-run all migrations")
  .action(async () => await freshMigrations());

program.parse(process.argv);
