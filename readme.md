View this page in our [Wiki](docs.confly.dev/cli).

# Command line interface

## What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16.14 or above:
  - When installing Node.js, make sure you have npm installed as well and everything added to path

## Installation

Use ` $ npm i -g @confly-dev/confly` to install the CLI globally.
Now you can call ` $ confly <command>` from anywhere you want and omit the `npx` from all the following commands.

## Commands

### `$ confly login`

This command requests your email and password for confly.dev and generates an authentication token.
This token is then saved locally and used for authentication with all other commands.
The token can also be viewed and deleted in the dashboard.

### `$ confly init`

Initialize a confly project in the current folder by either creating a new one or choosing an existing project.
This creates a file called `confly.structure.json` containing the structure for your projects web interface.
The structure can be updated and pushed to the server with `$ npx confly push`.

### `$ confly push`

Overwrite/Update the structure currently on the server with the one from your local `confly.structure.json` file.

### `$ confly pull`

Overwrite/Update the structure currently in your local `confly.structure.json` file with the one from the server.

### `$ confly logout`

This command erases the locally saved token but does not delete the token from server.
If your token somehow got leaked please make sure to delete it by heading over to the token section in the dashboard.

### `$ confly version`

Shows the current installed version of the CLI.
