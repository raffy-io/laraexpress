#!/usr/bin/env node
import { spawn } from "child_process";
import config from "./dev-runner.config.js";

function run(command) {
  const parts = command.split(" ");
  spawn(parts[0], parts.slice(1), {
    stdio: "inherit",
    shell: true,
  });
}

console.log("🚀 Starting Dev Environment...\n");

// Tailwind
const tailwindCmd = `npx @tailwindcss/cli -i ${config.tailwind.input} -o ${
  config.tailwind.output
} ${config.tailwind.watch ? "--watch" : ""}`;
run(tailwindCmd);

// BrowserSync
const bsFiles = config.browserSync.files.join(",");
const bsOptions = Object.entries(config.browserSync.options)
  .map(([k, v]) => (v === false ? `--no-${k}` : `--${k} ${v}`))
  .join(" ");
const bsCmd = `browser-sync start --proxy '${config.browserSync.proxy}' --files '${bsFiles}' ${bsOptions}`;
run(bsCmd);

// Nodemon
const nodemonCmd = `nodemon --watch ${config.nodemon.watch.join(",")} --ext ${
  config.nodemon.ext
} ${config.nodemon.script}`;
run(nodemonCmd);
