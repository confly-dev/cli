import FormData from "form-data";
import { conflyFetcher } from "./fetcher";

export const conflyApi = {
  async testAuthKey(key: string) {
    return await conflyFetcher
      .get("/auth", {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      })
      .catch();
  },
  async login(identifier: string, password: string) {
    return await conflyFetcher.post("/auth", {
      identifier,
      password,
    });
  },
};
