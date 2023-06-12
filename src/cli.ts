#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { login, logout } from "./auth";
import { runDoctor } from "./utils/doctor";

yargs(hideBin(process.argv))
  .command(
    "login",
    "Authenticate with Confly",
    (yargs) => {},
    (argv) => {
      login();
    }
  )
  .command(
    "logout",
    "Logout of Confly",
    (yargs) => {},
    (argv) => {
      logout();
    }
  )
  .command(
    "doctor",
    "Check the health of your Confly CLI installation",
    (yargs) => {},
    (argv) => {
      runDoctor();
    }
  )
  .help()
  .demandCommand()
  .parse();
