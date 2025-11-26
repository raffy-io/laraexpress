#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";

const program = new Command();

program.version("1.0.0");

// --- HELPER FUNCTION TO CREATE CONTROLLER ---
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
  // Display a listing of the resource
  index(req, res) {
    res.send('Index method');
  }

  // Show a single resource
  show(req, res) {
    res.send('Show method');
  }

  // Show form to create a resource
  create(req, res) {
    res.send('Create method');
  }

  // Store a new resource
  store(req, res) {
    res.send('Store method');
  }

  // Show form to edit a resource
  update(req, res) {
    res.send('Update method');
  }

  // Delete a resource
  destroy(req, res) {
    res.send('Destroy method');
  }
}
`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");

  console.log(`Controller created: ${filePath}`);
}

// --- COMMAND: make:controller ---
program
  .command("make:controller <name>")
  .description("Create a new controller")
  .action((name) => createController(name));

program
  .command("hello [name]")
  .description("Say hello")
  .action((name) => {
    const greeting = name ? `Hello, ${name}!` : "Hello!";
    console.log(greeting);
  });

program.parse(process.argv);
