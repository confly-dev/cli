import chalk from "chalk";
import { config } from "./config";
import { select, password, input } from "@inquirer/prompts";
import { conflyApi } from "./api";

export async function logout() {
  if (!config.has("authKey")) {
    console.error(chalk.red("You are not logged in!"));
    process.exit(1);
  }

  config.unset("authKey");

  console.log(chalk.green("Successfully logged out!"));
}

export async function login() {
  const method = await select({
    message: "Select a method to login with",
    choices: [
      {
        name: "key",
        value: "key",
        description: "Login with an existing API key",
      },
      {
        name: "credentials",
        value: "credentials",
        description: "Login with your email address or username and password",
      },
    ],
  });

  if (method === "key") {
    const key = await password({
      message: "Enter your API key",
    });

    const valid = await testAuthKey(key);

    if (!valid) {
      console.error(chalk.red("Invalid API key!"));
      process.exit(1);
    }

    config.set("authKey", key);

    console.log(chalk.green("Successfully logged in!"));
  } else {
    const identifier = await input({
      message: "Enter your email address or username",
    });

    const pw = await password({
      message: "Enter your password",
    });

    const token = await tryLogin(identifier, pw);

    if (!token) {
      console.error(chalk.red("Invalid credentials!"));
      process.exit(1);
    }

    config.set("authKey", token);

    console.log(chalk.green("Successfully logged in!"));
  }
}

async function tryLogin(
  identifier: string,
  password: string
): Promise<string | false> {
  try {
    const response = await conflyApi.login(identifier, password);
    if (response.status < 200 || response.status >= 300) {
      return false;
    }

    return response.data.token;
  } catch (err) {
    return false;
  }
}

export async function testAuthKey(key: string) {
  try {
    const response = await conflyApi.testAuthKey(key);
    if (response.status < 200 || response.status >= 300) {
      return false;
    }

    return response.data.token === key;
  } catch (err) {
    return false;
  }
}
