import createAPI from "./api.service";

export default {
  login(username, password) {
    return createAPI.post("/auth/login", { username, password });
  },
  forgotPassword(email) {
    return createAPI.post("/auth/forgot-password", { email });
  },
  resetPassword(token, newPassword) {
    return createAPI.post("/auth/reset-password", { token, newPassword });
  },
};