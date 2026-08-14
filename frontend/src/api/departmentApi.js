import api from "./axios";

export const getDepartments = () => api.get("/complaints/departments/");
export const createDepartment = (data) => api.post("/complaints/departments/", data);
export const updateDepartment = (id, data) =>
  api.put(`/complaints/departments/${id}/`, data);
export const deleteDepartment = (id) =>
  api.delete(`/complaints/departments/${id}/`);