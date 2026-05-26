import api from "./axios";

// GET ALL
export const getCategories = () => {
  return api.get("/complaints/categories/");
};

// CREATE
export const createCategory = (data) => {
  return api.post("/complaints/categories/", data);
};

// UPDATE
export const updateCategory = (reference_id, data) => {
  return api.patch(`/complaints/categories/${reference_id}`, data);
};

// DELETE
export const deleteCategory = (reference_id) => {
  return api.delete(`/complaints/categories/${reference_id}`);
};