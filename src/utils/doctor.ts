import chalk from "chalk";
import { config } from "../config";
import { testAuthKey } from "../auth";

export async function runDoctor() {
  console.log(chalk.hex("#2d7fe0").bold("Confly CLI Doctor"));

  if (config.has("authKey")) {
    const valid = await testAuthKey(config.get("authKey"));
    if (!valid) {
      console.log(chalk.red("API key found but invalid! Removing..."));
      config.unset("authKey");
    } else {
      console.log(chalk.green("API key found and valid! You are logged in."));
    }
  } else {
    console.log(chalk.yellow("No API key found! Please log in."));
  }
}
