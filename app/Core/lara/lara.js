#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";
import db from "../../../config/db.js";

const program = new Command();

program.version("1.0.0");

// --- CONTROLLER HELPER ---
function createController(name) {
  if (!name) {
    console.log("Please provide a controller name!");
    return;
  }

  const controllerName = name.endsWith("Controller")
    ? name
    : `${name}Controller`;
  const filePath = path.join(
    process.cwd(),
    "app",
    "Http",
    "Controllers",
    `${controllerName}.js`
  );

  if (fs.existsSync(filePath)) {
    console.log(`Controller ${controllerName} already exists!`);
    return;
  }

  const content = `export default class ${controllerName} {
  index(req, res) { res.send('Index method'); }
  show(req, res) { res.send('Show method'); }
  create(req, res) { res.send('Create method'); }
  store(req, res) { res.send('Store method'); }
  update(req, res) { res.send('Update method'); }
  destroy(req, res) { res.send('Destroy method'); }
}
`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Controller created: ${filePath}`);
}

// --- MODEL HELPER ---
function createModel(name) {
  if (!name) {
    console.log("Please provide a model name!");
    return;
  }

  const modelName = name.endsWith("Model") ? name : `${name}Model`;
  const filePath = path.join(process.cwd(), "app", "Models", `${modelName}.js`);

  if (fs.existsSync(filePath)) {
    console.log(`Model ${modelName} already exists!`);
    return;
  }

  const content = `export default class ${modelName} {
  constructor() {
    // Define your properties here
  }

  // Example methods
  find(id) {
    // Fetch a record by id
  }

  all() {
    // Fetch all records
  }
}
`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Model created: ${filePath}`);
}

function createMigration(name) {
  if (!name) {
    console.log("Please provide a migration name!");
    return;
  }

  const timestamp = Date.now();
  const fileName = `${timestamp}_${name}.js`;
  const migrationsPath = path.join(process.cwd(), "database", "migrations");
  const filePath = path.join(migrationsPath, fileName);

  if (fs.existsSync(filePath)) {
    console.log(`Migration already exists: ${fileName}`);
    return;
  }

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

// -- Migration Helper ---
async function runMigrations() {
  const migrationsPath = path.join(process.cwd(), "database", "migrations");

  if (!fs.existsSync(migrationsPath)) {
    console.log("No migrations folder found.");
    return;
  }

  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith(".js"));

  if (files.length === 0) {
    console.log("No migration files found.");
    return;
  }

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

// -- Fresh Migration Helper ---

async function freshMigrations() {
  const migrationsPath = path.join(process.cwd(), "database", "migrations");

  if (!fs.existsSync(migrationsPath)) {
    console.log("No migrations folder found.");
    return;
  }

  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith(".js"))
    .sort();

  if (files.length === 0) {
    console.log("No migration files found.");
    return;
  }

  console.log("💣 Dropping all tables...\n");

  // Run DOWN in reverse order
  for (const file of [...files].reverse()) {
    const filePath = path.join(migrationsPath, file);

    try {
      const migration = await import(`file://${filePath}`);

      if (typeof migration.down === "function") {
        await migration.down(db);
        console.log(`🗑 Dropped: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Failed dropping: ${file}`);
      console.error(error.message);
      return;
    }
  }

  console.log("\n🔄 Re-running migrations...\n");

  // Run UP in normal order
  for (const file of files) {
    const filePath = path.join(migrationsPath, file);

    try {
      const migration = await import(`file://${filePath}`);

      if (typeof migration.up === "function") {
        await migration.up(db);
        console.log(`✅ Migrated: ${file}`);
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
  .action(() => runMigrations());

program
  .command("migrate:fresh")
  .description("Drop all tables and re-run all migrations")
  .action(() => freshMigrations());

program.parse(process.argv);
