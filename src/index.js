#!/usr/bin/env node

import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer";
import fetch from "node-fetch";
import userSettings from "user-settings";
import { FormData } from "formdata-node";
import {
  apiCall,
  getEndpoint,
  createConfig,
  checkToken,
  configPath,
  checkProject,
  getProjectId,
  getStructure,
  setStructure,
} from "./utils.js";

const settings = userSettings.file(".confly");

(async () => {
  const endPoint = getEndpoint();

  const args = process.argv.slice(2, process.argv.length);

  if (args.length == 0) {
    console.log(
      chalk.redBright("Please specify a sub command. ") +
        chalk.yellow("confly help")
    );
    process.exit(0);
  }
  switch (args[0].toLowerCase()) {
    case "help":
      console.log(chalk.green.bold("Confly Help"));
      console.log(`
  confly <command>
  
  Usage:
  
  confly init     - create a new confly project or use an existing one
  confly push     - push local structure to server
  confly pull     - update local structure from server
  confly login    - login with username and password
  confly logout   - forget token created by login
  confly status  - show the status of confly (token, project)
  `);
      break;
    case "init":
      checkToken(settings);

      inquirer
        .prompt([
          {
            type: "list",
            name: "createNew",
            message: "Do you want to create a new project?",
            choices: ["Yes", "Use existing"],
          },
        ])
        .then((answers) => {
          if (answers.createNew == "Yes") {
            inquirer
              .prompt([
                {
                  name: "projectName",
                  message: "Please enter a project name: ",
                },
              ])
              .then(async (answers) => {
                const form = new FormData();
                form.set("name", answers.projectName);
                const project = await apiCall(
                  "projects",
                  "POST",
                  form,
                  settings
                );

                createConfig(configPath, project.id);
                console.log(chalk.green.bold("Created new confly project"));
              });
          } else {
            inquirer
              .prompt([
                {
                  name: "projectId",
                  message: "Please enter an existing project id: ",
                },
              ])
              .then(async (answers) => {
                const project = await apiCall(
                  `projects/${answers.projectId}`,
                  "GET",
                  null,
                  settings
                );
                createConfig(configPath, project.id);
                console.log(
                  chalk.green.bold("Confirmed existing confly project")
                );
              });
          }
        });
      break;
    case "push":
      checkToken(settings);
      checkProject(settings);

      await apiCall(
        `projects/${getProjectId()}/structure`,
        "POST",
        JSON.stringify(getStructure()),
        settings,
        { "Content-Type": "application/json" }
      );
      console.log(chalk.green.bold("Structure pushed to server"));
      break;
    case "pull":
      checkToken(settings);
      checkProject(settings);

      const res = await apiCall(
        `projects/${getProjectId()}/structure`,
        "GET",
        null,
        settings
      );
      setStructure(res);
      console.log(chalk.green.bold("Structure pulled from server"));
      break;
    case "login":
      if (settings.get("token")) {
        console.log(chalk.red("Already logged in"));
        process.exit(0);
      }
      inquirer
        .prompt([
          {
            name: "identifier",
            message: "Enter your email or username: ",
          },
          {
            type: "password",
            name: "password",
            message: "Enter your password: ",
          },
        ])
        .then(async (answers) => {
          const form = new FormData();
          form.set("identifier", answers.identifier);
          form.set("password", answers.password);
          const res = await fetch(`${endPoint}auth`, {
            method: "POST",
            body: form,
          }).then((res) => res.json());
          if (res.token) {
            settings.set("token", res.token);
            console.log(
              chalk.green.bold(
                `Logged in as ${res.user.username} (${res.user.email})`
              )
            );
          } else console.log(chalk.redBright(`${res.status}: ${res.message}`));
        });
      break;
    case "logout":
      settings.unset("token");
      console.log(chalk.green("You are logged out."));
      break;
    case "status":
      var json = JSON.parse(fs.readFileSync("./package.json").toString());
      console.log(
        "Confly v" + chalk.green(json.version) + " using " + getEndpoint()
      );
      console.log("Token: " + chalk.green(settings.get("token")));
      console.log("Project: " + chalk.green(getProjectId()));
      break;

    default:
      console.log(
        chalk.red("Unknown command. Use 'confly help' to see all commands.")
      );
      break;
  }
})();
