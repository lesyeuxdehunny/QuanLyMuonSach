import createAPI from "./api.service";

export default {
  login(username, password) {
    return createAPI.post("/auth/login", { username, password });
  },
};