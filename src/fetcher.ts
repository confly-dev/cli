import axios from "axios";
import { existsSync } from "fs";

export const conflyFetcher = axios.create({
  baseURL: getEndpoint(),
});

function getEndpoint() {
  if (existsSync(".dev")) {
    return "http://localhost:3000/api/v1";
  }
  return "https://confly.dev/api/v1";
}
