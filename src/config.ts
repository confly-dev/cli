import { existsSync, readFileSync, writeFileSync } from "fs";
import os from "os";

type ConfigProperty = "authKey";

const userHomeDir = os.homedir();

function getFileLocation() {
  return `${userHomeDir}/.confly-cli`;
}

function getConfig(): any {
  if (!existsSync(getFileLocation())) {
    return {};
  }
  const config = JSON.parse(readFileSync(getFileLocation()).toString());

  return config;
}

function setConfig(config: any) {
  writeFileSync(
    getFileLocation(),
    Buffer.from(JSON.stringify(config)),
    "utf-8"
  );
}

export const config = {
  set: (key: ConfigProperty, value: string) => {
    setConfig({
      ...getConfig(),
      [key]: value,
    });
  },
  has: (key: ConfigProperty) => {
    return getConfig()[key] !== undefined;
  },
  get: (key: ConfigProperty) => {
    return getConfig()[key];
  },
  unset: (key: ConfigProperty) => {
    const config = getConfig();
    delete config[key];
    setConfig(config);
  },
};
