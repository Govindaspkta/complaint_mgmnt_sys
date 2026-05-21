import api from "./axios";

export const googleLogin = (token) => {
  return api.post("/authx/google-login/", { token });
};

export const normalLogin = (data) => {
  return api.post("/authx/login/", data);
};