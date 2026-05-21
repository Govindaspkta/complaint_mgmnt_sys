import api from "./axios";

export const updateProfile = (formData) => {
  return api.post("/authx/profile-completion/", formData);
};