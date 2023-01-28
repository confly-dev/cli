import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import chalk from "chalk";

export const configPath = path.join(process.cwd(), "confly.structure.json");

export function getCachePath() {
  return path.join(process.cwd(), ".confly.cache");
}

export async function apiCall(route, method, body, settings, headers) {
  const res = await fetch(`${getEndpoint()}${route}`, {
    method: method,
    body: body,
    headers: {
      authorization: `Bearer ${settings.get("token")}`,
      ...headers,
    },
  }).then((res) => res.json());
  if (res.status) {
    console.log(chalk.redBright(`${res.status}: ${res.message}`));
    if (res.errors) console.log(res.errors);
    process.exit(0);
  }
  return res;
}

export function getEndpoint() {
  return fs.existsSync(path.join(process.cwd(), "/.dev"))
    ? "http://localhost:3000/api/v1/"
    : "https://confly.dev/api/v1/";
}

export function createConfig(configPath) {
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        structure: {
          categories: [],
        },
      })
    );
  }

  const gitignoreAppendix = "\n# confly.dev cache\n.confly.cache";

  if (fs.existsSync(gitignorePath)) {
    fs.appendFileSync(gitignorePath, gitignoreAppendix);
  } else {
    fs.writeFileSync(gitignorePath, gitignoreAppendix);
  }

  console.log(
    chalk.green(
      "confly.structure.json created. Use " +
        chalk.yellow.bold("confly push") +
        " to update."
    )
  );
}

export function checkToken(settings) {
  if (!settings.get("token")) {
    console.log(
      chalk.yellow("Not logged in. Please use 'confly login' to login.")
    );
    process.exit(0);
  }
}

export function checkProject(settings) {
  if (!fs.existsSync(configPath) || !settings.get("project")) {
    console.log(
      chalk.yellow("Project not found. Please use 'confly init' first.")
    );
    process.exit(0);
  }
}
